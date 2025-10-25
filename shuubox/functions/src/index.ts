// functions/src/index.ts
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({ origin: true });

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_INFO_URL = "https://discord.com/api/users/@me";

const LOCAL_REDIRECT =
  "http://127.0.0.1:5001/shuubox-cba9b/us-central1/discordOAuthRedirect";
// const PROD_REDIRECT = "https://us-central1-shuubox-cba9b.cloudfunctions.net/discordOAuthRedirect";
const FRONTEND_CALLBACK_URL = "http://localhost:3000/auth/callback";

/**
 * 1. GET DISCORD AUTH URL
 * Called by the frontend. Now accepts a 'state' param.
 */
export const getDiscordAuthURL = onCall(async (request) => {
  const state = request.data.state;
  if (!state || typeof state !== "string") {
    throw new HttpsError("invalid-argument", "A 'state' string must be provided.");
  }

  const clientId = functions.config().discord.client_id;
  if (!clientId) {
    throw new HttpsError("failed-precondition", "Missing config: set discord.client_id.");
  }

  const redirectUri = LOCAL_REDIRECT; // keep this single source of truth

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,           // do not pre-encode here
    response_type: "code",
    scope: "identify email",
    state,
  });

  // Log this exact URL and click it manually if needed
  const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  console.log("Authorize URL:", url);

  return { url };
});


/**
 * 2. DISCORD OAUTH REDIRECT
 * Called by Discord after user authorizes.
 * Finds/creates a user, and returns a custom token.
 */

/**
 * 2. DISCORD OAUTH REDIRECT
 * Called by Discord after user authorizes.
 * Finds/creates a user, and returns a custom token.
 */
export const discordOAuthRedirect = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // --- SINGLE SOURCE OF TRUTH: must match what you used in /authorize exactly ---
    const REDIRECT_URI = LOCAL_REDIRECT; // or PROD_REDIRECT when deployed
    const FRONTEND = FRONTEND_CALLBACK_URL; // http://localhost:3000/auth/callback

    // Read these outside try so we can use them in catch safely
    const { code, state } = req.query as { code?: string; state?: string };

    // Breadcrumbs help pinpoint the failing step
    const log = (step: string, extra: any = {}) =>
      console.log(`[OAuth] ${step}`, extra);

    try {
      log("A: received query", { hasCode: !!code, hasState: !!state });

      if (!code || typeof code !== "string") throw new Error("No code received from Discord.");
      if (!state || typeof state !== "string") throw new Error("Missing state.");

      const clientId = functions.config().discord.client_id;
      const clientSecret = functions.config().discord.client_secret;
      if (!clientId || !clientSecret) throw new Error("Missing config (client_id / client_secret).");

      // --- Part 1: Exchange code for token ---
      log("B: exchanging code for tokens", { redirectUri: REDIRECT_URI });

      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI, // MUST be identical to /authorize
      });

      const tokenResp = await axios.post(TOKEN_URL, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // timeout: 10000, // optional
      });

      log("C: token response OK", {
        hasAccess: !!tokenResp.data?.access_token,
        hasRefresh: !!tokenResp.data?.refresh_token,
        tokenType: tokenResp.data?.token_type,
        scope: tokenResp.data?.scope,
      });

      const accessToken = tokenResp.data?.access_token as string | undefined;
      if (!accessToken) throw new Error("Token exchange succeeded but no access_token returned.");

      // --- Part 2: Get Discord User Info ---
      log("D: fetching /users/@me");

      const meResp = await axios.get(USER_INFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const discordUser = meResp.data as any;

      log("E: got user", {
        id: discordUser?.id,
        email: discordUser?.email,
        username: discordUser?.username,
      });

      if (!discordUser.email) {
        // If this hits, you likely didn’t request "email" in your /authorize scope.
        throw new Error(
          "Discord account has no email. Ensure scope includes 'email' and the Discord account has a verified email."
        );
      }

      // --- Part 3: Find or Create Firebase User ---
      log("F: linking/creating Firebase user");

      let firebaseUID: string;
      try {
        const userRecord = await admin.auth().getUserByEmail(discordUser.email);
        firebaseUID = userRecord.uid;
      } catch (e: any) {
        if (e?.code === "auth/user-not-found") {
          const newUser = await admin.auth().createUser({
            email: discordUser.email,
            emailVerified: !!discordUser.verified,
            displayName: discordUser.global_name || discordUser.username,
            photoURL: discordUser.avatar
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : null,
          });
          firebaseUID = newUser.uid;
        } else {
          throw e;
        }
      }

      // --- Part 4: Save Discord data (optional but nice) ---
      log("G: saving Discord info to Firestore");

      const discordInfo = {
        id: discordUser.id,
        username: `${discordUser.username}#${discordUser.discriminator}`,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : null,
        email: discordUser.email,
      };

      await db.collection("users").doc(firebaseUID).set(
        { discord: discordInfo, email: discordUser.email },
        { merge: true }
      );

      // --- Part 5: Create Custom Token & Redirect to frontend ---
      log("H: issuing custom token and redirecting");

      const customToken = await admin.auth().createCustomToken(firebaseUID);

      return res.redirect(
        `${FRONTEND}?token=${encodeURIComponent(customToken)}&state=${encodeURIComponent(state)}`
      );
    } catch (e: any) {
      // Surface the REAL cause back to your /auth/callback page
      const details =
        e?.response?.data
          ? (typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data))
          : (e?.message || "Unknown error");

      console.error("OAuth redirect failed:", {
        message: e?.message,
        code: e?.code,
        responseStatus: e?.response?.status,
        responseData: e?.response?.data,
      });

      const safeState = typeof state === "string" ? state : "";

      return res.redirect(
        `${FRONTEND}?error=${encodeURIComponent(details)}&state=${encodeURIComponent(safeState)}`
      );
    }
  });
});

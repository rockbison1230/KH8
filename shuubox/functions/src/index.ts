// functions/src/index.ts
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_INFO_URL = "https://discord.com/api/users/@me";

// ✅ Use prod redirect (stable)
const PROD_REDIRECT =
  "https://us-central1-shuubox-cba9b.cloudfunctions.net/discordOAuthRedirect";
const LOCAL_REDIRECT = PROD_REDIRECT;

// ✅ Your Codespace FRONTEND callback (not localhost)
const FRONTEND_CALLBACK_URL =
  "https://shadowy-owl-7v97p7qxq493r9v4-3000.app.github.dev/auth/callback";

// Allow your Codespace origin for the redirect handler (optional hardening)
const corsHandler = cors({
  origin: [
    "https://shadowy-owl-7v97p7qxq493r9v4-3000.app.github.dev",
    "http://localhost:3000", // keep if you also test locally
  ],
});

/** 1) Callable to get the authorize URL (optional if you now build it client-side) */
export const getDiscordAuthURL = onCall({ region: "us-central1" }, async (request) => {
  const state = request.data?.state;
  if (!state || typeof state !== "string") {
    throw new HttpsError("invalid-argument", "A 'state' string must be provided.");
  }

  const clientId = functions.config().discord?.client_id;
  if (!clientId) {
    throw new HttpsError("failed-precondition", "Missing config: set discord.client_id.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: LOCAL_REDIRECT,
    response_type: "code",
    scope: "identify email",
    state,
  });

  const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  console.log("Authorize URL:", url);
  return { url };
});

/** 2) Redirect handler: exchanges code, creates custom token, sends user back to frontend */
export const discordOAuthRedirect = onRequest({ region: "us-central1" }, (req, res) => {
  corsHandler(req, res, async () => {
    const REDIRECT_URI = LOCAL_REDIRECT;
    const FRONTEND = FRONTEND_CALLBACK_URL;

    const { code, state } = req.query as { code?: string; state?: string };
    const log = (step: string, extra: any = {}) => console.log(`[OAuth] ${step}`, extra);

    try {
      log("A: received query", { hasCode: !!code, hasState: !!state });
      if (!code || typeof code !== "string") throw new Error("No code received from Discord.");
      if (!state || typeof state !== "string") throw new Error("Missing state.");

      const clientId = functions.config().discord?.client_id;
      const clientSecret = functions.config().discord?.client_secret;
      if (!clientId || !clientSecret) throw new Error("Missing config (client_id / client_secret).");

      log("B0: config sanity", {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        redirectUri: REDIRECT_URI,
        state,
        codePreview: code.slice(0, 6) + "...",
      });

      // Exchange code for tokens
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      });

      log("B: exchanging code for tokens", { redirectUri: REDIRECT_URI });
      const tokenResp = await axios.post(TOKEN_URL, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      log("C: token response OK", {
        hasAccess: !!tokenResp.data?.access_token,
        tokenType: tokenResp.data?.token_type,
        scope: tokenResp.data?.scope,
      });

      const accessToken = tokenResp.data?.access_token as string | undefined;
      if (!accessToken) throw new Error("Token exchange succeeded but no access_token returned.");

      // Fetch user
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
        throw new Error(
          "Discord account has no email. Ensure scope includes 'email' and the account has a verified email."
        );
      }

      // Find/create Firebase user
      log("F: linking/creating Firebase user");
      let firebaseUID: string;
      try {
        const rec = await admin.auth().getUserByEmail(discordUser.email);
        firebaseUID = rec.uid;
      } catch (e: any) {
        if (e?.code === "auth/user-not-found") {
          const created = await admin.auth().createUser({
            email: discordUser.email,
            emailVerified: !!discordUser.verified,
            displayName: discordUser.global_name || discordUser.username,
            photoURL: discordUser.avatar
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : null,
          });
          firebaseUID = created.uid;
        } else {
          throw e;
        }
      }

      // Save Discord info (optional)
      log("G: saving Discord info to Firestore");
      const tag =
        typeof discordUser.discriminator === "string" && discordUser.discriminator !== "0"
          ? `#${discordUser.discriminator}`
          : "";

      const discordInfo = {
        id: discordUser.id,
        username: `${discordUser.username}${tag}`,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : null,
        email: discordUser.email,
      };

      await db.collection("users").doc(firebaseUID).set(
        { discord: discordInfo, email: discordUser.email },
        { merge: true }
      );

      // Custom token + redirect to frontend
      log("H: issuing custom token and redirecting");
      const customToken = await admin.auth().createCustomToken(firebaseUID);

      return res.redirect(
        `${FRONTEND}?token=${encodeURIComponent(customToken)}&state=${encodeURIComponent(state)}`
      );
    } catch (e: any) {
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

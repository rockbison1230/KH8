// functions/src/index.ts
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Discord API endpoints
const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_INFO_URL = "https://discord.com/api/users/@me";

// === CONFIGURATION ===

// 1. This is your DEPLOYED function's URL.
//    Discord will redirect the user HERE after they authorize.
const FUNCTION_REDIRECT_URL =
  "https://discordoauthredirect-zdqm753jtq-uc.a.run.app";

// 2. This is your FRONTEND's URL.
//    This function will send the user BACK HERE after logging them in.
const FRONTEND_CALLBACK_URL =
  "https://shadowy-owl-7v97p7qxq493r9v4-3000.app.github.dev/auth/callback";

// 3. Configure CORS to allow requests from your Codespace frontend
const corsHandler = cors({
  origin: "https://shadowy-owl-7v97p7qxq493r9v4-3000.app.github.dev",
});

/**
 * This is the main redirect handler.
 * It exchanges the Discord code for a token, creates/finds the Firebase user,
 * and redirects back to your frontend with a custom login token.
 */
export const discordOAuthRedirect = onRequest(
  {
    region: "us-central1", // Specify your region
    secrets: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"], // Opt-in to secrets
  },
  (req, res) => {
    // Handle CORS preflight requests
    corsHandler(req, res, async () => {
      const { code, state } = req.query as { code?: string; state?: string };
      const log = (step: string, extra: any = {}) => console.log(`[OAuth] ${step}`, extra);

      try {
        log("A: received query", { hasCode: !!code, hasState: !!state });
        if (!code || typeof code !== "string") {
          throw new Error("No code received from Discord.");
        }
        if (!state || typeof state !== "string") {
          throw new Error("Missing state.");
        }

        // Use process.env (v2 style) to get secrets
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          log("B0: Missing server config", { hasCid: !!clientId, hasCs: !!clientSecret });
          throw new Error("Missing server config (client_id / client_secret).");
        }

        // 1. Exchange code for tokens
        const body = new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: FUNCTION_REDIRECT_URL, // Use the deployed function URL
        });

        log("B: exchanging code for tokens");
        const tokenResp = await axios.post(TOKEN_URL, body.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const accessToken = tokenResp.data?.access_token as string | undefined;
        if (!accessToken) {
          throw new Error("Token exchange succeeded but no access_token returned.");
        }
        log("C: token response OK");

        // 2. Fetch Discord user info
        log("D: fetching /users/@me");
        const meResp = await axios.get(USER_INFO_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const discordUser = meResp.data as any;
        log("E: got user", { id: discordUser?.id, email: discordUser?.email });

        if (!discordUser.email) {
          throw new Error(
            "Discord account has no email. Ensure scope includes 'email' and the account has a verified email."
          );
        }

        // 3. Find or create Firebase user
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
            throw e; // Re-throw other errors
          }
        }

        // 4. Save Discord info to Firestore (optional, but good practice)
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
          { discord: discordInfo, email: discordUser.email, hasCompletedOnboarding: false },
          { merge: true }
        );

        // 5. Create custom token and redirect to frontend
        log("H: issuing custom token and redirecting");
        const customToken = await admin.auth().createCustomToken(firebaseUID);

        // Redirect back to your Codespace frontend
        return res.redirect(
          `${FRONTEND_CALLBACK_URL}?token=${encodeURIComponent(customToken)}&state=${encodeURIComponent(state)}`
        );
      } catch (e: any) {
        // Handle errors
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
        
        // Redirect back to your Codespace frontend with an error
        return res.redirect(
          `${FRONTEND_CALLBACK_URL}?error=${encodeURIComponent(details)}&state=${encodeURIComponent(safeState)}`
        );
      }
    });
  }
);

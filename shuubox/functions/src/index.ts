import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";
import * as functionsV1 from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https"; // Import HttpsError and onCall

// --- Admin ---
admin.initializeApp();
const db = admin.firestore();

// --- Discord endpoints ---
const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_INFO_URL = "https://discord.com/api/users/@me";

// --- Runtime params (configure via `firebase functions:params:set`) ---
const FRONTEND_BASE_URL_PARAM = defineString("FRONTEND_BASE_URL");
const FUNCTION_REDIRECT_URL_PARAM = defineString("FUNCTION_REDIRECT_URL");

// --- CORS ---
// Allow localhost and your Vercel deployments
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://shuubox.vercel.app",
  "https://kh-8.vercel.app",
];
const corsHandler = cors({ origin: allowedOrigins });


// ====================================================================
// 🚨 MISSING FUNCTION: getDiscordAuthURL (Callable Function)
// This function is called by the frontend to get the Discord URL
// ====================================================================

export const getDiscordAuthURL = onCall(async (request) => {
  const state = request.data.state;
  if (!state || typeof state !== "string") {
    throw new HttpsError("invalid-argument", "A 'state' string must be provided.");
  }

  // --- Read Parameters ---
  const runtimeConfig = functionsV1.config().runtime || {};
  const redirectUri = runtimeConfig.function_redirect_url || FUNCTION_REDIRECT_URL_PARAM.value();

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    throw new HttpsError("failed-precondition", "Missing config: set discord.client_id.");
  }
  
  if (!redirectUri) {
     throw new HttpsError("failed-precondition", "Function parameters (redirect URL) are not configured.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,          
    response_type: "code",
    scope: "identify email",
    state,
  });

  const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  return { url };
});


// ====================================================================
// EXISTING FUNCTION: discordOAuthRedirect (HTTP Handler)
// This is the function that Discord redirects to
// ====================================================================

export const discordOAuthRedirect = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 15,
    secrets: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"],
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      const { code, state } = req.query as { code?: string; state?: string };
      const log = (step: string, extra: any = {}) =>
        console.log(`[OAuth] ${step}`, extra);

      // --- 🚨 CRITICAL FIX: READ PARAMETERS FROM LEGACY CONFIG OBJECT 🚨 ---
      const runtimeConfig = functionsV1.config().runtime || {};
      
      // Get parameters needed for the redirect logic
      const redirectUri = runtimeConfig.function_redirect_url || FUNCTION_REDIRECT_URL_PARAM.value();
      const frontendBaseUrl = runtimeConfig.frontend_base_url || FRONTEND_BASE_URL_PARAM.value();

      try {
        log("A: received query", { hasCode: !!code, hasState: !!state });
        if (!code || typeof code !== "string") throw new Error("No code.");
        if (!state || typeof state !== "string") throw new Error("Missing state.");

        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
          log("B0: Missing secrets", { hasCid: !!clientId, hasCs: !!clientSecret });
          throw new Error("Server not configured (client_id/secret).");
        }
        
        if (!redirectUri || !frontendBaseUrl) {
           throw new Error("Function parameters (redirect/frontend URLs) are not configured.");
        }

        // 1) Exchange code -> token (redirect_uri **must exactly match** the one registered in Discord)
        const body = new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        });

        log("B: exchanging code for tokens", { redirectUri });
        const tokenResp = await axios.post(TOKEN_URL, body.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const accessToken = tokenResp.data?.access_token as string | undefined;
        if (!accessToken) throw new Error("No access_token returned.");
        log("C: token response OK", {
          hasRefresh: !!tokenResp.data?.refresh_token,
          scope: tokenResp.data?.scope,
        });

        // 2) Get Discord user
        log("D: fetching /users/@me");
        const meResp = await axios.get(USER_INFO_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = meResp.data as any;
        log("E: got user", { id: user?.id, email: user?.email });

        if (!user?.email) {
          throw new Error(
            "Discord account has no email. Add 'email' scope and ensure the account has a verified email."
          );
        }

        // 3) Upsert Firebase user
        log("F: linking/creating Firebase user");
        let uid: string;
        try {
          const found = await admin.auth().getUserByEmail(user.email);
          uid = found.uid;
        } catch (e: any) {
          if (e?.code === "auth/user-not-found") {
            const created = await admin.auth().createUser({
              email: user.email,
              emailVerified: !!user.verified,
              displayName: user.global_name || user.username,
              photoURL: user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : undefined,
            });
            uid = created.uid;
          } else {
            throw e;
          }
        }

        // 4) Persist Discord info (optional)
        const tag =
          typeof user.discriminator === "string" && user.discriminator !== "0"
            ? `#${user.discriminator}`
            : "";

        await db
          .collection("users")
          .doc(uid)
          .set(
            {
              email: user.email,
              hasCompletedOnboarding: false,
              discord: {
                id: user.id,
                username: `${user.username}${tag}`,
                avatar: user.avatar
                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                  : null,
                email: user.email,
              },
            },
            { merge: true }
          );

        // 5) Sign-in handoff
        log("H: issuing custom token and redirecting");
        const customToken = await admin.auth().createCustomToken(uid);
        const frontend = frontendBaseUrl.replace(/\/+$/, "");
        return res.redirect(
          `${frontend}/auth/callback?token=${encodeURIComponent(
            customToken
          )}&state=${encodeURIComponent(state)}`
        );
      } catch (e: any) {
        const details =
          e?.response?.data
            ? typeof e.response.data === "string"
              ? e.response.data
              : JSON.stringify(e.response.data)
            : e?.message || "Unknown error";

        console.error("OAuth redirect failed:", {
          message: e?.message,
          code: e?.code,
          responseStatus: e?.response?.status,
          responseData: e?.response?.data,
        });

        const frontend = frontendBaseUrl.replace(/\/+$/, "");
        const safeState = typeof state === "string" ? state : "";
        return res.redirect(
          `${frontend}/auth/callback?error=${encodeURIComponent(
            details
          )}&state=${encodeURIComponent(safeState)}`
        );
      }
    });
  }
);


    

"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/Components/AppHeader";

export default function SignUpPage() {
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  function makeState(): string {
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr, n => n.toString(36)).join("");
  }

  function buildDiscordAuthorizeURL(state: string) {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    if (!clientId) throw new Error("Missing NEXT_PUBLIC_DISCORD_CLIENT_ID");

    const redirectUri =
      process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
      || "https://discordoauthredirect-zdqm753jtq-uc.a.run.app"; // your run.app URL

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify email",
      state,
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  async function handleDiscordSignup() {
    try {
      setError("");
      setAuthing(true);

   const state = makeState();
localStorage.setItem("oauth_state", state);
localStorage.setItem("oauth_state_ts", String(Date.now())); 


      const url = buildDiscordAuthorizeURL(state);
      console.log("[OAuth] authorize URL", url);
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to start Discord signup.");
      setAuthing(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-[#231F20] mb-12">Sign Up</h1>

        <div className="flex flex-col gap-5 w-full max-w-sm">
          <Link
            href="/signup/email"
            className="flex items-center justify-center w-full font-semibold text-lg text-black bg-[#FFEBFF] border-2 border-black rounded-full py-4 px-10 transition-all hover:shadow-md hover:scale-105"
          >
            Continue With Email
          </Link>

          <button
            onClick={handleDiscordSignup}
            disabled={authing}
            className="flex items-center justify-center w-full font-semibold text-lg text-black bg-[#C7C6FF] border-2 border-black rounded-full py-4 px-10 transition-all hover:shadow-md hover:scale-105 disabled:opacity-50"
          >
            {authing ? "Redirecting..." : "Continue With Discord"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

        <p className="text-lg text-black mt-12">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#3CB7AE] hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/Components/AppHeader";

export default function LoginPage() {
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  function makeState(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  }

  function buildDiscordAuthorizeURL(state: string) {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID?.trim();
    const functionRedirect = process.env.NEXT_PUBLIC_FUNCTION_REDIRECT_URL?.trim();

    if (!clientId) throw new Error("Missing NEXT_PUBLIC_DISCORD_CLIENT_ID");
    if (!functionRedirect) throw new Error("Missing NEXT_PUBLIC_FUNCTION_REDIRECT_URL");

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: functionRedirect,  // must match Discord portal exactly
      scope: "identify email",         // space will encode to %20
      state,
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  async function handleDiscordLogin() {
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
      setError(err?.message || "Failed to start Discord login.");
      setAuthing(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-[#231F20] mb-12">Log In</h1>

        <div className="flex flex-col gap-5 w-full max-w-sm">
          <Link
            href="/login/email"
            className="flex items-center justify-center w-full font-semibold text-lg text-black bg-[#FFEBFF] border-2 border-black rounded-full py-4 px-10 transition-all hover:shadow-md hover:scale-105"
          >
            Continue With Email
          </Link>

          <button
            onClick={handleDiscordLogin}
            disabled={authing}
            className="flex items-center justify-center w-full font-semibold text-lg text-black bg-[#C7C6FF] border-2 border-black rounded-full py-4 px-10 transition-all hover:shadow-md hover:scale-105 disabled:opacity-50"
          >
            {authing ? "Redirecting..." : "Continue With Discord"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

        <p className="text-lg text-black mt-12">
          Already have an account?{" "}
          <Link href="/signup" className="font-bold text-[#3CB7AE] hover:underline">
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}

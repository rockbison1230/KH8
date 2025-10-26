import { Suspense } from "react";
import { AuthCallbackClient } from "@/Components/AuthCallbackClient";

// Prevent prerendering/static export for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="rounded-lg bg-white p-8 shadow-md text-center">
            <p className="text-lg font-medium">Authenticating, please wait...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}

"use client";

import { normalizeAuthRedirect } from "@/lib/authRedirect";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import { useStore } from "@/lib/useStore";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>
          ) => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  mode: "login" | "signup";
  redirectPath?: string;
}

export default function GoogleAuthButton({
  mode,
  redirectPath,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const googleLogin = useStore((state) => state.googleLogin);
  const [scriptReady, setScriptReady] = useState(false);
  const [pending, setPending] = useState(false);
  const containerId = useId().replace(/:/g, "");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const nextPath = normalizeAuthRedirect(redirectPath);

  useEffect(() => {
    if (!scriptReady || !clientId || !window.google) {
      return;
    }

    const container = document.getElementById(containerId);

    if (!container) {
      return;
    }

    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        if (!credential) {
          toast.error("Google sign-in failed. Please try again.");
          return;
        }

        try {
          setPending(true);
          await googleLogin(credential);
          toast.success(
            mode === "login"
              ? "Signed in with Google."
              : "Account created with Google."
          );
          router.push(nextPath);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to continue with Google.";
          toast.error(message);
        } finally {
          setPending(false);
        }
      },
    });

    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: mode === "login" ? "signin_with" : "signup_with",
      shape: "rectangular",
    });
  }, [clientId, containerId, googleLogin, mode, nextPath, router, scriptReady]);

  if (!clientId) {
    return (
      <div className="rounded-sm border border-dashed border-gray-300 px-4 py-3 text-center text-xs text-gray-500">
        Google sign-in is not configured. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>
        <div className={pending ? "pointer-events-none opacity-70" : ""}>
          <div id={containerId} className="flex justify-center" />
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/useStore";

export default function DemoSessionBootstrap() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const token = useStore((state) => state.token);
  const ensureDemoSession = useStore((state) => state.ensureDemoSession);

  useEffect(() => {
    if (isLoggedIn && token) {
      return;
    }

    void ensureDemoSession().catch(() => {
      // Keep the app usable even if demo auth is temporarily unavailable.
    });
  }, [ensureDemoSession, isLoggedIn, token]);

  return null;
}

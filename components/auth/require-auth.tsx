"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen py-40 text-center text-lg opacity-70">
        Sprawdzanie sesji…
      </div>
    );
  }

  if (!session) {
    return <div className="w-full min-h-screen py-40 text-center text-lg opacity-70">Zaloguj się, aby uzyskać dostęp do tej strony.</div>;
  }

  return <>{children}</>;
}

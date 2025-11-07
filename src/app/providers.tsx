'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Force a router refresh to ensure session is synced
    router.refresh();
  }, []);

  return <SessionProvider refetchInterval={0}>{children}</SessionProvider>;
}

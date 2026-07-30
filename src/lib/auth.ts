import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Where to send people back to after they finish signing in — read by
// /auth/callback once Supabase hands control back to the app.
function buildRedirectTo(next: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signInWithGoogle(next: string) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: buildRedirectTo(next) },
  });
  if (error) throw error;
}

// Passwordless email login — sends a one-time magic link, no password to
// manage. Matches the frictionless feel of the OAuth options.
export async function signInWithEmail(email: string, next: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: buildRedirectTo(next) },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// Reactive session hook — any component can call useAuth() to know if the
// visitor is signed in, without prop-drilling. loading is true only for the
// brief initial check; after that it's always false, even while signed out.
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user ?? null;
  return { user, session, loading, isSignedIn: !!user };
}
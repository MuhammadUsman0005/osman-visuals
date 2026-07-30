import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>): { next?: string } => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const { next } = Route.useSearch();
  const { isSignedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    // Whether sign-in succeeded or the visitor landed here some other way,
    // send them on to where they meant to go (or home as a safe fallback).
    navigate({ to: next && next.startsWith("/") ? next : "/", replace: true });
  }, [loading, isSignedIn, next, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="eyebrow">Osman Visuals</p>
        <p className="mt-3 font-display text-2xl text-bone">Signing you in…</p>
      </div>
    </div>
  );
}
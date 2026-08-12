"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 font-display text-3xl text-cream">Sign in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="stencil-tag block pb-1.5">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-panelLine bg-panel px-3 py-2.5 text-cream outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="password" className="stencil-tag block pb-1.5">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-panelLine bg-panel px-3 py-2.5 text-cream outline-none focus:border-amber"
          />
        </div>
        {error && <p className="text-xs text-rust">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-amber px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-cream disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-smoke">
        New to Rotary?{" "}
        <Link href="/register" className="text-amber hover:text-cream">
          Create an account
        </Link>
      </p>
    </div>
  );
}

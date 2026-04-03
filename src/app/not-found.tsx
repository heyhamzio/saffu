import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center space-y-3 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">404</p>
      <h1 className="text-3xl font-bold text-slate-900">This page went out for chai.</h1>
      <p className="text-sm text-slate-600">Try heading back to the portfolio home or blog list.</p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Home
        </Link>
        <Link
          href="/blog"
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Blog
        </Link>
      </div>
    </main>
  );
}

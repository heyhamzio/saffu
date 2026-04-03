import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Saffu Portfolio",
  description: "Articles and case studies by Hamza Shaikh."
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Blog</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Articles & case studies</h1>
        <p className="text-sm text-slate-600">Practical notes on design, frontend engineering, and shipping products.</p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">{new Date(post.publishedAt).toLocaleDateString("en-IN")}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-pink-600">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Link href="/" className="inline-flex text-sm font-semibold text-pink-600 hover:text-pink-700">
        ← Back to homepage
      </Link>
    </main>
  );
}

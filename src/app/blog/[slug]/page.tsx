import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Saffu Blog`,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <Link href="/blog" className="inline-flex text-sm font-semibold text-pink-600 hover:text-pink-700">
        ← Back to blog
      </Link>

      <header className="space-y-2">
        <p className="text-xs text-slate-500">{new Date(post.publishedAt).toLocaleDateString("en-IN")}</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
        <p className="text-sm text-slate-600">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-6">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    </main>
  );
}

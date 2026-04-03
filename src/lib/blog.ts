import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { MongoClient } from "mongodb";
import { serverEnv } from "@/lib/config/env";

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

interface BlogRepository {
  listPosts(): Promise<BlogPostMeta[]>;
  getBySlug(slug: string): Promise<BlogPost | null>;
}

class LocalMdxBlogRepository implements BlogRepository {
  async listPosts(): Promise<BlogPostMeta[]> {
    const files = await fs.readdir(BLOG_DIR);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const fullPath = path.join(BLOG_DIR, file);
        const raw = await fs.readFile(fullPath, "utf8");
        const { data } = matter(raw);
        return {
          slug,
          title: String(data.title ?? slug),
          excerpt: String(data.excerpt ?? ""),
          publishedAt: String(data.publishedAt ?? "1970-01-01"),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : []
        };
      })
    );

    return sortPosts(posts);
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        excerpt: String(data.excerpt ?? ""),
        publishedAt: String(data.publishedAt ?? "1970-01-01"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        content
      };
    } catch {
      return null;
    }
  }
}

class MongoBlogRepository implements BlogRepository {
  constructor(
    private readonly uri: string,
    private readonly dbName: string,
    private readonly collectionName: string
  ) {}

  async listPosts(): Promise<BlogPostMeta[]> {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const docs = await client
        .db(this.dbName)
        .collection(this.collectionName)
        .find({})
        .project({ _id: 0, slug: 1, title: 1, excerpt: 1, publishedAt: 1, tags: 1 })
        .toArray();
      const posts = docs.map((doc) => ({
        slug: String(doc.slug),
        title: String(doc.title ?? doc.slug),
        excerpt: String(doc.excerpt ?? ""),
        publishedAt: String(doc.publishedAt ?? "1970-01-01"),
        tags: Array.isArray(doc.tags) ? doc.tags.map(String) : []
      }));
      return sortPosts(posts);
    } finally {
      await client.close();
    }
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const doc = await client.db(this.dbName).collection(this.collectionName).findOne({ slug });
      if (!doc) return null;
      return {
        slug: String(doc.slug),
        title: String(doc.title ?? slug),
        excerpt: String(doc.excerpt ?? ""),
        publishedAt: String(doc.publishedAt ?? "1970-01-01"),
        tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
        content: String(doc.content ?? "")
      };
    } finally {
      await client.close();
    }
  }
}

let repositorySingleton: BlogRepository | null = null;

function getBlogRepository(): BlogRepository {
  if (repositorySingleton) return repositorySingleton;
  const mongoUri = serverEnv.MONGODB_URI;
  const mongoDb = serverEnv.MONGODB_DB_NAME;
  const canUseMongo = serverEnv.BLOG_PROVIDER === "mongo" && Boolean(mongoUri) && Boolean(mongoDb);
  repositorySingleton =
    canUseMongo && mongoUri && mongoDb
      ? new MongoBlogRepository(mongoUri, mongoDb, serverEnv.MONGODB_BLOG_COLLECTION)
      : new LocalMdxBlogRepository();
  return repositorySingleton;
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return getBlogRepository().listPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogRepository().getBySlug(slug);
}

function sortPosts(posts: BlogPostMeta[]): BlogPostMeta[] {
  return posts.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
}

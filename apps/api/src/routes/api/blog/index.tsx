import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { SessionResponse } from "../../../lib/auth";

interface Post {
  id: string;
  slug: string;
  language: string;
  title: string;
  description: string;
  content: string;
  thumbnailKey: string | null;
  author: string;
  tags: { id: string; name: string; showcase: boolean }[];
  status: "draft" | "published";
  publishedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface SearchParams {
  language?: "en" | "id";
  status?: "draft" | "published";
}

export const Route = createFileRoute("/api/blog/")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): SearchParams => ({
    language:
      search.language === "en" || search.language === "id"
        ? search.language
        : undefined,
    status:
      search.status === "draft" || search.status === "published"
        ? search.status
        : undefined,
  }),
  component: BlogDashboardComponent,
});

function BlogDashboardComponent(): ReactNode {
  const [session, setSession] = useState<{ user: NonNullable<SessionResponse["user"]> } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname + window.location.search;

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then(r => r.json() as Promise<SessionResponse>)
      .then((data: SessionResponse) => {
        if (!data.user) {
          navigate({ to: "/login", search: { redirect: pathname } });
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked || !session) return <div className="p-8 text-center">Loading...</div>;

  const search = useSearch({ from: Route.id });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.language) params.set("language", search.language);
      if (search.status) params.set("status", search.status);
      const res = await fetch(`/api/blog/posts?${params}`);
      if (res.ok) {
        const data = (await res.json()) as Post[];
        setPosts(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search.language, search.status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (slug: string, language: string): Promise<void> => {
    if (!confirm("Delete this post?")) return;
    setDeleting(`${slug}_${language}`);
    try {
      const res = await fetch(`/api/blog/posts/${slug}?language=${language}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter(p => !(p.slug === slug && p.language === language)));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const setFilter = (
    key: keyof SearchParams,
    value: string | undefined,
  ): void => {
    navigate({ to: "/api/blog" as const,
      search: { ...search, [key]: value || undefined } as any,
    });
  };

  const asLang = (lang: string): "en" | "id" =>
    lang === "id" ? "id" : "en";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <Link
          to="/api/blog/new"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          + New Post
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={search.language ?? ""}
          onChange={(e) => setFilter("language", e.target.value || undefined)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="id">Indonesian</option>
        </select>

        <select
          value={search.status ?? ""}
          onChange={(e) => setFilter("status", e.target.value || undefined)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">No posts found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: "var(--color-secondary)" }}>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Language</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tags</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border" style={{ "--tw-bg-opacity": "1" } as React.CSSProperties}>
                  <td className="px-4 py-3">
                    <Link
                      to="/api/blog/$slug"
                      params={{ slug: post.slug }}
                      search={{ language: asLang(post.language) }}
                      className="font-medium text-accent hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-foreground" style={{ backgroundColor: "var(--color-secondary)" }}>
                      {post.language === "en" ? "EN" : "ID"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "text-accent"
                          : "text-accent-yellow"
                      }`}
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-accent"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/api/blog/$slug"
                        params={{ slug: post.slug }}
                        search={{ language: asLang(post.language) }}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-card"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.slug, post.language)}
                        disabled={deleting === `${post.slug}_${post.language}`}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-card disabled:opacity-50"
                      >
                        {deleting === `${post.slug}_${post.language}` ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

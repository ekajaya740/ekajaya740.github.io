import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

interface Post {
  id: string;
  slug: string;
  language: string;
  title: string;
  description: string;
  content: string;
  thumbnailKey: string | null;
  author: string;
  tags: string;
  status: "draft" | "published";
  publishedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface SearchParams {
  language?: "en" | "id";
  status?: "draft" | "published";
}

export const Route = createFileRoute("/admin/blog/")({
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
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.language) params.set("language", search.language);
      if (search.status) params.set("status", search.status);
      const res = await fetch(`/api/blog/posts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = (await res.json()) as Post[];
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search.language, search.status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (slug: string, language: string): Promise<void> => {
    if (
      !window.confirm(
        `Delete post "${slug}" (${language})? This cannot be undone.`,
      )
    ) {
      return;
    }
    const key = `${slug}_${language}`;
    setDeleting(key);
    try {
      const res = await fetch(
        `/api/blog/posts/${slug}?language=${language}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to delete post");
      await fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const setFilter = (
    key: keyof SearchParams,
    value: string | undefined,
  ): void => {
    navigate({
      search: ((prev: SearchParams) =>
        ({ ...prev, [key]: value })) as any,
    });
  };

  const asLang = (lang: string): "en" | "id" =>
    lang === "id" ? "id" : "en";

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={search.language ?? ""}
          onChange={(e) => setFilter("language", e.target.value || undefined)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="id">Indonesian</option>
        </select>

        <select
          value={search.status ?? ""}
          onChange={(e) => setFilter("status", e.target.value || undefined)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No posts found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Language
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/blog/$slug"
                      params={{ slug: post.slug }}
                      search={{ language: asLang(post.language) }}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {post.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {post.language === "en" ? "EN" : "ID"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/admin/blog/$slug"
                        params={{ slug: post.slug }}
                        search={{ language: asLang(post.language) }}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.slug, post.language)}
                        disabled={
                          deleting === `${post.slug}_${post.language}`
                        }
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
                      >
                        {deleting === `${post.slug}_${post.language}`
                          ? "Deleting..."
                          : "Delete"}
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

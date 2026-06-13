import { createFileRoute, Link, useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Editor from "editorjs-react";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import type { API } from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

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

export interface EditSearch {
  language: "en" | "id";
}

export const Route = createFileRoute("/admin/blog/$slug")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): EditSearch => ({
    language:
      search.language === "en" || search.language === "id"
        ? search.language
        : "en",
  }),
  component: BlogEditComponent,
});

function BlogEditComponent(): ReactNode {
  const { slug } = useParams({ from: Route.id });
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();

  const editorRef = useRef<unknown>(null);
  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [postSlug, setPostSlug] = useState(slug);
  const [language, setLanguage] = useState<"en" | "id">(search.language);
  const [description, setDescription] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const languageRef = useRef(language);
  const slugRef = useRef(slug);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/blog/posts/${slug}?language=${search.language}`,
      );
      if (!res.ok) throw new Error("Failed to load post");
      const post = (await res.json()) as Post;

      setPostSlug(post.slug);
      setTitle(post.title);
      setLanguage(post.language as "en" | "id");
      setTagNames(post.tags.map((t) => t.name));
      setStatus(post.status as "draft" | "published");
      setThumbnailKey(post.thumbnailKey);

      // Parse content into editor data
      if (post.content) {
        try {
          const parsed = JSON.parse(post.content) as OutputData;
          setEditorData(parsed);
        } catch {
          // If content isn't valid JSON, leave null so editor starts empty
          setEditorData(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [slug, search.language]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleInitialize = useCallback((instance: unknown) => {
    editorRef.current = instance;
    setEditorReady(true);
  }, []);

  const handleChange = useCallback((_api: API, data: OutputData) => {
    setEditorData(data);
  }, []);

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const body: Record<string, unknown> = {
        title,
        tagNames,
        status,
        content: JSON.stringify(editorData),
      };

      const res = await fetch(
        `/api/blog/posts/${slug}?language=${language}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) throw new Error("Failed to save post");

      const updated = (await res.json()) as Post;
      setPostSlug(updated.slug);
      setThumbnailKey(updated.thumbnailKey);
      setSaveSuccess(true);

      // If language changed, navigate to keep URL in sync
      if (updated.language !== languageRef.current) {
        navigate({
          to: "/admin/blog/$slug",
          params: { slug: updated.slug },
          search: { language: updated.language as "en" | "id" },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slug", slugRef.current);
      form.append("lang", languageRef.current);

      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to upload thumbnail");

      const data = (await res.json()) as { key: string; url: string };
      setThumbnailKey(data.key);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload thumbnail",
      );
    } finally {
      setUploading(false);
    }
  };

  const editorTools = useRef({
    header: { class: Header as never, config: { levels: [2, 3, 4] } },
    list: { class: List as never },
    image: {
      class: ImageTool as never,
      config: {
        uploader: {
          uploadByFile: (file: File) => {
            const form = new FormData();
            form.append("file", file);
            form.append("slug", slugRef.current);
            form.append("lang", languageRef.current);
            return fetch("/api/blog/upload", { method: "POST", body: form })
              .then((r) => r.json() as Promise<{ url: string }>)
              .then((data) => ({ success: 1, file: { url: data.url } }));
          },
        },
      },
    },
    code: { class: CodeTool as never },
    quote: { class: Quote as never },
    delimiter: { class: Delimiter as never },
    table: { class: Table as never },
  }).current;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-12 text-center text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-4">
          <Link
            to="/admin/blog"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Blog Posts
          </Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/blog"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        </div>
        {saveSuccess && (
          <span className="text-sm font-medium text-green-600">
            Saved successfully
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Slug (readonly) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            value={postSlug}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "id")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          >
            <option value="en">English</option>
            <option value="id">Indonesian</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          />
        </div>
        {/* Tags */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = tagInput.trim();
                  if (trimmed && !tagNames.includes(trimmed)) {
                    setTagNames((prev) => [...prev, trimmed]);
                  }
                  setTagInput("");
                }
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = tagInput.trim();
                if (trimmed && !tagNames.includes(trimmed)) {
                  setTagNames((prev) => [...prev, trimmed]);
                }
                setTagInput("");
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          {tagNames.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagNames.map((name, idx) => (
                <span
                  key={`${name}-${idx}`}
                  className="inline-flex items-center gap-1 rounded bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() =>
                      setTagNames((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          {thumbnailKey && (
            <div className="mb-2">
              <img
                src={`/assets/${thumbnailKey}`}
                alt="Thumbnail preview"
                className="h-32 w-56 rounded-lg border border-gray-200 object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              {uploading ? "Uploading..." : "Choose Image"}
              <input
                type="file"
                accept="image/webp,image/png,image/jpeg"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {thumbnailKey && (
              <button
                type="button"
                onClick={() => setThumbnailKey(null)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Editor.js */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="min-h-[300px] rounded-lg border border-gray-300 bg-white p-4">
            <Editor
              key={`${slug}-${search.language}`}
              data={editorData ?? undefined}
              onInitialize={handleInitialize}
              onChange={handleChange}
              tools={editorTools}
            />
          </div>
          {!editorReady && (
            <p className="mt-1 text-xs text-gray-400">
              Loading editor...
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <Link
            to="/admin/blog"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

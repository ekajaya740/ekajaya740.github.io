import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode, FormEvent, ChangeEvent } from "react";
import Editor from "editorjs-react";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

import type { OutputData } from "@editorjs/editorjs";

export const Route = createFileRoute("/admin/blog/new")({
  component: NewBlogPostComponent,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function NewBlogPostComponent(): ReactNode {
  const navigate = useNavigate();

  const editorRef = useRef<unknown>(null);
  const slugRef = useRef("");
  const langRef = useRef("en");

  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<"en" | "id">("en");
  const [description, setDescription] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Keep refs in sync for Editor.js image uploader which captures them at init time
  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);
  useEffect(() => {
    langRef.current = language;
  }, [language]);

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);
      if (!slugManuallyEdited) {
        setSlug(slugify(value));
      }
    },
    [slugManuallyEdited],
  );

  const handleSlugChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSlugManuallyEdited(true);
      setSlug(e.target.value);
    },
    [],
  );

  const handleInitialize = useCallback((instance: unknown) => {
    editorRef.current = instance;
  }, []);

  const handleChange = useCallback(
    (_api: unknown, data: OutputData) => {
      setEditorData(data);
    },
    [],
  );

  const handleLanguageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const lang = e.target.value as "en" | "id";
      setLanguage(lang);
    },
    [],
  );

  const handleThumbnailUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("slug", slug || "temp");
        form.append("lang", language);
        const res = await fetch("/api/blog/upload", { method: "POST", body: form });
        if (!res.ok) {
          const err = (await res.json()) as { error: string };
          throw new Error(err.error ?? "Upload failed");
        }
        const data = (await res.json()) as { key: string; url: string };
        setThumbnailKey(data.key);
      } catch (err) {
        console.error("Thumbnail upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [slug, language],
  );

  const savePost = useCallback(
    async (status?: "draft" | "published") => {
      if (!slug || !title) return;

      setSaving(true);
      try {
        const content = JSON.stringify(editorData ?? { time: Date.now(), blocks: [] });

        const body: Record<string, unknown> = {
          slug,
          title,
          content,
          language,
          description: description || undefined,
          thumbnailKey: thumbnailKey || undefined,
        };

        if (tagNames.length > 0) {
          body.tagNames = tagNames;
        }

        const res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error: string };
          throw new Error(err.error ?? "Failed to create post");
        }

        // If publishing, follow up with PATCH to set status to published
        if (status === "published") {
          const publishRes = await fetch(
            `/api/blog/posts/${encodeURIComponent(slug)}?language=${language}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "published" }),
            },
          );

          if (!publishRes.ok) {
            console.error("Failed to publish post, created as draft");
          }
        }

        navigate({ to: `/admin/blog/${slug}`, search: { language } });
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setSaving(false);
      }
    },
    [slug, title, editorData, language, description, thumbnailKey, tagNames, navigate],
  );

  const editorTools = {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          uploadByFile(file: File) {
            const form = new FormData();
            form.append("file", file);
            form.append("slug", slugRef.current || "temp");
            form.append("lang", langRef.current);
            return fetch("/api/blog/upload", { method: "POST", body: form })
              .then((r) => r.json() as Promise<{ url: string; key: string }>)
              .then((data) => ({ success: 1, file: { url: data.url } }));
          },
        },
      },
    },
    code: {
      class: CodeTool,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
    },
    delimiter: {
      class: Delimiter,
    },
    table: {
      class: Table,
    },
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-2xl font-bold">New Blog Post</h1>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          return savePost("published");
        }}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Post title"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
            placeholder="post-slug"
            required
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="mb-1 block text-sm font-medium">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
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
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Short description for SEO and listing cards"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="mb-1 block text-sm font-medium">
            Thumbnail Image
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/webp,image/png,image/jpeg"
            onChange={handleThumbnailUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="mt-1 text-xs text-gray-500">Uploading...</p>}
          {thumbnailKey && (
            <p className="mt-1 text-xs text-green-600">Thumbnail uploaded</p>
          )}
        </div>

        {/* Editor */}
        <div>
          <label className="mb-1 block text-sm font-medium">Content</label>
          <div className="min-h-[300px] rounded-lg border border-gray-300 p-4">
            <Editor
              onInitialize={handleInitialize}
              onChange={handleChange}
              tools={editorTools}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || !slug || !title}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Publish"}
          </button>

          <button
            type="button"
            disabled={saving || !slug || !title}
            onClick={() => savePost()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}

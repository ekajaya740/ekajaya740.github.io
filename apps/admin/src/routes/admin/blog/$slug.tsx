import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import type { ReactNode, ChangeEvent } from "react";
import {
  CForm,
  CField,
  CInput,
  CTextarea,
  CSelect,
  CSubmit,
  CEditor,
} from "@ekajaya/ui/composed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import type { OutputData } from "@editorjs/editorjs";
import { updatePostSchema } from "@ekajaya/schema/blog";

// ---- Types ----------------------------------------------------------------

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

interface BlogFormValues {
  title: string;
  language: string;
  description: string;
}

export interface EditSearch {
  language?: "en" | "id";
}

// ---- Route ----------------------------------------------------------------

export const Route = createFileRoute("/admin/blog/$slug")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): EditSearch => ({
    language:
      search.language === "en" || search.language === "id"
        ? search.language
        : undefined,
  }),
  component: BlogEditComponent,
});

// ---- Component ------------------------------------------------------------

function BlogEditComponent(): ReactNode {
  const { slug } = useParams({ from: Route.id });
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();

  const language = search.language ?? "en";

  // ---- State ---------------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null);
  const [postSlug, setPostSlug] = useState(slug);
  const [defaultValues, setDefaultValues] =
    useState<BlogFormValues | null>(null);

  // ---- Refs ---------------------------------------------------------------

  const languageRef = useRef(language);
  const slugRef = useRef(slug);

  useEffect(() => {
    languageRef.current = (defaultValues?.language ?? language) as "id" | "en";
  }, [defaultValues?.language, language]);

  useEffect(() => {
    slugRef.current = postSlug;
  }, [postSlug]);

  // ---- Fetch post ----------------------------------------------------------

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/blog/posts/${encodeURIComponent(slug)}?language=${language}`,
      );
      if (!res.ok) throw new Error("Failed to load post");
      const post = (await res.json()) as Post;

      setPostSlug(post.slug);
      setDefaultValues({
        title: post.title,
        language: post.language,
        description: post.description,
      });
      setTagNames(post.tags.map((t) => t.name));
      setThumbnailKey(post.thumbnailKey);

      if (post.content) {
        try {
          const parsed = JSON.parse(post.content) as OutputData;
          setEditorData(parsed);
        } catch {
          setEditorData(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [slug, language]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // ---- Save ---------------------------------------------------------------

  const handleSave = useCallback(
    async (
      values: BlogFormValues,
      status: "draft" | "published",
    ): Promise<void> => {
      setValidationErrors([]);
      setError(null);
      setSaveSuccess(false);

      const payload: Record<string, unknown> = {
        title: values.title,
        content: JSON.stringify(
          editorData ?? { time: Date.now(), blocks: [] },
        ),
        language: values.language,
        description: values.description || undefined,
        tagNames: tagNames.length > 0 ? tagNames : undefined,
        thumbnailKey: thumbnailKey || undefined,
        status,
      };

      const parsed = updatePostSchema.safeParse(payload);
      if (!parsed.success) {
        setValidationErrors(
          parsed.error.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`,
          ),
        );
        return;
      }

      setSaving(true);
      try {
        const res = await fetch(
          `/api/blog/posts/${encodeURIComponent(postSlug)}?language=${values.language}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
          },
        );

        if (!res.ok) {
          const err = (await res.json()) as { error: string };
          throw new Error(err.error ?? "Failed to save post");
        }

        const updated = (await res.json()) as Post;
        setPostSlug(updated.slug);
        setThumbnailKey(updated.thumbnailKey);
        setSaveSuccess(true);

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
    },
    [editorData, tagNames, thumbnailKey, postSlug, navigate],
  );

  // ---- Thumbnail upload ---------------------------------------------------

  const handleThumbnailUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
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
    },
    [],
  );

  // ---- Editor tools -------------------------------------------------------

  const editorTools = useRef({
    header: {
      class: Header as never,
      config: { levels: [2, 3, 4] },
    },
    list: {
      class: List as never,
      inlineToolbar: true,
    },
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
    quote: { class: Quote as never, inlineToolbar: true },
    delimiter: { class: Delimiter as never },
    table: { class: Table as never },
  }).current;

  // ---- Early returns ------------------------------------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-12 text-center text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (error && !defaultValues) {
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

  // ---- Render -------------------------------------------------------------

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

      {/* Inline error (when defaultValues already loaded) */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          <p className="mb-1 font-medium">Validation errors:</p>
          <ul className="list-inside list-disc space-y-0.5">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <CForm
        defaultValues={(defaultValues ?? {}) as Record<string, unknown>}
        onSubmit={(v) => handleSave(v as unknown as BlogFormValues, "published")}
      >
        {(form) => {
          const f = form as unknown as {
            state: { values: Record<string, unknown> };
            setFieldValue: (name: string, value: unknown) => void;
          };

          return (
            <div className="space-y-6">
              {/* Slug (read-only) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={postSlug}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 font-mono text-sm text-gray-500"
                />
              </div>

              {/* Title */}
              <CField name="title" form={form} label="Title">
                {(field) => (
                  <CInput field={field} placeholder="Post title" required />
                )}
              </CField>

              {/* Language */}
              <CField name="language" form={form} label="Language">
                {(field) => (
                  <CSelect
                    field={field}
                    options={[
                      { value: "en", label: "English" },
                      { value: "id", label: "Bahasa Indonesia" },
                    ]}
                  />
                )}
              </CField>

              {/* Description */}
              <CField name="description" form={form} label="Description">
                {(field) => (
                  <CTextarea
                    field={field}
                    rows={3}
                    placeholder="Short description for SEO and listing cards"
                  />
                )}
              </CField>

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
                    placeholder="Add a tag and press Enter"
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
                            setTagNames((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
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

              {/* Content editor */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="min-h-[300px] rounded-lg border border-gray-300 bg-white p-4">
                  <CEditor
                    key={`${slug}-${language}`}
                    data={editorData ?? undefined}
                    onChange={(data) => setEditorData(data)}
                    tools={editorTools}
                    placeholder="Start writing..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
                <CSubmit disabled={saving}>
                  {saving ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleSave(
                      f.state.values as unknown as BlogFormValues,
                      "draft",
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <Link
                  to="/admin/blog"
                  className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Link>
              </div>
            </div>
          );
        }}
      </CForm>
    </div>
  );
}

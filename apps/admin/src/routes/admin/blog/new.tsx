import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode, ChangeEvent, FC } from "react";
import { CForm, CField, CInput, CTextarea, CSelect, CSubmit, CEditor } from "@ekajaya/ui/composed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import type { OutputData } from "@editorjs/editorjs";
import { createPostSchema } from "@ekajaya/schema/blog";

export const Route = createFileRoute("/admin/blog/new")({
  component: NewBlogPostComponent,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface FormValues {
  slug: string;
  title: string;
  language: string;
  description: string;
}

function NewBlogPostComponent(): ReactNode {
  const navigate = useNavigate();

  const slugRef = useRef("");
  const langRef = useRef("en");

  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const formRef = useRef<{
    setFieldValue: (name: string, value: unknown) => void;
    state: { values: Record<string, unknown> };
  } | null>(null);

  useEffect(() => {
    const api = formRef.current;
    if (!api) return;
    const values = api.state.values;
    const title = (values.title ?? "") as string;
    const slug = (values.slug ?? "") as string;

    slugRef.current = slug;
    langRef.current = (values.language ?? "en") as string;

    let manuallyEdited = slugManuallyEdited;

    // Detect manual slug edit before auto-slug logic
    if (slug && slug !== slugify(title) && !manuallyEdited) {
      manuallyEdited = true;
      setSlugManuallyEdited(true);
    }

    // Auto-slug from title (only if not manually edited)
    if (title && !manuallyEdited) {
      const newSlug = slugify(title);
      if (slug !== newSlug) {
        api.setFieldValue("slug", newSlug);
        slugRef.current = newSlug;
      }
    }
  });

  const handleThumbnailUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("slug", slugRef.current || "temp");
        form.append("lang", langRef.current);
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
    [],
  );

  const savePost = useCallback(
    async (formValues: Record<string, unknown>, status?: "draft" | "published") => {
      const { slug, title, language, description } = formValues as unknown as FormValues;
      if (!slug || !title) return;

      setSaving(true);
      try {
        const content = JSON.stringify(editorData ?? { time: Date.now(), blocks: [] });

        const body: Record<string, unknown> = {
          slug,
          title,
          content,
          language,
        };

        if (description) body.description = description;
        if (thumbnailKey) body.thumbnailKey = thumbnailKey;
        if (tagNames.length > 0) body.tagNames = tagNames;

        const validation = createPostSchema.safeParse(body);
        if (!validation.success) {
          const messages = validation.error.issues.map((i) => i.message).join("\n");
          alert(`Validation error:\n${messages}`);
          setSaving(false);
          return;
        }

        const res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error: string };
          throw new Error(err.error ?? "Failed to create post");
        }

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

        navigate({ to: `/admin/blog/${slug}`, search: { language: language as "id" | "en" } });
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setSaving(false);
      }
    },
    [editorData, tagNames, thumbnailKey, navigate],
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

      <CForm
        defaultValues={{ slug: "", title: "", language: "en", description: "" }}
        onSubmit={(values) => savePost(values, "published")}
      >
        {(form) => {
          const f = form as unknown as {
            state: { values: Record<string, unknown> };
            setFieldValue: (name: string, value: unknown) => void;
          };
          formRef.current = f;

          return (
            <>
              {/* Title */}
              <CField name="title" form={f as unknown as { Field: FC<{ name: string; children: (field: { name: string; state: { value: unknown; meta: { errors?: unknown[] } }; handleChange: (value: unknown) => void; handleBlur: () => void }) => ReactNode }> }} label="Title">
                {(field) => (
                  <CInput
                    field={field}
                    placeholder="Post title"
                    required
                  />
                )}
              </CField>

              {/* Slug */}
              <CField name="slug" form={f as unknown as { Field: FC<{ name: string; children: (field: { name: string; state: { value: unknown; meta: { errors?: unknown[] } }; handleChange: (value: unknown) => void; handleBlur: () => void }) => ReactNode }> }} label="Slug">
                {(field) => (
                  <CInput
                    field={field}
                    placeholder="post-slug"
                    className="font-mono"
                    required
                  />
                )}
              </CField>

              {/* Language */}
              <CField name="language" form={f as unknown as { Field: FC<{ name: string; children: (field: { name: string; state: { value: unknown; meta: { errors?: unknown[] } }; handleChange: (value: unknown) => void; handleBlur: () => void }) => ReactNode }> }} label="Language">
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

              {/* Tags */}
              <div>
                <label className="mb-1 block text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
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
              <CField name="description" form={f as unknown as { Field: FC<{ name: string; children: (field: { name: string; state: { value: unknown; meta: { errors?: unknown[] } }; handleChange: (value: unknown) => void; handleBlur: () => void }) => ReactNode }> }} label="Description">
                {(field) => (
                  <CTextarea
                    field={field}
                    rows={3}
                    placeholder="Short description for SEO and listing cards"
                  />
                )}
              </CField>

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
                  <CEditor
                    tools={editorTools}
                    onChange={(data) => setEditorData(data)}
                    placeholder="Start writing..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <CSubmit disabled={saving}>
                  {saving ? "Saving..." : "Publish"}
                </CSubmit>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost(f.state.values, "draft")}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </>
          );
        }}
      </CForm>
    </div>
  );
}

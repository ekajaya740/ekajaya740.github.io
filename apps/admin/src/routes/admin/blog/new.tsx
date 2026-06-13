import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import type { ReactNode } from "react";
import {
  CForm,
  CField,
  CInput,
  CTextarea,
  CSelect,
  CSubmit,
  CEditor,
  CTagInput,
  CFileUpload,
} from "@ekajaya/ui/composed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import type { OutputData } from "@editorjs/editorjs";
import { createPostSchema } from "@ekajaya/schema/blog";
import { useCreatePost } from "@ekajaya/hooks/blog";

export const Route = createFileRoute("/admin/blog/new")({
  component: NewBlogPostComponent,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface PostForm {
  slug: string;
  title: string;
  language: string;
  description: string;
  content: OutputData | null;
  tags: string[];
  thumbnailKey: string | null;
  slugManual: boolean;
}

function NewBlogPostComponent(): ReactNode {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const slugRef = useRef("");
  const langRef = useRef("en");

  const onSubmit = async (values: Record<string, unknown>): Promise<void> => {
    const v = values as unknown as PostForm;
    if (!v.slug || !v.title) return;

    const body: Record<string, unknown> = {
      slug: v.slug,
      title: v.title,
      content: JSON.stringify(v.content ?? { time: Date.now(), blocks: [] }),
      language: v.language || "en",
    };
    if (v.description) body.description = v.description;
    if (v.thumbnailKey) body.thumbnailKey = v.thumbnailKey;
    if (v.tags.length > 0) body.tagNames = v.tags;

    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      alert(validation.error.issues.map((i) => i.message).join("\n"));
      return;
    }

    try {
      await createPost.mutateAsync(validation.data);
      navigate({
        to: "/admin/blog/$slug",
        params: { slug: v.slug },
        search: { language: v.language as "id" | "en" },
      });
    } catch {
      // mutation handles error
    }
  };

  const saving = createPost.isPending;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-2xl font-bold">New Blog Post</h1>

      <CForm
        defaultValues={{
          slug: "",
          title: "",
          language: "en",
          description: "",
          content: null as OutputData | null,
          tags: [] as string[],
          thumbnailKey: null as string | null,
          slugManual: false,
        }}
        onSubmit={onSubmit}
      >
        {(form) => {
          const f = form as {
            state: { values: Record<string, unknown> };
            setFieldValue: (name: string, value: unknown) => void;
          };
          const values = f.state.values as unknown as PostForm;

          slugRef.current = values.slug;
          langRef.current = values.language;

          return (
            <div className="space-y-4">
              <CField name="title" form={form} label="Title">
                {(field) => {
                  const origChange = field.handleChange;
                  return (
                    <CInput
                      field={{
                        ...field,
                        handleChange: (val: unknown) => {
                          origChange(val);
                          if (!values.slugManual) {
                            f.setFieldValue(
                              "slug",
                              slugify(String(val ?? "")),
                            );
                          }
                        },
                      }}
                      placeholder="Post title"
                      required
                    />
                  );
                }}
              </CField>

              <CField name="slug" form={form} label="Slug">
                {(field) => {
                  const origChange = field.handleChange;
                  return (
                    <CInput
                      field={{
                        ...field,
                        handleChange: (val: unknown) => {
                          f.setFieldValue("slugManual", true);
                          origChange(val);
                        },
                      }}
                      placeholder="post-slug"
                      className="font-mono"
                      required
                    />
                  );
                }}
              </CField>

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

              <div>
                <label className="mb-1 block text-sm font-medium">Tags</label>
                <CTagInput
                  tags={values.tags}
                  onChange={(tags) => f.setFieldValue("tags", tags)}
                />
              </div>

              <CField name="description" form={form} label="Description">
                {(field) => (
                  <CTextarea
                    field={field}
                    rows={3}
                    placeholder="Short description for SEO and listing cards"
                  />
                )}
              </CField>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Thumbnail
                </label>
                <CFileUpload
                  endpoint="/api/blog/upload"
                  value={values.thumbnailKey}
                  onChange={(key) => f.setFieldValue("thumbnailKey", key)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Content</label>
                <div className="min-h-[300px] rounded-lg border border-gray-300 p-4">
                  <CEditor
                    tools={editorTools(slugRef, langRef)}
                    data={values.content ?? undefined}
                    onChange={(data: OutputData) =>
                      f.setFieldValue("content", data)
                    }
                    placeholder="Start writing..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <CSubmit disabled={saving}>
                  {saving ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onSubmit(f.state.values)}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </div>
          );
        }}
      </CForm>
    </div>
  );
}

function editorTools(
  slugRef: { current: string },
  langRef: { current: string },
) {
  return {
    header: { class: Header, inlineToolbar: true },
    list: { class: List, inlineToolbar: true },
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
              .then(
                (r) => r.json() as Promise<{ url: string; key: string }>,
              )
              .then((data) => ({ success: 1, file: { url: data.url } }));
          },
        },
      },
    },
    code: { class: CodeTool },
    quote: { class: Quote, inlineToolbar: true },
    delimiter: { class: Delimiter },
    table: { class: Table },
  };
}

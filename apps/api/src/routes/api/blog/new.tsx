import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  CForm,
  CField,
  CInput,
  CTextarea,
  CSelect,
  CSubmit,
} from "@ekajaya/ui/composed";
import { CTagInput, CFileUpload, CEditor } from "@ekajaya/ui/composed/extra";
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
import type { SessionResponse } from "../../../lib/auth";

export const Route = createFileRoute("/api/blog/new")({
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
  const [session, setSession] = useState<{ user: NonNullable<SessionResponse["user"]> } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const toolsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then(r => r.json() as Promise<SessionResponse>)
      .then((data: SessionResponse) => {
        if (!data.user) {
          navigate({ to: "/login" });
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        navigate({ to: "/login" });
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const onSubmit = async (values: Record<string, unknown>): Promise<void> => {
    const v = values as unknown as PostForm;
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
    if (!validation.success) return;

    try {
      await createPost.mutateAsync(validation.data);
      navigate({
        to: "/api/blog/$slug",
        params: { slug: v.slug },
        search: { language: v.language as "id" | "en" },
      });
    } catch {
      // mutation handles error
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-2xl font-bold text-foreground">New Blog Post</h1>

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

          toolsRef.current = buildTools(values.slug, values.language);

          return (
            <div className="space-y-6">
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
                            f.setFieldValue("slug", slugify(String(val ?? "")));
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
                <label className="mb-1 block text-sm font-medium text-foreground">Tags</label>
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
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Thumbnail
                </label>
                <CFileUpload
                  endpoint="/api/blog/upload"
                  value={values.thumbnailKey}
                  onChange={(key) => f.setFieldValue("thumbnailKey", key)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Content</label>
                <div className="min-h-[300px] rounded-lg border border-border bg-background p-4">
                  <CEditor
                    data={values.content ?? undefined}
                    onChange={(data: OutputData) =>
                      f.setFieldValue("content", data)
                    }
                    tools={toolsRef.current}
                    placeholder="Start writing..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <CSubmit disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={form.state.isSubmitting}
                  onClick={() => onSubmit(form.state.values)}
                  className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
                  {form.state.isSubmitting ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </div>
          );
        }}
      </CForm>
    </div>
  );
}

function buildTools(slug: string, language: string) {
  return {
    header: { class: Header, inlineToolbar: true },
    list: { class: List, inlineToolbar: true },
    image: { class: ImageTool, config: { uploader: { uploadByFile: async (file: File) => { const form = new FormData(); form.append("file", file); form.append("slug", slug); form.append("lang", language); const res = await fetch("/api/blog/upload", { method: "POST", body: form }); const data = (await res.json()) as { url: string }; return { success: 1, file: { url: data.url } }; } } } },
    code: { class: CodeTool },
    quote: { class: Quote, inlineToolbar: true },
    delimiter: { class: Delimiter },
    table: { class: Table, inlineToolbar: true },
  };
}

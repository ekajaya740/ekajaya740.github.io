import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
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
import { updatePostSchema } from "@ekajaya/schema/blog";
import { useUpdatePost, usePost } from "@ekajaya/hooks/blog";
import type { SessionResponse } from "../../../lib/auth";
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

interface PostForm {
  title: string;
  language: string;
  description: string;
  content: OutputData | null;
  tags: string[];
  thumbnailKey: string | null;
}

function BlogEditComponent(): ReactNode {
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
        navigate({ to: "/login", search: { redirect: pathname } });
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked || !session) return <div className="p-8 text-center">Loading...</div>;

  const { slug } = useParams({ from: Route.id });
  const search = useSearch({ from: Route.id });

  const language = search.language ?? "en";
  const {
    data: post,
    isLoading,
    error: loadError,
  } = usePost(slug, language);
  const updatePost = useUpdatePost(slug);

  const slugRef = useRef(slug);
  const langRef = useRef(language);

  const saving = updatePost.isPending;
  const error = loadError?.message ?? null;

  // ---- Save ----------------------------------------------------------------

  const handleSubmit = async (
    values: Record<string, unknown>,
    status: "draft" | "published",
  ): Promise<void> => {
    const v = values as unknown as PostForm;

    const payload: Record<string, unknown> = {
      title: v.title,
      content: JSON.stringify(v.content ?? { time: Date.now(), blocks: [] }),
      language: v.language,
      description: v.description || undefined,
      tagNames: v.tags.length > 0 ? v.tags : undefined,
      thumbnailKey: v.thumbnailKey || undefined,
      status,
    };

    const parsed = updatePostSchema.safeParse(payload);
    if (!parsed.success) {
      return;
    }

    try {
      const updated = await updatePost.mutateAsync(parsed.data);
      if ((updated as { language?: string }).language !== language) {
        navigate({
          to: "/admin/blog/$slug",
          params: { slug },
          search: {
            language: (updated as { language?: string }).language as
              | "en"
              | "id",
          },
        });
      }
    } catch {
      // mutation handles error
    }
  };

  // ---- Default values from API ---------------------------------------------

  const defaults: PostForm = post
    ? {
        title: post.title,
        language: post.language,
        description: post.description,
        content: post.content
          ? (JSON.parse(post.content) as OutputData)
          : null,
        tags: post.tags?.map((t: { name: string }) => t.name) ?? [],
        thumbnailKey: post.thumbnailKey,
      }
    : {
        title: "",
        language,
        description: "",
        content: null,
        tags: [],
        thumbnailKey: null,
      };

  // ---- Early returns --------------------------------------------------------

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-12 text-center text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (error && !post) {
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

  // ---- Render ---------------------------------------------------------------

  return (
    <div className="mx-auto max-w-4xl p-6">
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
      </div>

      <CForm
        defaultValues={defaults as unknown as Record<string, unknown>}
        onSubmit={(v) => handleSubmit(v, "published")}
      >
        {(form) => {
          const f = form as {
            state: { values: Record<string, unknown> };
            setFieldValue: (name: string, value: unknown) => void;
          };
          const values = f.state.values as unknown as PostForm;

          slugRef.current = slug;
          langRef.current = values.language as "id" | "en";

          return (
            <div className="space-y-6">
              {/* Slug (read-only) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 font-mono text-sm text-gray-500"
                />
              </div>

              <CField name="title" form={form} label="Title">
                {(field) => (
                  <CInput field={field} placeholder="Post title" required />
                )}
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
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <CTagInput
                  tags={values.tags}
                  onChange={(tags) => f.setFieldValue("tags", tags)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <CFileUpload
                  endpoint="/api/blog/upload"
                  value={values.thumbnailKey}
                  onChange={(key) =>
                    f.setFieldValue("thumbnailKey", key)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="min-h-[300px] rounded-lg border border-gray-300 bg-white p-4">
                  <CEditor
                    key={`${slug}-${language}`}
                    data={values.content ?? undefined}
                    onChange={(data: OutputData) =>
                      f.setFieldValue("content", data)
                    }
                    tools={editorTools(slugRef, langRef)}
                    placeholder="Start writing..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
                <CSubmit disabled={saving}>
                  {saving ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSubmit(f.state.values, "draft")}
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

// ---- Editor tools ----------------------------------------------------------

function editorTools(
  slugRef: { current: string },
  langRef: { current: string },
) {
  return {
    header: { class: Header, config: { levels: [2, 3, 4] } },
    list: { class: List, inlineToolbar: true },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          uploadByFile(file: File) {
            const form = new FormData();
            form.append("file", file);
            form.append("slug", slugRef.current);
            form.append("lang", langRef.current);
            return fetch("/api/blog/upload", { method: "POST", body: form })
              .then((r) => r.json() as Promise<{ url: string }>)
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

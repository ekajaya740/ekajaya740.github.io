import { useState, useEffect, useCallback, Suspense } from "react";
import { Hono } from "hono";
import { createAuth } from "@woe/auth";
import { renderPage } from "../renderer";
import type { AppEnv } from "../app";
import type { SessionResponse, SessionUser } from "@woe/auth";
import {
  CForm,
  CField,
  CInput,
  CTextarea,
  CSelect,
  CSubmit,
} from "@woe/ui/composed";
import { CTagInput } from "@woe/ui/composed/controlled/c-tag-input";
import { CFileUpload } from "@woe/ui/composed/controlled/c-file-upload";
import { createPostSchema, updatePostSchema } from "@woe/schema/blog";
import { signInSchema, signUpSchema } from "@woe/schema/auth";
import { usePost, useCreatePost, useUpdatePost } from "@woe/hooks/blog";

const pages = new Hono<{ Bindings: AppEnv }>();

// --- Helpers ---

async function checkSession(c: {
  req: { raw: { headers: Headers } };
  env: AppEnv;
}): Promise<{
  user: NonNullable<SessionResponse["user"]>;
} | null> {
  const auth = createAuth(
    c.env.DB ? { DB: c.env.DB } : undefined,
  );
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (session?.user) {
      return { user: session.user as unknown as NonNullable<SessionResponse["user"]> };
    }
  } catch {
    // ignore
  }
  return null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// --- Routes ---

pages.get("/", async (c) => {
  const session = await checkSession(c);
  if (session) {
    return c.redirect("/dashboard");
  }
  return c.redirect("/register");
});

pages.get("/login", async (c) => {
  const session = await checkSession(c);
  if (session) {
    return c.redirect("/dashboard");
  }
  const redirectParam = c.req.query("redirect") || undefined;
  return renderPage({
    title: "Sign In — Work of Ekajaya",
    children: <LoginPage redirect={redirectParam} />,
  });
});

pages.get("/register", async (c) => {
  const session = await checkSession(c);
  if (session) {
    return c.redirect("/dashboard");
  }
  return renderPage({
    title: "Create Account — Work of Ekajaya",
    children: <RegisterPage />,
  });
});

pages.get("/dashboard", async (c) => {
  const session = await checkSession(c);
  if (!session) {
    return c.redirect("/login");
  }
  return renderPage({
    title: "Dashboard — Work of Ekajaya",
    children: <DashboardPage />,
  });
});

pages.get("/api/blog", async (c) => {
  const session = await checkSession(c);
  if (!session) {
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path + c.req.url.replace(c.req.path, ""))}`);
  }
  const search = new URL(c.req.url).search;
  return renderPage({
    title: "Blog Posts — Work of Ekajaya",
    children: <BlogListPage key={search} />,
  });
});

pages.get("/api/blog/new", async (c) => {
  const session = await checkSession(c);
  if (!session) {
    return c.redirect(`/login?redirect=/api/blog/new`);
  }
  return renderPage({
    title: "New Post — Work of Ekajaya",
    children: (
      <Suspense fallback={<div className="min-h-[300px] rounded-lg border border-border bg-background p-4" />}>
        <NewPostPage />
      </Suspense>
    ),
  });
});

pages.get("/api/blog/:slug", async (c) => {
  const session = await checkSession(c);
  if (!session) {
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`);
  }
  const slug = c.req.param("slug");
  const langParam = c.req.query("language") ?? undefined;
  return renderPage({
    title: "Edit Post — Work of Ekajaya",
    children: (
      <Suspense fallback={<div className="min-h-[300px] rounded-lg border border-border bg-background p-4" />}>
        <EditPostPage slug={slug} initialLanguage={langParam} />
      </Suspense>
    ),
  });
});

export { pages as pageRoutes };

// --- Page Components ---

function LoginPage({ redirect }: { redirect?: string }) {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const res = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      throw new Error(err.message ?? "Login failed");
    }
    window.location.href = redirect || "/dashboard";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin dashboard access</p>
        </div>
        <CForm
          defaultValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validators={{ onSubmit: signInSchema }}
        >
          {(form) => (
            <div className="space-y-4">
              <CField name="email" form={form} label="Email">
                {(field) => (
                  <CInput field={field} type="email" placeholder="admin@example.com" required />
                )}
              </CField>
              <CField name="password" form={form} label="Password">
                {(field) => (
                  <CInput field={field} type="password" placeholder="••••••••" required />
                )}
              </CField>
              <CSubmit disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? "Signing in..." : "Sign In"}
              </CSubmit>
            </div>
          )}
        </CForm>
      </div>
    </div>
  );
}

function RegisterPage() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const res = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      throw new Error(err.message ?? "Registration failed");
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register admin access</p>
        </div>
        <CForm
          defaultValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validators={{ onSubmit: signUpSchema }}
        >
          {(form) => (
            <div className="space-y-4">
              <CField name="name" form={form} label="Name">
                {(field) => <CInput field={field} placeholder="Your name" required />}
              </CField>
              <CField name="email" form={form} label="Email">
                {(field) => (
                  <CInput field={field} type="email" placeholder="admin@example.com" required />
                )}
              </CField>
              <CField name="password" form={form} label="Password">
                {(field) => (
                  <CInput field={field} type="password" placeholder="••••••••" required />
                )}
              </CField>
              <CSubmit disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? "Creating account..." : "Create Account"}
              </CSubmit>
            </div>
          )}
        </CForm>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/api/blog"
          className="rounded-lg border p-6 hover:border-accent hover:shadow-md transition-all"
        >
          <h2 className="font-semibold">Blog Posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage blog content</p>
        </a>
      </div>
    </main>
  );
}

// --- Blog Pages ---

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

function BlogListPage() {
  const [session, setSession] = useState<{ user: SessionUser } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const [language, setLanguage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json() as Promise<SessionResponse>)
      .then((data) => {
        if (!data.user) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    if (params.get("language")) {
      setLanguage(params.get("language")!);
    }
    if (params.get("status")) {
      setStatus(params.get("status")!);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (language) sp.set("language", language);
      if (status) sp.set("status", status);
      const res = await fetch(`/api/blog/posts?${sp}`);
      if (res.ok) {
        const data = (await res.json()) as Post[];
        setPosts(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [language, status]);

  useEffect(() => {
    if (session) fetchPosts();
  }, [session, fetchPosts]);

  const handleDelete = async (slug: string, lang: string) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(`${slug}_${lang}`);
    try {
      const res = await fetch(`/api/blog/posts/${slug}?language=${lang}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts(posts.filter((p) => !(p.slug === slug && p.language === lang)));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  if (!authChecked || !session) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <a
          href="/api/blog/new"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          + New Post
        </a>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            const url = new URL(window.location.href);
            if (e.target.value) url.searchParams.set("language", e.target.value);
            else url.searchParams.delete("language");
            window.history.pushState({}, "", url.toString());
          }}
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="id">Indonesian</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            const url = new URL(window.location.href);
            if (e.target.value) url.searchParams.set("status", e.target.value);
            else url.searchParams.delete("status");
            window.history.pushState({}, "", url.toString());
          }}
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
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
                <tr key={post.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <a
                      href={`/api/blog/${post.slug}?language=${post.language}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {post.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-foreground" style={{ backgroundColor: "var(--color-secondary)" }}>
                      {post.language === "en" ? "EN" : "ID"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${post.status === "published" ? "text-accent" : "text-accent-yellow"}`}
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((t) => (
                        <span key={t.id} className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-accent" style={{ backgroundColor: "var(--color-secondary)" }}>
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
                      <a
                        href={`/api/blog/${post.slug}?language=${post.language}`}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-card"
                      >
                        Edit
                      </a>
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

function NewPostPage() {
  const [session, setSession] = useState<{ user: NonNullable<SessionResponse["user"]> } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const createPost = useCreatePost();

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json() as Promise<SessionResponse>)
      .then((data) => {
        if (!data.user) {
          window.location.href = "/login";
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        window.location.href = "/login";
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

  interface PostForm {
    slug: string;
    title: string;
    language: string;
    description: string;
    content: unknown;
    tags: string[];
    thumbnailKey: string | null;
    slugManual: boolean;
  }

  const onSubmit = async (values: Record<string, unknown>) => {
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
      window.location.href = `/api/blog/${v.slug}?language=${v.language}`;
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
          content: null,
          tags: [] as string[],
          thumbnailKey: null,
          slugManual: false,
        }}
        onSubmit={onSubmit}
      >
        {(form) => {
          type FormHandle = { state: { values: Record<string, unknown> }; setFieldValue: (name: string, value: unknown) => void };
          const f = form as unknown as FormHandle;
          const values = f.state.values as unknown as PostForm;

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

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Content</label>
                <div data-editor-root className="min-h-[300px] rounded-lg border border-border bg-background p-4" />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <CSubmit disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={form.state.isSubmitting}
                  onClick={() => onSubmit(form.state.values)}
                  className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
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

function EditPostPage({ slug, initialLanguage }: { slug: string; initialLanguage?: string }) {
  const [session, setSession] = useState<{ user: NonNullable<SessionResponse["user"]> } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json() as Promise<SessionResponse>)
      .then((data) => {
        if (!data.user) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        } else {
          setSession({ user: data.user });
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, []);

  if (!authChecked || !session) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const language = initialLanguage ?? "en";
  const { data: post, isLoading, error: loadError } = usePost(slug, language);
  const updatePost = useUpdatePost(slug);

  const handleSubmit = async (
    values: Record<string, unknown>,
    postStatus: "draft" | "published",
  ) => {
    if (!post) return;
    interface PostForm {
      title: string;
      language: string;
      description: string;
      content: unknown;
      tags: string[];
      thumbnailKey: string | null;
    }
    const v = values as unknown as PostForm;

    const payload: Record<string, unknown> = {
      title: v.title,
      content: JSON.stringify(v.content ?? { time: Date.now(), blocks: [] }),
      language: v.language,
      description: v.description || undefined,
      tagNames: v.tags.length > 0 ? v.tags : undefined,
      thumbnailKey: v.thumbnailKey || undefined,
      status: postStatus,
    };

    const parsed = updatePostSchema.safeParse(payload);
    if (!parsed.success) return;

    try {
      const updated = await updatePost.mutateAsync(parsed.data);
      type UpdatedResp = { language?: string };
      const updatedLang = (updated as unknown as UpdatedResp).language;
      if (updatedLang && updatedLang !== language) {
        window.location.href = `/api/blog/${slug}?language=${updatedLang}`;
      }
    } catch {
      // mutation handles error
    }
  };

  const defaults = post
    ? {
        title: post.title,
        language: post.language,
        description: post.description,
        content: post.content ? (JSON.parse(post.content) as unknown) : null,
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="py-12 text-center text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (loadError && !post) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-4">
          <a href="/api/blog" className="text-sm text-accent hover:text-accent">
            &larr; Back to Blog Posts
          </a>
        </div>
        <div className="rounded-lg border border-border bg-secondary p-4 text-sm text-accent">
          {loadError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/api/blog" className="text-sm text-accent hover:text-accent">
            &larr; Back
          </a>
          <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
        </div>
      </div>

      <CForm
        defaultValues={defaults as unknown as Record<string, unknown>}
        onSubmit={(v) => handleSubmit(v, "published")}
      >
        {(form) => {
          type FormHandle = { state: { values: Record<string, unknown> }; setFieldValue: (name: string, value: unknown) => void };
          const f = form as unknown as FormHandle;
          const values = f.state.values as unknown as {
            title: string;
            language: string;
            description: string;
            content: unknown;
            tags: string[];
            thumbnailKey: string | null;
          };

          return (
            <div className="space-y-6">
              <CField name="slug" form={form} label="Slug">
                {(field) => <CInput field={field} disabled className="font-mono" />}
              </CField>

              <CField name="title" form={form} label="Title">
                {(field) => <CInput field={field} placeholder="Post title" required />}
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
                <label className="mb-1 block text-sm font-medium text-foreground">Tags</label>
                <CTagInput
                  tags={values.tags}
                  onChange={(tags) => f.setFieldValue("tags", tags)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Thumbnail</label>
                <CFileUpload
                  endpoint="/api/blog/upload"
                  value={values.thumbnailKey}
                  onChange={(key) => f.setFieldValue("thumbnailKey", key)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Content</label>
                <div data-editor-root className="min-h-[300px] rounded-lg border border-border bg-background p-4" />
              </div>

              <div className="flex items-center gap-3 border-t border-border pt-6">
                <CSubmit disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Saving..." : "Publish"}
                </CSubmit>
                <button
                  type="button"
                  disabled={form.state.isSubmitting}
                  onClick={() => handleSubmit(form.state.values, "draft")}
                  className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {form.state.isSubmitting ? "Saving..." : "Save Draft"}
                </button>
                <a
                  href="/api/blog"
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </a>
              </div>
            </div>
          );
        }}
      </CForm>
    </div>
  );
}

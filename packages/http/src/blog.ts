import type { ApiClient } from "./client";

export interface Post {
  id: string;
  slug: string;
  language: string;
  title: string;
  description: string;
  content: string;
  thumbnailKey: string | null;
  author: string;
  status: "draft" | "published";
  tags: { id: string; name: string; showcase: boolean }[];
  publishedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface CreatePostInput {
  slug: string;
  title: string;
  content: string;
  language?: string;
  description?: string;
  tagNames?: string[];
  thumbnailKey?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  language?: string;
  description?: string;
  tagNames?: string[];
  thumbnailKey?: string;
  status?: "draft" | "published";
}

export interface ListPostsParams {
  status?: "draft" | "published";
  language?: string;
  page?: number;
  limit?: number;
}

export function listPosts(client: ApiClient, params?: ListPostsParams) {
  return client
    .get("api/blog/posts", { searchParams: params as Record<string, string> })
    .json<Post[]>();
}

export function getPost(client: ApiClient, slug: string, language = "en") {
  return client
    .get(`api/blog/posts/${slug}`, { searchParams: { language } })
    .json<Post>();
}

export function createPost(client: ApiClient, input: CreatePostInput) {
  return client.post("api/blog/posts", { json: input }).json<Post>();
}

export function updatePost(
  client: ApiClient,
  slug: string,
  input: UpdatePostInput,
) {
  return client
    .patch(`api/blog/posts/${slug}`, { json: input })
    .json<Post>();
}

export function deletePost(client: ApiClient, slug: string) {
  return client.delete(`api/blog/posts/${slug}`).json<void>();
}

export function uploadThumbnail(
  client: ApiClient,
  file: File,
  slug: string,
  language: string,
) {
  const form = new FormData();
  form.append("file", file);
  form.append("slug", slug);
  form.append("lang", language);
  return client
    .post("api/blog/upload", { body: form })
    .json<{ key: string; url: string }>();
}

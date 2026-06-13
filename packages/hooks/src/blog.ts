import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, useContext, createElement } from "react";
import type { FC, ReactNode } from "react";
import { createClient } from "@ekajaya/http/client";
import type { ApiClient } from "@ekajaya/http/client";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadThumbnail,
} from "@ekajaya/http/blog";
import type {
  ListPostsParams,
  CreatePostInput,
  UpdatePostInput,
} from "@ekajaya/http/blog";

// ---- API Client Context ----

const ApiClientContext = createContext<ApiClient | null>(null);

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);
  if (!client) {
    throw new Error("useApiClient must be used within <ApiClientProvider>");
  }
  return client;
}

export const ApiClientProvider: FC<{
  baseUrl: string;
  children: ReactNode;
}> = ({ baseUrl, children }) => {
  const client = createClient(baseUrl);
  return createElement(
    ApiClientContext.Provider,
    { value: client },
    children,
  );
};

// ---- Query Keys ----

const postKeys = {
  all: ["posts"] as const,
  list: (params?: ListPostsParams) => ["posts", "list", params] as const,
  detail: (slug: string, language?: string) =>
    ["posts", "detail", slug, language] as const,
};

// ---- Queries ----

export function usePosts(params?: ListPostsParams) {
  const client = useApiClient();
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => listPosts(client, params),
  });
}

export function usePost(slug: string, language = "en") {
  const client = useApiClient();
  return useQuery({
    queryKey: postKeys.detail(slug, language),
    queryFn: () => getPost(client, slug, language),
    enabled: !!slug,
  });
}

// ---- Mutations ----

export function useCreatePost() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(client, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePost(slug: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(client, slug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useDeletePost() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deletePost(client, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUploadThumbnail() {
  const client = useApiClient();
  return useMutation({
    mutationFn: ({
      file,
      slug,
      language,
    }: {
      file: File;
      slug: string;
      language: string;
    }) => uploadThumbnail(client, file, slug, language),
  });
}

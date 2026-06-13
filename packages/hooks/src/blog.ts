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
  Post,
} from "@ekajaya/http/blog";
import { toast } from "sonner";

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

// ---- Callbacks type ----

interface MutationCallbacks<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

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

export function useCreatePost(callbacks?: MutationCallbacks<Post>) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(client, input),
    onSuccess: (data) => {
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
      callbacks?.onError?.(error);
    },
  });
}

export function useUpdatePost(slug: string, callbacks?: MutationCallbacks<Post>) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(client, slug, input),
    onSuccess: (data) => {
      toast.success("Post updated");
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
      callbacks?.onError?.(error);
    },
  });
}

export function useDeletePost(callbacks?: MutationCallbacks<void>) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deletePost(client, slug),
    onSuccess: (_data, slug) => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      callbacks?.onSuccess?.(undefined);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete post");
      callbacks?.onError?.(error);
    },
  });
}

export function useUploadThumbnail(callbacks?: MutationCallbacks<{ key: string; url: string }>) {
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
    onSuccess: (data) => {
      toast.success("Thumbnail uploaded");
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload thumbnail");
      callbacks?.onError?.(error);
    },
  });
}

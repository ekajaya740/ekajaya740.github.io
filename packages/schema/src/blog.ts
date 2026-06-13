import { z } from "zod";
import ISO6391 from "iso-639-1";
import type { LanguageCode } from "iso-639-1";

const languageCodes = ISO6391.getAllCodes() as readonly string[];

const languageSchema = z
  .string()
  .refine((val: string) => languageCodes.includes(val as LanguageCode), {
    message: "Invalid ISO 639-1 language code",
  });

const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  showcase: z.boolean(),
});

export const createPostSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  language: languageSchema.default("en"),
  description: z.string().max(500).optional(),
  tagNames: z.array(z.string().min(1)).optional(),
  thumbnailKey: z.string().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  content: z.string().min(1).optional(),
  language: languageSchema.optional(),
  description: z.string().max(500).optional(),
  tagNames: z.array(z.string().min(1)).optional(),
  thumbnailKey: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const listPostsQuerySchema = z.object({
  status: z.enum(["draft", "published"]).optional(),
  language: languageSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const postSchema = z.object({
  id: z.string(),
  slug: slugSchema,
  title: z.string(),
  content: z.string(),
  language: languageSchema,
  description: z.string().default(""),
  thumbnailKey: z.string().nullable(),
  author: z.string(),
  tags: z.array(tagSchema),
  status: z.enum(["draft", "published"]),
  publishedAt: z.number().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;
export type Post = z.infer<typeof postSchema>;

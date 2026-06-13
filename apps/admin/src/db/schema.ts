import * as authSchema from "./auth-schema";
import * as blogSchema from "./blog-schema";

export const schema = {
  ...authSchema,
  ...blogSchema,
} as const;

export * from "./auth-schema";
export * from "./blog-schema";

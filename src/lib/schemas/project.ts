import { z } from 'zod';

export const BaseProjectSchema = z.object({
  thumbnail: z.string(),
  title: z.string(),
  period: z.string(),
  description: z.string(),
  content: z.string(),
  href: z.string(),
});

export const FeaturedProjectSchema = BaseProjectSchema.omit({
  description: true,
  content: true,
  href: true,
});

export type BaseProjectType = z.infer<typeof BaseProjectSchema>;

export type FeaturedProjectType = z.infer<typeof FeaturedProjectSchema>;

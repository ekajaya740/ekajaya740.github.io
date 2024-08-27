import { z } from 'zod';

export const BaseProjectSchema = z.object({
  src: z.string(),
  alt: z.string(),
  title: z.string(),
  period: z.string(),
});

export type BaseProjectType = z.infer<typeof BaseProjectSchema>;

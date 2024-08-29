import { z } from 'zod';

export const BaseContactSchema = z.object({
  name: z.string(),
  icon: z.string(),
  href: z.string(),
});

export const MultiContactSchema = z.array(BaseContactSchema);

export type BaseContactType = z.infer<typeof BaseContactSchema>;
export type MultiContactType = z.infer<typeof MultiContactSchema>;

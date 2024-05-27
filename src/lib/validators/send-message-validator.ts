import { z } from 'zod';

export const SendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string()
});

export type TSendMessageValidator = z.infer<typeof SendMessageValidator>;

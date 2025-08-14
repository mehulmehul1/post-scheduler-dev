import { z } from "zod";

export const scheduleSchema = z.object({
  text: z.string().min(1).max(280),
  imageUrl: z.string().url().optional(),
  scheduledAt: z.string().datetime(),
  fid: z.string(),
  method: z.enum(["offchain", "onchain"]).optional(),
});

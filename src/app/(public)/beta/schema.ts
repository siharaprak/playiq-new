import { z } from 'zod';

export const BetaApplicationSchema = z.object({
  parentFullName: z.string().min(2, "Parent name is required"),
  emailAddress: z.string().email("Please provide a valid email address"),
  childAge: z.enum(["under_13", "13_14", "15_17", "over_17"], {
    error: "Please select the target teen's age"
  }),
  promoCode: z.string().optional(),
});

export type BetaApplicationData = z.infer<typeof BetaApplicationSchema>;

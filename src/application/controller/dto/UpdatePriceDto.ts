import { z } from "zod";

export const UpdatePriceDTOSchema = z.object({
    id: z.string(),
	unitPrice: z.number().nonnegative(),
});

export type UpdatePriceDTO = z.infer<typeof UpdatePriceDTOSchema>;

import { z } from "zod";

export const StockBookDTOSchema = z.object({
	title: z.string(),
	edition: z.coerce.number().min(1),
	author: z.string(),
	release: z.string(),
	cover: z.string(),
	category: z.string(),
	quantity: z.coerce.number().nonnegative(),
	isVisible: z.coerce.boolean().optional(),
	unitPrice: z.coerce.number().nonnegative(),
});

export type StockBookDTO = z.infer<typeof StockBookDTOSchema>;

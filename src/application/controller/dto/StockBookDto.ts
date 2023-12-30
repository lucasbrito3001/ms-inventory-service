import { z } from "zod";

export const StockBookDTOSchema = z.object({
	title: z.string(),
	edition: z.coerce.number().nonnegative(),
	author: z.string(),
	release: z.string(),
	cover: z.string(),
	quantity: z.coerce.number().nonnegative(),
	isVisible: z.coerce.boolean().optional(),
});

export type StockBookDTO = z.infer<typeof StockBookDTOSchema>;

export interface UpdatePricePort {
	execute(id: string, price: number): Promise<void>;
}

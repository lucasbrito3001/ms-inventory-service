export class PriceUpdated {
	constructor(readonly bookId: string, readonly unitPrice: number) {}
}

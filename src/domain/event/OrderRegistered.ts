export type OrderItems = {
	itemId: string;
	quantity: number;
}[];

export class OrderRegistered {
	constructor(readonly id: string, readonly items: OrderItems) {}
}

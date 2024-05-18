export type OrderItems = {
	itemId: string;
	quantity: number;
}[];

export type OrderItemMessage = {
	itemId: string;
	quantity: number;
};

export type OrderRegisteredMessage = {
	orderId: string;
	accountId: string;
	items: OrderItemMessage[];
	value: number;
};

export class OrderRegistered {
	constructor(
		readonly id: string,
		readonly items: OrderItems,
		readonly accountId: string,
		readonly value: number
	) {}
}

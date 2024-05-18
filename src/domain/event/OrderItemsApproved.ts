import { Event } from "../Base";

export class OrderItemsApproved implements Event {
	queueName: string = "orderItemsApproved";
	message: any;

	constructor(orderId: string, accountId: string, value: number) {
		this.message = { orderId, accountId, value };
	}
}

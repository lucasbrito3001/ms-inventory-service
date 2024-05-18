import { Event } from "../Base";

export class OrderItemsRejected implements Event {
	queueName: string = "orderItemsRejected";
	message: any;

	constructor(readonly orderId: string) {
		this.message = { orderId };
	}
}

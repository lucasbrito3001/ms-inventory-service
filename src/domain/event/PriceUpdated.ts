import { Event } from "../Base";

export class PriceUpdated implements Event {
	queueName: string = "priceUpdated";
	message: any;

	constructor(readonly bookId: string, readonly unitPrice: number) {
		this.message = { bookId, unitPrice };
	}
}

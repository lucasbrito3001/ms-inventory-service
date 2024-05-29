import { Event } from "../Base";

export class BookStocked implements Event {
	queueName: string = "bookStocked";
	message: any;

	constructor(readonly bookId: string, readonly unitPrice: number) {
		this.message = { bookId, unitPrice };
	}
}

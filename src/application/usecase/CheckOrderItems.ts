import { OrderRegisteredMessage } from "@/domain/event/OrderRegistered";
import { CheckOrderItemsPort } from "./interfaces/CheckOrderItemsPort";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { BookRepository } from "../repository/BookRepository";
import { Queue } from "@/infra/queue/Queue";
import { OrderItemsApproved } from "@/domain/event/OrderItemsApproved";
import { OrderItemsRejected } from "@/domain/event/OrderItemsRejected";
import { Book } from "@/domain/entities/Book";

export class CheckOrderItems implements CheckOrderItemsPort {
	private readonly bookRepository: BookRepository;
	private readonly queue: Queue;

	constructor(registry: DependencyRegistry) {
		this.bookRepository = registry.inject("bookRepository");
		this.queue = registry.inject("queue");
	}

	async execute(order: OrderRegisteredMessage): Promise<void> {
		const bookIds = order.items.map((book) => book.itemId);
		const books = await this.bookRepository.searchByIds(bookIds);

		if (bookIds.length > books.length)
			return this.queue.publish(new OrderItemsRejected(order.orderId));

		const isBooksAvailable = books.every((book) => {
			const orderItem = order.items.find((item) => item.itemId === book.id);

			const orderItemQuantity = orderItem?.quantity as number;
			const bookQuantity = book.quantity as number;

			return orderItemQuantity <= bookQuantity;
		});

		if (!isBooksAvailable)
			return this.queue.publish(new OrderItemsRejected(order.orderId));

		const updatedBooks = books.map((book) => {
			const orderItem = order.items.find((item) => item.itemId === book.id);

			const decreasedQuantity = book.quantity - (orderItem?.quantity as number);

			return Book.instance(
				book.id,
				book.title,
				book.edition,
				book.author,
				book.release,
				book.cover,
				book.category,
				decreasedQuantity,
				book.isVisible,
				book.unitPrice
			);
		});

		await this.bookRepository.batchUpdate(updatedBooks);

		await this.queue.publish(
			new OrderItemsApproved(order.orderId, order.accountId, order.value)
		);
	}
}

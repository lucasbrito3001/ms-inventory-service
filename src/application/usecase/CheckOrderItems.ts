import { OrderRegistered } from "@/domain/event/OrderRegistered";
import { CheckOrderItemsPort } from "./interfaces/CheckOrderItemsPort";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { BookRepository } from "../repository/BookRepository";
import { Queue } from "@/infra/queue/Queue";
import { OrderItemsApproved } from "@/domain/event/OrderItemsApproved";
import { OrderItemsRejected } from "@/domain/event/OrderItemsRejected";

export class CheckOrderItems implements CheckOrderItemsPort {
	private readonly bookRepository: BookRepository;
	private readonly queue: Queue;

	constructor(registry: DependencyRegistry) {
		this.bookRepository = registry.inject("bookRepository");
		this.queue = registry.inject("queue");
	}

	async execute(order: OrderRegistered): Promise<void> {
		const bookIds = order.items.map((book) => book.itemId);
		const books = await this.bookRepository.searchByIds(bookIds);

		const isBooksAvailable = books.every((book) => {
			const orderItem = order.items.find((item) => item.itemId === book.id);

			const orderItemQuantity = orderItem?.quantity as number;
			const bookQuantity = book.quantity as number;

			return orderItemQuantity >= bookQuantity;
		});

		this.queue.publish(
			isBooksAvailable ? "orderItemsApproved" : "orderItemsRejected",
			isBooksAvailable
				? new OrderItemsApproved(order.id)
				: new OrderItemsRejected(order.id)
		);
	}
}

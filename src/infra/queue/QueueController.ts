import { Queue } from "./Queue";
import { DependencyRegistry } from "../DependencyRegistry";
import { OrderRegistered } from "@/domain/event/OrderRegistered";
import { CheckOrderItems } from "@/application/usecase/CheckOrderItems";

export class QueueController {
	constructor(readonly registry: DependencyRegistry) {
		const queue = registry.inject("queue");
		const checkOrderItems: CheckOrderItems = registry.inject("checkOrderItems");

		queue.subscribe("orderRegistered", async (message: OrderRegistered) => {
			await checkOrderItems.execute(message);
		});
	}
}

import { Queue } from "./Queue";
import { DependencyRegistry } from "../DependencyRegistry";
import { QueueSubscriber } from "./subscriber/QueueSubscriber";

export class QueueController {
	private readonly queue: Queue;

	constructor(readonly registry: DependencyRegistry) {
		this.queue = registry.inject("queue");
	}

	public appendSubscribers(subscribers: QueueSubscriber[]) {
		subscribers.forEach((subscriber) => {
			this.queue.subscribe(subscriber);
		});
	}
}

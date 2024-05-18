import { Queue } from "../Queue";
import { QueueSubscriber } from "../subscriber/QueueSubscriber";

export class MockQueue implements Queue {
	private queue: any[] = [];

	get length(): number {
		return this.queue.length;
	}

	async connect(): Promise<void> {
		console.log("connected");
	}

	async subscribe(_: any): Promise<void> {
		this.queue.shift();
	}

	async publish(_: string, data: any): Promise<void> {
		this.queue.push(data);
	}
}

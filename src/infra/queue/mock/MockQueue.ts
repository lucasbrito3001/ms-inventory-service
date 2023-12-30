import { Queue } from "../Queue";

export class MockQueue implements Queue {
	queue: any[] = [];

	async connect(): Promise<void> {
		console.log("connected");
	}

	async subscribe(queueName: string, callback: Function): Promise<void> {
		this.queue.shift();
	}

	async publish(queueName: string, data: any): Promise<void> {
		this.queue.push(data);
	}
}

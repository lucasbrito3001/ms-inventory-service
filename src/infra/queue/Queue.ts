import { QueueSubscriber } from "./subscribers/QueueSubscriber";

export interface Queue {
	connect(): Promise<void>;
	subscribe(subscriber: QueueSubscriber): Promise<void>;
	publish(queueName: string, data: any): Promise<void>;
}

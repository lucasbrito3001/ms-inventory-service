import { Event } from "@/domain/Base";
import { QueueSubscriber } from "./subscriber/QueueSubscriber";

export interface Queue {
	connect(): Promise<void>;
	subscribe(subscriber: QueueSubscriber): Promise<void>;
	publish(event: Event): Promise<void>;
}

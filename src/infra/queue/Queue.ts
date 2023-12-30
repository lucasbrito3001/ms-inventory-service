export interface Queue {
	connect(): Promise<void>;
	subscribe(queueName: string, callback: Function): Promise<void>;
	publish(queueName: string, data: any): Promise<void>;
}

export interface QueueSubscriber {
	queueName: string;
	callbackFunction(message: any): Promise<void>;
}

import amqp from "amqplib";
import { Queue } from "./Queue";
import { DependencyRegistry } from "../DependencyRegistry";
import { Logger } from "../log/Logger";
import { QueueSubscriber } from "./subscribers/QueueSubscriber";

export class RabbitMQAdapter implements Queue {
	connection: amqp.Connection | undefined;

	constructor(private readonly logger: Logger) {}

	async connect(): Promise<void> {
		this.connection = await amqp.connect(
			process.env.AMQP_STRING_CONNECTION as string
		);
	}

	async subscribe(subscriber: QueueSubscriber): Promise<void> {
		if (this.connection === undefined) throw new Error("");

		this.logger.logSubscriber(subscriber.queueName);

		const channel = await this.connection.createChannel();
		await channel.assertQueue(subscriber.queueName, { durable: true });
		channel.consume(subscriber.queueName, async (msg: any) => {
			try {
				await subscriber.callbackFunction(JSON.parse(msg.content.toString()));
				channel.ack(msg);
			} catch (error) {
				throw new Error("Error to consume queue: " + error);
			}
		});
	}

	async publish(queueName: string, data: any): Promise<void> {
		if (this.connection === undefined) throw new Error("");

		this.logger.logEvent(queueName, `Message: ${JSON.stringify(data)}`);

		const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
	}
}

import amqp from "amqplib";
import { Queue } from "./Queue";
import { Logger } from "../log/Logger";
import { QueueSubscriber } from "./subscriber/QueueSubscriber";
import { Event } from "@/domain/Base";

export class RabbitMQAdapter implements Queue {
	connection: amqp.Connection | undefined;

	constructor(private readonly logger: Logger) {}

	async connect(): Promise<void> {
		try {
			this.logger.log("[RABBITMQ] Connecting to RabbitMQ...");
			this.connection = await amqp.connect(
				process.env.RABBITMQ_CONNECTION_STRING as string
			);
			this.logger.log("[RABBITMQ] Connected succesfully!");
		} catch (error) {
			console.log(error);
			const anyError = error as any;
			throw new Error(anyError.message);
		}
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

	async publish(event: Event): Promise<void> {
		if (this.connection === undefined) throw new Error("");

		this.logger.logEvent(
			event.queueName,
			`Message: ${JSON.stringify(event.message)}`
		);

		const channel = await this.connection.createChannel();
		await channel.assertQueue(event.queueName, { durable: true });
		channel.sendToQueue(
			event.queueName,
			Buffer.from(JSON.stringify(event.message))
		);
	}
}

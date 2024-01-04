import amqp from "amqplib";
import { Queue } from "./Queue";

export class RabbitMQAdapter implements Queue {
	connection: amqp.Connection | undefined;

	async connect(): Promise<void> {
		this.connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}`);
	}

	async subscribe(queueName: string, callback: Function): Promise<void> {
		if (this.connection === undefined) throw new Error("");

		const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		channel.consume(queueName, async (msg: any) => {
			await callback(JSON.parse(msg.content.toString()));
			channel.ack(msg);
		});
	}

	async publish(queueName: string, data: any): Promise<void> {
		if (this.connection === undefined) throw new Error("");

		const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
	}
}

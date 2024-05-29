export class DomainBase {
	static formatMoneyToPersist(value: number): number {
		return +value.toFixed(2);
	}
}

export interface Event {
	queueName: string;
	message: any;
}

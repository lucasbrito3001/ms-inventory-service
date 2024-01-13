export class DomainBase {
	static formatMoneyToPersist(value: number): number {
		return +value.toFixed(2) * 100;
	}
}

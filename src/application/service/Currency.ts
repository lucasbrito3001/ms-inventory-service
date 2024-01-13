import { ICurrencyService } from "./interfaces/ICurrency";

export class CurrencyService implements ICurrencyService {
	formatToDatabase(value: number): number {
		return +value.toFixed(2) * 100;
	}
}

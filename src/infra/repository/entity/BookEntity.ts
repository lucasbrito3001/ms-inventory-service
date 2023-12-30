import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("book")
export class BookEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar" })
	title?: string;
	@Column({ type: "int" })
	edition?: number;
	@Column({ type: "varchar" })
	author?: string;
	@Column({ type: "varchar" })
	release?: string;
	@Column({ type: "varchar" })
	cover?: string;
	@Column({ type: "int" })
	quantity?: number;
	@Column({ type: "bool" })
	isVisible?: boolean;
}

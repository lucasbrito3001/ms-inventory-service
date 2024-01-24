import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity("book")
@Unique("uk_title_edition_constraint", ["title", "edition"])
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
	@Column({ type: "decimal", precision: 6, scale: 2 })
	unitPrice?: number;
}

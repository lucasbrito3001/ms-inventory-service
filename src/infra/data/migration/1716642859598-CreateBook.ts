import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBook1716642859598 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE book (
        id char(36) PRIMARY KEY,
        title varchar(255) NOT NULL,
        edition int NOT NULL,
        author varchar(255) NOT NULL,
        releaseDate varchar(255) NOT NULL,
        cover varchar(255) NOT NULL,
        category varchar(255) NOT NULL,
        quantity int DEFAULT 0,
        isVisible boolean NOT NULL,
        unitPrice decimal(6, 2) NOT NULL,
        UNIQUE (title, edition)
      );
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX uk_title_edition_constraint ON book`);
		await queryRunner.query(`DROP TABLE book`);
	}
}

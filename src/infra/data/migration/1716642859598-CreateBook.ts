import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBook1716642859598 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
          CREATE TABLE book (
            id uuid PRIMARY KEY,
            title varchar(255) NOT NULL,
            edition int NOT NULL,
            author varchar(255),
            release varchar(255),
            cover varchar(255),
            category varchar(255),
            quantity int,
            isVisible boolean,
            unit_price decimal(6, 2)
          );
    
          CREATE UNIQUE INDEX uk_title_edition_constraint ON book (title, edition);
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX uk_title_edition_constraint ON book`);
		await queryRunner.query(`DROP TABLE book`);
	}
}

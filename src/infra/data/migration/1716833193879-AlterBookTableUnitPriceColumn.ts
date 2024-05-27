import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBookTableUnitPriceColumn1716833193879
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE book RENAME COLUMN unit_price TO unitPrice;
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE book RENAME COLUMN unitPrice TO unit_price;
        `);
    }
}

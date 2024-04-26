import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMultipliersColumnType1714136787813 implements MigrationInterface {
    name = 'FixMultipliersColumnType1714136787813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "multipliers"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "multipliers" double precision array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "multipliers"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "multipliers" integer array NOT NULL DEFAULT '{}'`);
    }

}

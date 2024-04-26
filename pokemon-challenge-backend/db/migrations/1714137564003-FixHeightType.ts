import { MigrationInterface, QueryRunner } from "typeorm";

export class FixHeightType1714137564003 implements MigrationInterface {
    name = 'FixHeightType1714137564003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "height_m"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "height_m" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "height_m"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "height_m" integer NOT NULL`);
    }

}

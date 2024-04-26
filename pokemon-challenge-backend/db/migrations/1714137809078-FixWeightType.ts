import { MigrationInterface, QueryRunner } from "typeorm";

export class FixWeightType1714137809078 implements MigrationInterface {
    name = 'FixWeightType1714137809078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "weight_kg"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "weight_kg" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "weight_kg"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "weight_kg" integer NOT NULL`);
    }

}

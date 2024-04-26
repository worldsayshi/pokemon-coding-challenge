import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableSpawnTime1714142999801 implements MigrationInterface {
    name = 'NullableSpawnTime1714142999801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "spawn_time_h" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "spawn_time_m" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "spawn_time_m" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "spawn_time_h" SET NOT NULL`);
    }

}

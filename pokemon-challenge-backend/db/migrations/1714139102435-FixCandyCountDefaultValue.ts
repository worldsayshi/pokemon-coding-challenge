import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCandyCountDefaultValue1714139102435 implements MigrationInterface {
    name = 'FixCandyCountDefaultValue1714139102435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "candy_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum" RENAME TO "pokemon_weaknesses_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum_old" AS ENUM('Fire', 'Ice', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum_old"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum_old" RENAME TO "pokemon_weaknesses_enum"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "candy_count" DROP DEFAULT`);
    }

}

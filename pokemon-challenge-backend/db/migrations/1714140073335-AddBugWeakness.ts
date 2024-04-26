import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBugWeakness1714140073335 implements MigrationInterface {
    name = 'AddBugWeakness1714140073335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pokemon_type_enum" RENAME TO "pokemon_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_type_enum" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock', 'Electric', 'Bug')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" TYPE "public"."pokemon_type_enum"[] USING "type"::"text"::"public"."pokemon_type_enum"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum" RENAME TO "pokemon_weaknesses_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock', 'Electric', 'Bug')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum_old" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock', 'Electric')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum_old"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum_old" RENAME TO "pokemon_weaknesses_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_type_enum_old" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock', 'Electric')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" TYPE "public"."pokemon_type_enum_old"[] USING "type"::"text"::"public"."pokemon_type_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "type" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_type_enum_old" RENAME TO "pokemon_type_enum"`);
    }

}

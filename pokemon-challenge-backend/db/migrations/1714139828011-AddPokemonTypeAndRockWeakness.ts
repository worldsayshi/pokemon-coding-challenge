import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPokemonTypeAndRockWeakness1714139828011 implements MigrationInterface {
    name = 'AddPokemonTypeAndRockWeakness1714139828011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pokemon_type_enum" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ADD "type" "public"."pokemon_type_enum" array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum" RENAME TO "pokemon_weaknesses_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground', 'Rock')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum_old" AS ENUM('Fire', 'Ice', 'Water', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting', 'Ground')`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" TYPE "public"."pokemon_weaknesses_enum_old"[] USING "weaknesses"::"text"::"public"."pokemon_weaknesses_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "weaknesses" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pokemon_weaknesses_enum_old" RENAME TO "pokemon_weaknesses_enum"`);
        await queryRunner.query(`ALTER TABLE "pokemon" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_type_enum"`);
    }

}

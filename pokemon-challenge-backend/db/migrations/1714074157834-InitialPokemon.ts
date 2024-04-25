import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPokemon1714074157834 implements MigrationInterface {
    name = 'InitialPokemon1714074157834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pokemon_weaknesses_enum" AS ENUM('Fire', 'Grass', 'Poison', 'Flying', 'Psychic', 'Fighting')`);
        await queryRunner.query(`CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "num" text NOT NULL, "name" text NOT NULL, "img" text NOT NULL, "height_m" integer NOT NULL, "weight_kg" integer NOT NULL, "candy" text NOT NULL, "candy_count" integer NOT NULL, "egg" text NOT NULL, "spawn_chance" double precision NOT NULL, "avg_spawns" double precision NOT NULL, "spawn_time_h" integer NOT NULL, "spawn_time_m" integer NOT NULL, "multipliers" integer array NOT NULL DEFAULT '{}', "weaknesses" "public"."pokemon_weaknesses_enum" array NOT NULL DEFAULT '{}', CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pokemon_prev_evolution_pokemon" ("pokemonId_1" integer NOT NULL, "pokemonId_2" integer NOT NULL, CONSTRAINT "PK_b70720ef6f9520fdfc027def040" PRIMARY KEY ("pokemonId_1", "pokemonId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69a04e2038ba82d956e50acba6" ON "pokemon_prev_evolution_pokemon" ("pokemonId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d48750b7ceb2b9d5e3d74afb6" ON "pokemon_prev_evolution_pokemon" ("pokemonId_2") `);
        await queryRunner.query(`CREATE TABLE "pokemon_next_evolution_pokemon" ("pokemonId_1" integer NOT NULL, "pokemonId_2" integer NOT NULL, CONSTRAINT "PK_977ea6c40526333df1c455d0d4e" PRIMARY KEY ("pokemonId_1", "pokemonId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fde95ea644eda7e844231d6df2" ON "pokemon_next_evolution_pokemon" ("pokemonId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_049768691983bd735f8da90670" ON "pokemon_next_evolution_pokemon" ("pokemonId_2") `);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" ADD CONSTRAINT "FK_69a04e2038ba82d956e50acba64" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" ADD CONSTRAINT "FK_1d48750b7ceb2b9d5e3d74afb6c" FOREIGN KEY ("pokemonId_2") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" ADD CONSTRAINT "FK_fde95ea644eda7e844231d6df26" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" ADD CONSTRAINT "FK_049768691983bd735f8da906709" FOREIGN KEY ("pokemonId_2") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" DROP CONSTRAINT "FK_049768691983bd735f8da906709"`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" DROP CONSTRAINT "FK_fde95ea644eda7e844231d6df26"`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" DROP CONSTRAINT "FK_1d48750b7ceb2b9d5e3d74afb6c"`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" DROP CONSTRAINT "FK_69a04e2038ba82d956e50acba64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_049768691983bd735f8da90670"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fde95ea644eda7e844231d6df2"`);
        await queryRunner.query(`DROP TABLE "pokemon_next_evolution_pokemon"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d48750b7ceb2b9d5e3d74afb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69a04e2038ba82d956e50acba6"`);
        await queryRunner.query(`DROP TABLE "pokemon_prev_evolution_pokemon"`);
        await queryRunner.query(`DROP TABLE "pokemon"`);
        await queryRunner.query(`DROP TYPE "public"."pokemon_weaknesses_enum"`);
    }

}

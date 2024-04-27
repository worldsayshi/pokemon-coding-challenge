import { MigrationInterface, QueryRunner } from "typeorm";

export class IdColumnNotGenerated1714226502939 implements MigrationInterface {
    name = 'IdColumnNotGenerated1714226502939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" DROP CONSTRAINT "FK_69a04e2038ba82d956e50acba64"`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" DROP CONSTRAINT "FK_fde95ea644eda7e844231d6df26"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "pokemon_id_seq"`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" ADD CONSTRAINT "FK_69a04e2038ba82d956e50acba64" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" ADD CONSTRAINT "FK_fde95ea644eda7e844231d6df26" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" DROP CONSTRAINT "FK_fde95ea644eda7e844231d6df26"`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" DROP CONSTRAINT "FK_69a04e2038ba82d956e50acba64"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "pokemon_id_seq" OWNED BY "pokemon"."id"`);
        await queryRunner.query(`ALTER TABLE "pokemon" ALTER COLUMN "id" SET DEFAULT nextval('"pokemon_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "pokemon_next_evolution_pokemon" ADD CONSTRAINT "FK_fde95ea644eda7e844231d6df26" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pokemon_prev_evolution_pokemon" ADD CONSTRAINT "FK_69a04e2038ba82d956e50acba64" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

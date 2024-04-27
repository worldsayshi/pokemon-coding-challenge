import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreFuzzyExtensions1714252336327 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR replace FUNCTION soundex_tsvector(v_name text) RETURNS tsvector
            BEGIN ATOMIC
            SELECT to_tsvector('simple',
                                string_agg(array_to_string(daitch_mokotoff(n), ' '), ' '))
            FROM regexp_split_to_table(v_name, '\s+') AS n;
            END;
            
            CREATE or replace FUNCTION soundex_tsquery(v_name text) RETURNS tsquery
            BEGIN ATOMIC
            SELECT string_agg('(' || array_to_string(daitch_mokotoff(n), '|') || ')', '&')::tsquery
            FROM regexp_split_to_table(v_name, '\s+') AS n;
            END;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS soundex_tsquery;`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS soundex_tsvector;`);
    }

}

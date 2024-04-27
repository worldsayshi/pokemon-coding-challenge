import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomTokenizer1714247426159 implements MigrationInterface {


    /*


    */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION edge_gram_tsvector(text text) RETURNS tsvector AS
$BODY$
BEGIN
    RETURN (select array_to_tsvector((select array_agg(distinct substring(lexeme for len)) from unnest(to_tsvector(text)), generate_series(1,length(lexeme)) len)));
END;
$BODY$
IMMUTABLE
language plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS edge_gram_tsvector;`);
    }

}

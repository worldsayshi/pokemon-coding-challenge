import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Pokemon } from 'src/pokemon/pokemon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// const sqlHost = process.env.POKEMON_SQL_HOST;
// const sqlPort = process.env.POKEMON_SQL_PORT;
// const sqlPokemonUsername = process.env.POKEMON_SQL_USERNAME;
// const sqlPokemonDb = process.env.POKEMON_SQL_DB;
// const sqlPassword = process.env.POKEMON_SQL_PASSWORD;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Pokemon],
          logging: true,
          synchronize: true,
        }),
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: sqlHost,
        //   port: parseInt(sqlPort) || 5432,
        //   username: sqlPokemonUsername || 'app',
        //   password: sqlPassword,
        //   database: sqlPokemonDb || 'pokemon',
        //   entities: [Pokemon],
        //   synchronize: false,
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });
});

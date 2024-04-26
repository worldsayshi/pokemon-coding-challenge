import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PokemonModule } from './../src/pokemon/pokemon.module';
import * as pokedex from "../../data/pokedex.json";
import { preparePokemon } from './../src/pokemon/ingestion/data-util';
import {getModule, getDataSource} from "./testDataSource";


const SECONDS = 1000;

describe('AppController (e2e)', () => {
  let app: INestApplication;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PokemonModule,
        // TypeOrmModule.forRoot({
        //   type: 'sqlite',
        //   database: ':memory:',
        //   entities: [Pokemon],
        //   logging: true,
        //   synchronize: false,
        // }),
        await getModule(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/pokemon')
      .expect(200);
  });

  it('Can insert (some of) the pokedex', async () => {

    let createRequests = preparePokemon(pokedex).slice(0,1).map((p) =>
      request(app.getHttpServer())
        .post('/pokemon')
        .send(p)
        .expect(201)
    );

    await (Promise.all([...createRequests]));

    let r = await request(app.getHttpServer())
      .get('/pokemon')
      .expect(200);
    
    expect(r.body).toHaveLength(1);

  }, 70 * SECONDS);



  afterAll(async () => {
    const ds = await getDataSource();
    ds.destroy();
    await app.close();
  });

  // afterEach(async () => {
  //   await userRepository.query('DELETE FROM users');
  // });
});
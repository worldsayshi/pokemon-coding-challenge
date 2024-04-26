import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PokemonModule } from './../src/pokemon/pokemon.module';
import * as pokedex from "../../data/pokedex.json";
import { preparePokemon } from './../src/pokemon/ingestion/data-util';
import {getModule, getDataSource} from "./testDataSource";
import { Pokemon } from 'src/pokemon/pokemon.entity';
import { Repository } from 'typeorm';
import { AssertionError } from 'assert';


const SECONDS = 1000;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pokemonRepository: Repository<Pokemon>;


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
    pokemonRepository = moduleFixture.get('PokemonRepository');
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/pokemon')
      .expect(200);
  });

  it('Can insert (some of) the pokedex', async () => {
    let sliceSize = 100;

    let createRequests = preparePokemon(pokedex).slice(0,sliceSize).map((p) =>
      request(app.getHttpServer())
        .post('/pokemon')
        .send(p)
        .expect(201)
    );

    try {
      await (Promise.all([...createRequests]));
    } catch (error) {
      throw new AssertionError({
        message: "Error in POST request to /pokemon: " + error.message,
      });
    }
    
    let r = await request(app.getHttpServer())
      .get('/pokemon')
      .expect(200);
    
    expect(r.body).toHaveLength(sliceSize);

  }, 70 * SECONDS);



  afterAll(async () => {
    const ds = await getDataSource();
    ds.destroy();
    await app.close();
  });

  afterEach(async () => {
    await pokemonRepository.query('DELETE FROM pokemon');
  });
});
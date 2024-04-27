import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PokemonModule } from './../src/pokemon/pokemon.module';
import * as pokedex from "../../data/pokedex.json";
import { preparePokemon } from './../src/pokemon/ingestion/data-util';
import {getModule, getDataSource} from "./testDataSource";
import { AscOrDesc, Pokemon, PokemonQuery, SortProperty, Weakness } from './../src/pokemon/pokemon.entity';
import { Repository } from 'typeorm';
import { AssertionError } from 'assert';
import { Pokedex } from './../src/pokemon/ingestion/pokedex.type';
import { skip } from 'node:test';


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

  it.skip('Can insert the pokedex', async () => {
    let preparedPokemon = preparePokemon(pokedex);

    await postPokemon(preparedPokemon, app);
    
    let res = await request(app.getHttpServer())
      .post('/pokemon/search')
      .expect(200);
    
    expect(res.body).toHaveLength(pokedex.pokemon.length);

  }, 70 * SECONDS);

  it('Can fetch pokemon by id', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0,4);
    let pokemonId = 2;

    let p = pokedex.pokemon.find(p => p.id === pokemonId);

    await postPokemon(preparedPokemon, app);
    
    let res = await request(app.getHttpServer())
      .get(`/pokemon/get/${pokemonId}`)
      .expect(200);
    
    expect(res.body).toHaveProperty("name", p.name);
  });

  it('Can filter on type and sort Pokemon', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0,4);
    let pokemonType: Weakness = Weakness.Poison;

    let p = pokedex.pokemon.filter(p => p.type.includes(pokemonType));

    await postPokemon(preparedPokemon, app);
    
    let q: PokemonQuery = {
      type: [pokemonType],
      order: [{
        name: SortProperty.height_m,
        order: AscOrDesc.DESC,
      }],
    };

    let res = await request(app.getHttpServer())
      .post(`/pokemon/search`)
      .send(q)
      .expect(200);
    
    let height_m_compare = Number.MAX_VALUE;
    (res.body as Pokemon[]).forEach(pokemon => {
      expect(pokemon.type).toContain(pokemonType);
      expect(pokemon.height_m).toBeLessThanOrEqual(height_m_compare);
      height_m_compare = pokemon.height_m;
    });
  });

  it('Can retrieve Pokemon by exact name', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0,4);
    let pokemonName = "Venusaur";

    await postPokemon(preparedPokemon, app);
    
    let q: PokemonQuery = {
      name: {
        exact: pokemonName,
      },
    };

    let res = await request(app.getHttpServer())
      .post(`/pokemon/search`)
      .send(q)
      .expect(200);

    const [p] = res.body as Pokemon[];
    expect(p.name).toBe(pokemonName);
  });

  it('Can retrieve Pokemon by fuzzy name search', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0,4);
    let pokemonName = "Venusaur";

    await postPokemon(preparedPokemon, app);
    
    let q: PokemonQuery = {
      name: {
        fuzzy: "Venus",
      },
    };

    let res = await request(app.getHttpServer())
      .post(`/pokemon/search`)
      .send(q)
      .expect(200);

    const [p] = res.body as Pokemon[];
    expect(p.name).toBe(pokemonName);
  });

  afterAll(async () => {
    const ds = await getDataSource();
    ds.destroy();
    await app.close();
  });

  afterEach(async () => {
    await pokemonRepository.query('DELETE FROM pokemon');
  });
});
async function postPokemon(preparedPokemon: any[], app: INestApplication<any>) {
  for (let p of preparedPokemon) {
    try {
      await request(app.getHttpServer())
        .post('/pokemon/create')
        .send(p)
        .expect(201);
    } catch (error) {
      throw new AssertionError({
        message: "Error in POST request to /pokemon: " + error.message,
      });
    }
  }
}


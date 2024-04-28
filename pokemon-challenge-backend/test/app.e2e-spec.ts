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

  it('Can insert the pokedex', async () => {
    let preparedPokemon = preparePokemon(pokedex);

    await postPokemon(preparedPokemon, app);
    
    let res = await request(app.getHttpServer())
      .post('/pokemon/search')
      .expect(200);
    
    expect(res.body).toHaveLength(pokedex.pokemon.length);

  }, 70 * SECONDS);

  it.only('Can fetch pokemon by id', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0,4);
    let pokemonId = 2; // Ivysaur

    let pDex = pokedex.pokemon.find(p => p.id === pokemonId);

    await postPokemon(preparedPokemon, app);
    
    let res = await request(app.getHttpServer())
      .get(`/pokemon/get/${pokemonId}`)
      .expect(200);
    
    let ivusaur = res.body as Pokemon;

    expect(ivusaur).toHaveProperty("name", pDex.name);

    // We should get the next and prev evolution Pokemon
    expect(ivusaur?.prev_evolution).toHaveLength(1);
    expect(ivusaur?.next_evolution).toHaveLength(1);
    expect(ivusaur?.prev_evolution[0]?.name).toEqual("Bulbasaur");
    expect(ivusaur?.next_evolution[0]?.name).toEqual("Venusaur");

    // Next reference in the evolution chain should also have their references
    let venusaur = ivusaur.next_evolution[0];
    expect(venusaur.prev_evolution[0]?.name).toEqual("Ivysaur");
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
    let preparedPokemon = preparePokemon(pokedex).slice(0, 4);
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

  test.each([["Venus", "Venusaur"], ["sharmander","Charmander"]])('Can retrieve Pokemon by fuzzy name search', async (fuzzyPhrase, pokemonName) => {
    let preparedPokemon = preparePokemon(pokedex).slice(0, 6);

    await postPokemon(preparedPokemon, app);
    
    let q: PokemonQuery = {
      name: {
        fuzzy: fuzzyPhrase,
      },
    };

    let res = await request(app.getHttpServer())
      .post(`/pokemon/search`)
      .send(q)
      .expect(200);

    const [p] = res.body as Pokemon[];
    expect(p?.name).toBe(pokemonName);
  });

  it('Can not send fuzzy search phrase shorter than 2 characters long', async () => {
    let preparedPokemon = preparePokemon(pokedex).slice(0, 6);

    await postPokemon(preparedPokemon, app);
    
    let q: PokemonQuery = {
      name: {
        fuzzy: "ab",
      },
    };

    await request(app.getHttpServer())
      .post(`/pokemon/search`)
      .send(q)
      .expect(400);
  });


  it('Can suggest Pokemon to counter another Pokemon', async () => {
    let preparedPokemon = preparePokemon(pokedex);
    let foe = preparedPokemon[0];

    await postPokemon(preparedPokemon, app);

    let res = await request(app.getHttpServer())
      .post(`/pokemon/suggest-counter`)
      .send(foe)
      .expect(200);

    const counter = res.body as Pokemon;
    foe.type.forEach(t => {
      expect(counter.weaknesses).not.toContain(t);
    });

    // The counter should not have any weakness to the elements of its foe
    counter.weaknesses.forEach(t => {
      expect(foe.type).not.toContain(t);
    });
    
    // The counter should have at least one type that the foe is weak to
    expect(counter.type.find(t => foe.weaknesses.includes(t))).toBeTruthy();
  });

  afterAll(async () => {
    const ds = await getDataSource();
    ds.destroy();
    await app.close();
  });

  afterEach(async () => {
    await pokemonRepository.query('DELETE FROM pokemon_next_evolution_pokemon');
    await pokemonRepository.query('DELETE FROM pokemon_prev_evolution_pokemon');
    await pokemonRepository.query('DELETE FROM pokemon');
  });


});


async function postPokemon(preparedPokemon: any[], app: INestApplication<any>) {
  try {
    await request(app.getHttpServer())
      .post('/pokemon/insert-many')
      .send(preparedPokemon)
      .expect(201);
  } catch (error) {
    throw new AssertionError({
      message: "Error in POST request to /pokemon/insert-many: " + error.message,
    });
  }
  // for (let p of preparedPokemon) {
  //   try {
  //     await request(app.getHttpServer())
  //       .post('/pokemon/create')
  //       .send(p)
  //       .expect(201);
  //   } catch (error) {
  //     throw new AssertionError({
  //       message: "Error in POST request to /pokemon: " + error.message,
  //     });
  //   }
  // }
}


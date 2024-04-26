import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PokemonModule } from './../src/pokemon/pokemon.module';

import * as pokedex from "../../data/pokedex.json";
import { preparePokemon } from './../src/pokemon/ingestion/data-util';
//import async from "async";
//import { Connection, getConnectionManager, getConnection, DataSource,  } from 'typeorm';
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

  it.skip('Can insert (some of) the pokedex', async () => {

    await (Promise.all(preparePokemon(pokedex).slice(0,1).map((p) =>
      request(app.getHttpServer())
        .post('/pokemon')
        .send({pokemon: p})
        .expect(200)
    )));

  }, 70 * SECONDS);



  afterAll(async () => {
    console.log("AFTER ALL");
    //await closeDBConnection();
    // const connection = app.get(Connection);
    // await connection.close();
    const ds = await getDataSource();
    ds.destroy();
    await app.close();
  });

  // afterEach(async () => {
  //   await userRepository.query('DELETE FROM users');
  // });
});


// async function closeDBConnection() {
//   const conn = getConnectionManager().get();

//   if (conn.isConnected) {
//     await conn
//       .close()
//       .then(() => {
//         this.logger.log('DB conn closed');
//       })
//       .catch((err: any) => {
//         this.logger.error('Error clossing conn to DB, ', err);
//       });
//   } else {
//     this.logger.log('DB conn already closed.');
//   }
// }
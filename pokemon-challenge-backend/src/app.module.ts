import { ConfigModule } from '@nestjs/config';

const isDevelopment = process.env.NODE_ENV === "development";
const configModule = isDevelopment ? ConfigModule.forRoot() : null;

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Pokemon } from "./pokemon/pokemon.entity";
import { PokemonService } from './pokemon/pokemon.service';
import { PokemonController } from './pokemon/pokemon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

const sqlHost = process.env.POKEMON_SQL_HOST;
const sqlPort = process.env.POKEMON_SQL_PORT;
const sqlPokemonUsername = process.env.POKEMON_SQL_USERNAME;
const sqlPokemonDb = process.env.POKEMON_SQL_DB;
const sqlPassword = process.env.POKEMON_SQL_PASSWORD;

@Module({
  imports: [
    HttpModule,
    ...([configModule].filter(x => x)),
    TypeOrmModule.forFeature([Pokemon]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: sqlHost,
      port: parseInt(sqlPort) || 5432,
      username: sqlPokemonUsername || 'app',
      password: sqlPassword,
      database: sqlPokemonDb || 'pokemon',
      entities: [Pokemon],
      synchronize: false,
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class AppModule {}

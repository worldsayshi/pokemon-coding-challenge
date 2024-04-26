import { ConfigService } from '@nestjs/config';
import { Pokemon } from './../src/pokemon/pokemon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

/*
    This is a workaround for TestingModules apparently not closing database connections properly
    so we need to have access to the datasource.
 */

const sqlHost = process.env.POKEMON_SQL_HOST;
const sqlPort = process.env.POKEMON_SQL_PORT;
const sqlPokemonUsername = process.env.POKEMON_SQL_USERNAME;
const sqlPokemonDb = process.env.POKEMON_SQL_DB;
const sqlPassword = process.env.POKEMON_SQL_PASSWORD;

const initialOptions: DataSourceOptions = {
    type: 'postgres',
    host: sqlHost,
    port: parseInt(sqlPort) || 5432,
    username: sqlPokemonUsername || 'pokemon',
    password: sqlPassword,
    database: sqlPokemonDb || 'pokemon',
    entities: [Pokemon],
    synchronize: false,
};

let dataSource = null;
let dataSourceModule = null;

export async function getDataSource (options?: DataSourceOptions) {
    if(dataSource) return dataSource;
    dataSource = await new DataSource(options).initialize();
    return dataSource;
}

export async function getModule () {
    if (dataSourceModule) return dataSourceModule;
    return TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => (initialOptions),
    
        dataSourceFactory: async (options) => {
            return getDataSource(options);
        },
    })
}

//export const testDataSourceModule = ;
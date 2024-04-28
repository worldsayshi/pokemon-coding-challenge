import { DataSource, DataSourceOptions } from "typeorm";

let PORT = 5433;

let connectionOptions: DataSourceOptions = {
  type: "postgres" as "postgres", // It could be mysql, mongo, etc
  host: "pokemon-challenge.local-cluster",
  port: PORT,
  username: "pokemon",
  password: process.env.POKEMON_SQL_PASSWORD_TEST,
  database: "pokemon",
  synchronize: false, // if true, you don't really need migrations
  logging: true,
  entities: ["./src/**/*.entity{.ts,.js}"], // where our entities reside
  migrations: ["db/migrations/*{.ts,.js}"], // where our migrations reside
};

export default new DataSource({
  ...connectionOptions,
});
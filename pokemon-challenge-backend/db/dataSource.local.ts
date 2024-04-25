import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

let PORT = 5432;

let connectionOptions: DataSourceOptions = {
  type: "postgres" as "postgres", // It could be mysql, mongo, etc
  host: "localhost",
  port: PORT,
  username: "app",
  password: process.env.PGPASSWORD,
  database: "app",
  synchronize: false, // if true, you don't really need migrations
  logging: true,
  entities: ["../src/**/*.entity{.ts,.js}"], // where our entities reside
  migrations: ["db/migrations/*{.ts,.js}"], // where our migrations reside
};

export default new DataSource({
  ...connectionOptions,
});
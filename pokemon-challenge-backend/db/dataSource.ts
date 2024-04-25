import DataSourceProd from "./dataSource.prod";
import DataSourceLocal from "./dataSource.local";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

export default process.env.NODE_ENV === "production"
  ? DataSourceProd
  : DataSourceLocal;
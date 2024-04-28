import { preparePokemon, postPokemon } from './../src/pokemon/ingestion/data-util';
import * as pokedex from "../../data/pokedex.json";

(async () => {
    let preparedPokemon = preparePokemon(pokedex);
    let res = await postPokemon("http://localhost:3100/pokemon", preparedPokemon);
    console.log("insertion result: ", res);
})();

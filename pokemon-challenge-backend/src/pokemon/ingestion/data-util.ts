import { isNumber } from "class-validator";
import { Pokemon, PokemonInput, Weakness } from "../pokemon.entity";
import { RawInputPokemon as RawPokemonInput, Pokedex } from "./pokedex.type";


export function preparePokemon(pokedex: Pokedex): PokemonInput[] {
  return pokedex.pokemon.map((p: RawPokemonInput) => {
    const {
      type,
      weaknesses,
      height,
      weight,
      spawn_time,
      multipliers,
      candy_count,
      prev_evolution,
      next_evolution,
      ...rest
    } = p;

    const [spawn_time_h_s, spawn_time_m_s] = spawn_time.split(":").length === 2 ?
      spawn_time.split(":") : [null, null];

    return {
      ...rest,
      type: type as Weakness[], // Not type safe but the api will handle it
      weaknesses: weaknesses as Weakness[],
      height_m: Number.parseFloat(height.split(" ")[0]),
      weight_kg: Number.parseFloat(weight.split(" ")[0]),
      spawn_time_h: Number.parseInt(spawn_time_h_s),
      spawn_time_m: Number.parseInt(spawn_time_m_s),
      multipliers: multipliers ?? [],
      candy_count: candy_count ?? 0,
      prev_evolution_nums: (prev_evolution ?? []).map(({ num }) => num),
      next_evolution_nums: (next_evolution ?? []).map(({ num }) => num)
    };
  });
}


export function printAllWeaknesses(pokedex: Pokedex) {
  let weaknesses = new Set();
  for (let p of pokedex.pokemon) {
    (p.weaknesses ?? []).forEach(w => {
      //console.log(w);
      weaknesses.add(w);
    });
    (p.type ?? []).forEach(w => {
      //console.log(w);
      weaknesses.add(w);
    });
  }
  let out = "";
  for (let w of weaknesses) {
    out += (`${w} = "${w}",\n`);
  }
  console.log(out);
}

export async function postPokemon(endpoint, preparedPokemon: PokemonInput[]) {
  try {
    const rawResponse = await fetch(endpoint + '/insert-many', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preparePokemon)
    });
    const content = await rawResponse.json();

    //console.log(content);
    return content;
  } catch (error) {
    throw new Error("Error in POST request to /pokemon/insert-many: " + error.message);
  }
}
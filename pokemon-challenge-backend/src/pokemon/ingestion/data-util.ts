import { Pokemon, PokemonInput } from "../pokemon.entity";
import { RawInputPokemon as RawPokemonInput, Pokedex } from "./pokedex.type";


export function preparePokemon(pokedex: Pokedex): any[] {
    return pokedex.pokemon.map((p: RawPokemonInput) => {
        const {
            height,
            weight,
            spawn_time,
            multipliers,
            ...rest
        } = p;
        const [spawn_time_h_s, spawn_time_m_s] = spawn_time.split(":");
        return {
            ...rest,
            height_m: Number.parseFloat(height.split(" ")[0]),
            weight_kg: Number.parseFloat(weight.split(" ")[0]),
            spawn_time_h: Number.parseInt(spawn_time_h_s),
            spawn_time_m: Number.parseInt(spawn_time_m_s),
            multipliers: multipliers ?? [],
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
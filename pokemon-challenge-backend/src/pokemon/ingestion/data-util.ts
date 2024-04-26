import { Pokedex } from "./pokedex.type";


export function preparePokemon(pokedex: Pokedex) {
    return pokedex.pokemon.map((p) => {
        const { ...rest} = p;
        return {...rest};
    });
    // for(let p of pokedex.pokemon) {
    //     const { ...rest} = p;
    //     return {...rest};
    // }
}
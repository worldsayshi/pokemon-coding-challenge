import { Body, Controller, Get, Put } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon } from "./pokemon.entity";


@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}


    @Get()
    async getPokemon(): Promise<Pokemon[]> {
        console.log("poke");
        let ps = await this.pokemonService.getPokemon();
        console.log("poke 2");
        return ps;
    }

    // Update one Pokemon
    @Put()
    updateDoc(@Body() pokemon: Pokemon) {
      return this.pokemonService.update(pokemon);
    }
}
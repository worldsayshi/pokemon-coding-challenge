import { Body, Controller, Get, Post, Put } from "@nestjs/common";
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
    updatePokemon(@Body() pokemon: Pokemon) {
      return this.pokemonService.update(pokemon);
    }

    // Post one Pokemon
    @Post()
    createPokemon(@Body() pokemon: Pokemon) {
        console.log("pokemonpokemonpokemonpokemonpokemon", pokemon);
        return this.pokemonService.create(pokemon);
    }
    
}
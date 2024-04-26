import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon, PokemonInput } from "./pokemon.entity";


@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}


    @Get()
    async getPokemon(): Promise<Pokemon[]> {
        let ps = await this.pokemonService.getPokemon();
        return ps;
    }

    // Update one Pokemon
    @Put()
    updatePokemon(@Body() pokemon: Pokemon) {
      return this.pokemonService.update(pokemon);
    }

    // Post one Pokemon
    @Post()
    createPokemon(@Body() pokemon: PokemonInput) {
        return this.pokemonService.create(pokemon);
    }
    
}
import { Body, Controller, Get, Put } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon } from "./pokemon.entity";


@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}


    @Get()
    getPokemon(): Pokemon[] {
        return this.pokemonService.getPokemon();
    }

    // Update one Pokemon
    @Put()
    updateDoc(@Body() pokemon: Pokemon) {
      return this.pokemonService.update(pokemon);
    }
}
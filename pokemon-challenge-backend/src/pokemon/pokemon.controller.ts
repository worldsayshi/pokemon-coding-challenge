import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
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
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = await this.pokemonService.getById(id)
        return res;
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
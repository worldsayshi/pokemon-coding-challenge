import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";

@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}


    @Get()
    async findPokemon(@Query() query: PokemonQuery): Promise<Pokemon[]> {
        let ps = await this.pokemonService.getPokemon(query);
        return ps;
    }
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = await this.pokemonService.getById(id)
        return res;
    }

    // Post one Pokemon
    @Post()
    createPokemon(@Body() pokemon: PokemonInput) {
        return this.pokemonService.create(pokemon);
    }
    
}
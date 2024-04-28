import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, HttpCode } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";
import { ApiResponse } from "@nestjs/swagger";

@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}

    // @Get()
    // async findPokemon(@Query() query: PokemonQuery): Promise<Pokemon[]> {
    //     let ps = await this.pokemonService.getPokemon(query);
    //     return ps;
    // }

    @Post("/search")
    @HttpCode(200)
    async searchPokemon(@Body() query?: PokemonQuery): Promise<Pokemon[]> {
        let ps = await this.pokemonService.getPokemon(query);
        return ps;
    }

    @Post("/suggest-counter")
    @ApiResponse({
        status: 200,
        description: "Submit a Pokemon and get a suggestion for a strong Pokemon to use as a counter."
    })
    @HttpCode(200)
    async suggestCounterPokemon(@Body() pokemon?: Pokemon): Promise<Pokemon> {
        let ps = await this.pokemonService.getCounter(pokemon);
        return ps;
    }
    
    @Get('/get/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
        let res = await this.pokemonService.getById(id)
        return res;
    }

    // Post one Pokemon
    @Post('/create')
    createPokemon(@Body() pokemon: PokemonInput) {
        return this.pokemonService.create(pokemon);
    }
    
}
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, HttpCode, HttpException, HttpStatus, ValidationPipe, ParseArrayPipe } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";
import { ApiResponse } from "@nestjs/swagger";

@Controller("pokemon")
export class PokemonController {
    constructor(
        private readonly pokemonService: PokemonService,
    ) {}

    @Post("/search")
    @HttpCode(200)
    async searchPokemon(@Body() query?: PokemonQuery): Promise<Pokemon[]> {
        if(query?.name?.fuzzy && query?.name?.fuzzy?.length < 3) {
            throw new HttpException(
                "Fuzzy search text needs to be at least 3 characters long",
                HttpStatus.BAD_REQUEST,
            );
        }
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
    
    @ApiResponse({
        status: 200,
        description: "Get a Pokemon by id."
    })
    @Get('/get/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
        let res = await this.pokemonService.getById(id);
        return res;
    }

    @ApiResponse({
        status: 201,
        description: "Create one Pokemon."
    })
    @Post('/create')
    createPokemon(@Body() pokemon: PokemonInput) {
        return this.pokemonService.create(pokemon);
    }

    @ApiResponse({
        status: 201,
        description: "Create many Pokemon."
    })
    @Post('/insert-many')
    insertManyPokemon(@Body(new ParseArrayPipe({ items: PokemonInput })) pokemon: PokemonInput[]) {
        return this.pokemonService.createMany(pokemon);
    }
}
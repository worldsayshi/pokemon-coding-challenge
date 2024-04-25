import { Injectable } from "@nestjs/common";
import { Pokemon } from "./pokemon.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PokemonService {

    constructor(
        @InjectRepository(Pokemon)
        private pokemonRepository: Repository<Pokemon>,
    ) {}

    async getPokemon(): Promise<Pokemon[]> {
        return this.pokemonRepository.find({});
    }
    update(pokemon: Pokemon) {
        throw new Error("Method not implemented.");
    }
}
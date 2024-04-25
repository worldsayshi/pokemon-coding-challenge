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

    getPokemon(): Pokemon[] {
        throw this.pokemonRepository.find({});
    }
    update(pokemon: Pokemon) {
        throw new Error("Method not implemented.");
    }
}
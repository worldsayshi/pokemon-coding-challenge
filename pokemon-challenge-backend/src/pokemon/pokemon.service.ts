import { Injectable } from "@nestjs/common";
import { Pokemon, PokemonInput } from "./pokemon.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PokemonService {

    constructor(
        @InjectRepository(Pokemon)
        private pokemonRepository: Repository<Pokemon>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) {}

    async getPokemon(): Promise<Pokemon[]> {
        return this.pokemonRepository.find({});
    }
    update(pokemon: Pokemon) {
        throw new Error("Method not implemented.");
    }

    async create(pokemon: PokemonInput) {
        let p = await this.pokemonRepository.create({
            ...pokemon,
            prev_evolution: pokemon.prev_evolution_nums.map(num => ({num})),
            next_evolution: pokemon.next_evolution_nums.map(num => ({num})),
        });

        console.log('p', p);

        // return this.pokemonService.create({
        //     ...pokemon,
        //     prev_evolution: pokemon.prev_evolution_nums.map(num => ({num})),
        //     next_evolution: pokemon.next_evolution_nums
        // });
        return this.pokemonRepository.save(p)
    }
}
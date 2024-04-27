import { Injectable } from "@nestjs/common";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";
import { ArrayContains, DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PokemonService {

    constructor(
        @InjectRepository(Pokemon)
        private pokemonRepository: Repository<Pokemon>,
        @InjectDataSource()
        private dataSource: DataSource,
    ) {}

    async getPokemon(query: PokemonQuery): Promise<Pokemon[]> {
        let {
            type,
            name,
        } = query;
        return this.pokemonRepository.find({ where: {
            name,
            type: ArrayContains(
                Array.isArray(type) ? type : [type]
            ),
        }});
    }

    getById(id: number) {
        return this.pokemonRepository.findOne({ where: { id }});
    }

    async create(pokemon: PokemonInput) {
        let p = await this.pokemonRepository.create({
            ...pokemon,
            prev_evolution: pokemon.prev_evolution_nums.map(num => ({num})),
            next_evolution: pokemon.next_evolution_nums.map(num => ({num})),
        });

        // return this.pokemonService.create({
        //     ...pokemon,
        //     prev_evolution: pokemon.prev_evolution_nums.map(num => ({num})),
        //     next_evolution: pokemon.next_evolution_nums
        // });
        return this.pokemonRepository.save(p)
    }
}
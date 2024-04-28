import { Injectable } from "@nestjs/common";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";
import { ArrayContains, Brackets, DataSource, Repository } from "typeorm";
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
            order,
        } = query;
        let qb = this.pokemonRepository.createQueryBuilder();

        if (name?.exact) {
            qb = qb.andWhere({name: name.exact});
        } else if (name?.fuzzy) {
            qb = qb.andWhere(
                new Brackets((qb) => {
                    const formattedQuery = name.fuzzy.trim().replace(/ /g, ' & ');
                    qb.where(
                        'to_tsvector(name) @@ to_tsquery(:searchTerm)',
                        { searchTerm: `${formattedQuery}:*` }
                    ).orWhere(
                        'edge_gram_tsvector(name) @@ to_tsquery(:searchTerm)',
                        { searchTerm: `%${name.fuzzy}:*%` }
                    ).orWhere(
                        'name ILIKE :searchTerm',
                        { searchTerm: `%${name.fuzzy}%` }
                    ).orWhere(
                        'soundex_tsvector(name) @@ soundex_tsquery(:searchTerm)',
                        { searchTerm: `%${name.fuzzy}%` }
                    );
                }
            ));
        }
        if (type) {
            qb = qb.andWhere({type: ArrayContains(
                Array.isArray(type) ? type : [type]
            ),});
        }
        if (order) {
            qb = qb.orderBy(order.reduce((prev, curr) => ({
                ...prev,
                [curr.name]: curr.order,
            }), {}));
        }
        return qb.getMany();
    }

    async getById(id: number) {
        let p = await this.pokemonRepository.createQueryBuilder('p')
            .where({ id }).getOne();

        p.prev_evolution = await this.pokemonRepository.createQueryBuilder('p')
            .relation(Pokemon, "prev_evolution")
            .of(p).loadMany();
        for(let p_prev of p.prev_evolution) {
            p_prev.prev_evolution = await this.pokemonRepository.createQueryBuilder('p')
                .relation(Pokemon, "prev_evolution")
                .of(p_prev).loadMany();
            p_prev.next_evolution = await this.pokemonRepository.createQueryBuilder('p')
                .relation(Pokemon, "next_evolution")
                .of(p_prev).loadMany();
        }
            
        p.next_evolution = await this.pokemonRepository.createQueryBuilder('p')
            .relation(Pokemon, "next_evolution")
            .of(p).loadMany();
        for(let p_next of p.next_evolution) {
            p_next.prev_evolution = await this.pokemonRepository.createQueryBuilder('p')
                .relation(Pokemon, "prev_evolution")
                .of(p_next).loadMany();
            p_next.next_evolution = await this.pokemonRepository.createQueryBuilder('p')
                .relation(Pokemon, "next_evolution")
                .of(p_next).loadMany();
        }
        
        return p;
        // return this.pokemonRepository.findOne({ where: { id }});
    }

    async create(pokemon: PokemonInput) {
        return this.createMany([pokemon]);
        // let qb = this.pokemonRepository.createQueryBuilder();
        // pokemon.prev_evolution_nums.forEach((num) => {
        //     qb.orWhere({ num });
        // });
        // pokemon.next_evolution_nums.forEach((num) => {
        //     qb.orWhere({ num });
        // });

        // let pokemon_evolutions = await qb.getMany();

        // let p = await this.pokemonRepository.create({
        //     ...pokemon,
        //     prev_evolution: pokemon.prev_evolution_nums.map(num =>
        //         (pokemon_evolutions.find((evolution) => evolution.num === num))),
        //     next_evolution: pokemon.next_evolution_nums.map(num =>
        //         (pokemon_evolutions.find((evolution) => evolution.num === num))),
        // });

        // return this.pokemonRepository.save(p);
    }

    async createMany(pokemon: PokemonInput[]) {
        // First save all pokemon without references
        let p = await this.pokemonRepository.create(pokemon);
        await this.pokemonRepository.save(p);

        // Then gather all num references
        let evolutionNums = Array.from(pokemon.reduce((num_set, current_pokemon) => {
            current_pokemon.prev_evolution_nums.forEach(n => num_set.add(n));
            current_pokemon.next_evolution_nums.forEach(n => num_set.add(n));
            return num_set;
        }, new Set<string>()).values());

        // Fetch Pokemon corresponding to the nums
        let evolutionPokemon = (await this.pokemonRepository.createQueryBuilder("pokemon")
            .where(
                'pokemon.num IN (:...evolutionNums)',
                { evolutionNums }
            ).getMany());

        // Make a lookup table for the evolution pokemon
        let evolutionPokemonLookup = evolutionPokemon.reduce((lookup, p) => {
            lookup[p.num] = p;
            return lookup;
        }, {});
        function evolutionPokemonLookupWithFallback (num: string) {
            return evolutionPokemonLookup[num] ?? { num };
        }

        // Enrich the pokemon next and prev evolution relations using the fetched pokemon
        let enrichedPokemon: Pokemon[] = pokemon.map(({
            prev_evolution_nums,
            next_evolution_nums,
            ...rest
        }) => {
            return ({
                ...rest,
                prev_evolution: prev_evolution_nums.map(num => evolutionPokemonLookupWithFallback(num)),
                next_evolution: next_evolution_nums.map(num => evolutionPokemonLookupWithFallback(num)),
            });
        });
        return this.pokemonRepository.save(enrichedPokemon);
    }

    async getCounter(foe: Pokemon): Promise<Pokemon> {
        let qb = this.pokemonRepository.createQueryBuilder();

        // The counter should not have any weakness to the elements of its foe
        qb = qb.where('not :foeType && weaknesses', { foeType: foe.type });

        // The counter should have at least one type that the foe is weak to
        qb = qb.andWhere(':foeWeaknesses && type', { foeWeaknesses: foe.weaknesses });

        return qb.getOne();
    }
}
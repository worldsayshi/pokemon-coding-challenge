import { Injectable } from "@nestjs/common";
import { Pokemon, PokemonInput, PokemonQuery } from "./pokemon.entity";
import { ArrayContains, Brackets, DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PokemonService {
    createMany(pokemon: PokemonInput[]) {
        throw new Error("Method not implemented.");
    }

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
        // return this.pokemonRepository.find({
        //     where: {
        //         ...(name?.exact && {name: name.exact}),
        //         ...(type && {type: ArrayContains(
        //             Array.isArray(type) ? type : [type]
        //         ),})
        //     },
        //     ...(order && {order: order.reduce((prev, curr) => ({
        //         ...prev,
        //         [curr.name]: curr.order,
        //     }), {})}),
        // });
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

        return this.pokemonRepository.save(p);
    }

    async getCounter(foe: Pokemon): Promise<Pokemon> {
        let qb = this.pokemonRepository.createQueryBuilder();

        // The counter should not have any weakness to the elements of its foe
        qb.where('not :foeType && weaknesses', { foeType: foe.type });

        // The counter should have at least one type that the foe is weak to
        qb.andWhere(':foeWeaknesses && type', { foeWeaknesses: foe.weaknesses });

        return qb.getOne();
    }
}
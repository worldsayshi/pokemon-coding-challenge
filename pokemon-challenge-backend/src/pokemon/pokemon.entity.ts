import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

export enum Weakness {
  Fire = "Fire",
  Grass = "Grass",
  Poison = "Poison",
  Flying = "Flying",
  Psychic = "Psychic",
  Fighting = "Fighting"
}

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  num: string;

  @Column('text')
  name: string;

  @Column('text')
  img: string;

  @Column('integer')
  height_m: number;

  @Column('integer')
  weight_kg: number;

  @Column('text')
  candy: string;

  @Column('integer')
  candy_count: number;

  @Column('text')
  egg: string;

  @Column('float')
  spawn_chance: number;

  @Column('float')
  avg_spawns: number;

  @Column('integer')
  spawn_time_h: number;

  @Column('integer')
  spawn_time_m: number;

  @Column('float', { array: true, default: [] })
  multipliers: number[];

  @Column({
    type: "simple-enum",// "enum",
    array: true,
    enum: Weakness,
    default: [],
  })
  weaknesses: Weakness[];

  @ApiHideProperty()
  @ManyToMany(type => Pokemon)
  @JoinTable()
  prev_evolution: Pokemon[];

  @ApiHideProperty()
  @ManyToMany(type => Pokemon)
  @JoinTable()
  next_evolution: Pokemon[];

}


const apokemon = {
  "id": 1,
  "num": "001",
  "name": "Bulbasaur",
  "img": "http://www.serebii.net/pokemongo/pokemon/001.png",
  "type": [
    "Grass",
    "Poison"
  ],
  "height": "0.71 m",
  "weight": "6.9 kg",
  "candy": "Bulbasaur Candy",
  "candy_count": 25,
  "egg": "2 km",
  "spawn_chance": 0.69,
  "avg_spawns": 69,
  "spawn_time": "20:00",
  "multipliers": [1.58],
  "weaknesses": [
    "Fire",
    "Ice",
    "Flying",
    "Psychic"
  ],
  "next_evolution": [{
    "num": "002",
    "name": "Ivysaur"
  }, {
    "num": "003",
    "name": "Venusaur"
  }]
};

export class PokemonInput extends Pokemon {
  @ApiProperty({
    example: ["001"],
    description: 'The num attribute of the previous evolution of this Pokemon',
  })
  prev_evolution_nums: string[];
  @ApiProperty({
    example: ["008"],
    description: 'The num attribute of the next evolution of this Pokemon',
  })
  next_evolution_nums: string[];
}
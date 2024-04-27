import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

export enum Weakness {
  Fire = "Fire",
  Ice = "Ice",
  Flying = "Flying",
  Psychic = "Psychic",
  Grass = "Grass",
  Poison = "Poison",
  Water = "Water",
  Ground = "Ground",
  Rock = "Rock",
  Electric = "Electric",
  Bug = "Bug",
  Normal = "Normal",
  Fighting = "Fighting",
  Fairy = "Fairy",
  Ghost = "Ghost",
  Dark = "Dark",
  Steel = "Steel",
  Dragon = "Dragon",
}

@Entity()
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column('text')
  num: string;

  @Column('text')
  name: string;

  @Column('text')
  img: string;

  @Column({
    type: "simple-enum",// "enum",
    array: true,
    enum: Weakness,
    default: [],
  })
  type: Weakness[];

  @Column('float')
  height_m: number;

  @Column('float')
  weight_kg: number;

  @Column('text')
  candy: string;

  @Column('integer', { default: 0 })
  candy_count: number;

  @Column('text')
  egg: string;

  @Column('float')
  spawn_chance: number;

  @Column('float')
  avg_spawns: number;

  @Column('integer', { nullable: true })
  spawn_time_h: number;

  @Column('integer', { nullable: true })
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
  @ManyToMany(type => Pokemon, p => p.num)
  @JoinTable()
  prev_evolution: Pokemon[];

  @ApiHideProperty()
  @ManyToMany(type => Pokemon, p => p.num)
  @JoinTable()
  next_evolution: Pokemon[];

}

export class PokemonInput extends OmitType(Pokemon, ["prev_evolution", "next_evolution"] as const) {
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

type SortProperty =
  ("height_m"
  | "weight_kg"
  | "candy_count"
  | "spawn_chance"
  | "avg_spawns"
  | "spawn_time_h"
  | "spawn_time_m"
);

export class PokemonQuery {
  @Transform(singleItemToArray)
  type?: Weakness[];
  name?: string;
  sort?: SortProperty | SortProperty[];
}

function singleItemToArray ({key, value}: TransformFnParams) {
  return Array.isArray(value) ? value : [value];
}
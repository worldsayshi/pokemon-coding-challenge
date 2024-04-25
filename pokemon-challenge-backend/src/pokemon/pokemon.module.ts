import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Pokemon]),],
    controllers: [PokemonController],
    providers: [PokemonService],
})
export class PokemonModule {}

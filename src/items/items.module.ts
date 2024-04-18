import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { ConfigModule } from '@nestjs/config';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Item])],
  providers: [ItemsResolver, ItemsService],
  exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}

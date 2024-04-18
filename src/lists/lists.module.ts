import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListitemModule } from 'src/listitem/listitem.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([List]), ListitemModule],
  providers: [ListsResolver, ListsService],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}

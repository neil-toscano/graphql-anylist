import { Module } from '@nestjs/common';
import { ListitemService } from './listitem.service';
import { ListitemResolver } from './listitem.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listitem } from './entities/listitem.entity';

@Module({
  imports: [TypeOrmModule, TypeOrmModule.forFeature([Listitem])],
  providers: [ListitemResolver, ListitemService],
  exports: [TypeOrmModule, ListitemService],
})
export class ListitemModule {}

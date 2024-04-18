import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ListitemModule } from 'src/listitem/listitem.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListitemModule,
    ListsModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}

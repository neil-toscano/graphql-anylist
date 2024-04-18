import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Resolver(() => Item)
@UseGuards(GqlAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    console.log(user);
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'getAllItems' })
  async findAll(
    @CurrentUser() currentUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    console.log({ searchArgs });
    return this.itemsService.findAll(currentUser, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.findOne(id, currentUser);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.update(
      updateItemInput.id,
      updateItemInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  async removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<string> {
    return this.itemsService.remove(id, currentUser);
  }
}

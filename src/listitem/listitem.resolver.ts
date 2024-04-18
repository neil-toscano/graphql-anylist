import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListitemService } from './listitem.service';
import { Listitem } from './entities/listitem.entity';
import { CreateListitemInput } from './dto/create-listitem.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UpdateListitemInput } from './dto/update-listitem.input';

@Resolver(() => Listitem)
@UseGuards(GqlAuthGuard)
export class ListitemResolver {
  constructor(private readonly listitemService: ListitemService) {}

  @Mutation(() => Listitem, { name: 'createListItem' })
  createListitem(
    @Args('createListitemInput') createListitemInput: CreateListitemInput,
  ): Promise<Listitem> {
    return this.listitemService.create(createListitemInput);
  }

  // @Query(() => [Listitem], { name: 'listitem' })
  // findAll() {
  //   return this.listitemService.findAll();
  // }

  @Query(() => Listitem, { name: 'listitem' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<Listitem> {
    return this.listitemService.findOne(id);
  }

  @Mutation(() => Listitem, { name: 'updateListItem' })
  async updateListitem(
    @Args('updateListitemInput') updateListitemInput: UpdateListitemInput,
  ): Promise<Listitem> {
    return this.listitemService.update(
      updateListitemInput.id,
      updateListitemInput,
    );
  }

  // @Mutation(() => Listitem)
  // removeListitem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listitemService.remove(id);
  // }
}

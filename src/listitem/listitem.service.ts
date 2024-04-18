import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListitemInput } from './dto/create-listitem.input';
import { UpdateListitemInput } from './dto/update-listitem.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Listitem } from './entities/listitem.entity';
import { Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ListitemService {
  constructor(
    @InjectRepository(Listitem)
    private readonly listItemRepository: Repository<Listitem>,
  ) {}

  async create(createListitemInput: CreateListitemInput): Promise<Listitem> {
    const { itemId, listId, ...rest } = createListitemInput;

    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    await this.listItemRepository.save(newListItem);// TODO: revisar
    return this.findOne(newListItem.id);
  }

  findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Listitem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLocaleLowerCase()}%`,
      });
    }
    return queryBuilder.getMany();
  }

  async countItemsByList(list: List): Promise<number> {
    const [, countItems] = await this.listItemRepository.findAndCount({
      where: {
        list: {
          id: list.id,
        },
      },
    });

    return countItems;
  }

  findOne(id: string) {
    const listItem = this.listItemRepository.findOneBy({ id });
    if (!listItem)
      throw new NotFoundException(`list item with id ${id} not found`);
    return listItem;
  }

  async update(
    id: string,
    updateListitemInput: UpdateListitemInput,
  ): Promise<Listitem> {
    const { listId, itemId, ...rest } = updateListitemInput;
    // const listItem = await this.listItemRepository.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId },
    // });
    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listitem`;
  }
}

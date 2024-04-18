import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user });
    return await this.itemRepository.save(newItem);
  }

  async findAll(
    currentUser: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: currentUser.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLocaleLowerCase()}%`,
      });
    }
    return queryBuilder.getMany();

    // return this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: currentUser.id,
    //     },
    //     name: Like(`%${search}%`),
    //   },
    // });
  }

  async findOne(id: string, currentUser: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id: id,
      user: {
        id: currentUser.id,
      },
    });
    if (!item) throw new NotFoundException(`Item with Id ${id} not found`);
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    currentUser: User,
  ): Promise<Item> {
    await this.findOne(id, currentUser);
    const item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with Id ${id} not found`);
    return this.itemRepository.save(item);
  }

  async remove(id: string, currentUser: User): Promise<string> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne(id, currentUser);
    await this.itemRepository.remove(item);
    return `This action removes a #${id} item`;
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}

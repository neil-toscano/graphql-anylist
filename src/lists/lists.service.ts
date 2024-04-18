import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({
      ...createListInput,
      user,
    });
    return await this.listRepository.save(newList);
  }

  async findAll(
    currentUser: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
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
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });

    if (!list) throw new NotFoundException(`Item with Id ${id} not found`);
    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    currentUser: User,
  ): Promise<List> {
    await this.findOne(id, currentUser);
    const list = await this.listRepository.preload(updateListInput);
    if (!list) throw new NotFoundException(`list with Id ${id} not found`);
    return this.listRepository.save(list);
  }

  async remove(id: string, currentUser: User): Promise<string> {
    const item = await this.findOne(id, currentUser);
    await this.listRepository.remove(item);
    return `This action removes a #${id} item`;
  }
}

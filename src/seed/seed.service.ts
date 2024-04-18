import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSeedInput } from './dto/create-seed.input';
import { UpdateSeedInput } from './dto/update-seed.input';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { Listitem } from 'src/listitem/entities/listitem.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListitemService } from 'src/listitem/listitem.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Listitem)
    private readonly listItemRepository: Repository<Listitem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListitemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    await this.deleteDatabase();
    const user = await this.loadUsers();
    await this.loadItems(user);
    const list = await this.loadLists(user);
    const items = await this.itemsService.findAll(
      user,
      { limit: 8, offset: 0 },
      {},
    );

    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase() {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder().delete().where({}).execute(); //hello

    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const items = [];
    for (const item of SEED_ITEMS) {
      items.push(await this.itemsService.create(item, user));
    }
    return;
  }

  async loadListItems(list: List, items: Item[]) {
    for (const item of items) {
      this.listItemsService.create({
        quantity: 12,
        completed: false,
        listId: list.id,
        itemId: item.id,
      });
    }
  }

  create(createSeedInput: CreateSeedInput) {
    return 'This action adds a new seed';
  }

  findAll() {
    return `This action returns all seed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number, updateSeedInput: UpdateSeedInput) {
    return `This action updates a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];
    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }
    return lists[0];
  }
}

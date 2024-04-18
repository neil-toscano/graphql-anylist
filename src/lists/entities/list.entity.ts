import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Listitem } from 'src/listitem/entities/listitem.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => Listitem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [Listitem])
  listItem: Listitem[];
}

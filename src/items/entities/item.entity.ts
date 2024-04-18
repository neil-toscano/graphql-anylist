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

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true }) // para Graphql
  quantityUnits?: string;
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => Listitem, (lisitem) => lisitem.item, { lazy: true })
  @Field(() => [Listitem])
  listItem: Listitem[];
}

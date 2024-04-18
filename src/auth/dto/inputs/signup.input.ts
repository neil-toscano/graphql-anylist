import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class SignupInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  fullName: string;

  @Field(() => String, { nullable: true })
  @MinLength(6)
  password: string;
}

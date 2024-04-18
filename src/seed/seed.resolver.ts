import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SeedService } from './seed.service';
import { Seed } from './entities/seed.entity';
import { CreateSeedInput } from './dto/create-seed.input';
import { UpdateSeedInput } from './dto/update-seed.input';

@Resolver(() => Seed)
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'executeSeed' })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }

  @Mutation(() => Seed)
  createSeed(@Args('createSeedInput') createSeedInput: CreateSeedInput) {
    return this.seedService.create(createSeedInput);
  }

  @Query(() => [Seed], { name: 'seed' })
  findAll() {
    return this.seedService.findAll();
  }

  @Query(() => Seed, { name: 'seed' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.seedService.findOne(id);
  }

  @Mutation(() => Seed)
  updateSeed(@Args('updateSeedInput') updateSeedInput: UpdateSeedInput) {
    return this.seedService.update(updateSeedInput.id, updateSeedInput);
  }

  @Mutation(() => Seed)
  removeSeed(@Args('id', { type: () => Int }) id: number) {
    return this.seedService.remove(id);
  }
}

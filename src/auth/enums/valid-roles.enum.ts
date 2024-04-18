import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  sperUser = 'superUser',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'lorem ipsum dolorei',
});

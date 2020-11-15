import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './../entity/User';

import { v4 } from 'uuid';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[] | undefined> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id', () => String) id: string): Promise<User | undefined> {
    return User.findOne(id);
  }

  @Mutation(() => User)
  async createUser(
    @Arg('email', () => String) username: string,
    @Arg('username', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<User> {
    return User.create({
      id: v4() as string,
      email,
      password,
      username,
    }).save();
  }
}

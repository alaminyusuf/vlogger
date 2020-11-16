import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './../entity/User';
import argon2 from 'argon2';

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
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    return User.create({
      id: v4() as string,
      username,
      email,
      password: hashedPassword,
    }).save();
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('username', () => String, { nullable: true }) username: string,
    @Arg('email', () => String, { nullable: true }) email: string,
    @Arg('password', () => String, { nullable: true }) password: string
  ): Promise<User | undefined> {
    const user = await User.findOne(id);

    if (!user) return undefined;

    if (typeof username !== 'undefined') {
      user.username = username;
      await User.update({ id }, { username });
    }

    if (typeof password !== 'undefined') {
      user.password = password;
      await User.update({ id }, { password });
    }

    if (typeof email !== 'undefined') {
      user.email = email;
      await User.update({ id }, { email });
    }

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => String) id: string): Promise<boolean> {
    await User.delete(id);
    return true;
  }
}

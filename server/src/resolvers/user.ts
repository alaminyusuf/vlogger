import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  Int,
} from 'type-graphql';
import { User } from './../entity/User';
import argon2 from 'argon2';

@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[] | undefined> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async user(
    @Arg('username', () => String) username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }

  @Mutation(() => User)
  async register(
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    return User.create({
      username,
      email,
      password: hashedPassword,
    }).save();
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => Int) id: number,
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

  @Mutation(() => UserResponse)
  async login(
    @Arg('username', () => String) username: string,
    @Arg('password', () => String) password: string
  ): Promise<UserResponse | undefined> {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return {
        errors: [
          {
            field: 'user',
            message: 'user does not exits',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password mismatch',
          },
        ],
      };
    }
    return {
      user,
    };
  }
}

import { validationUtil } from './../utils/validationUtil';
import { MyContext } from './../types';
import { User } from './../entity/User';
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';
import { InputOptions } from './InputOptions';
import { v4 } from 'uuid';
import { sendEmail } from '../utils/emailUtil';
import { getConnection } from 'typeorm';

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

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return '';
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token', () => String) token: string,
    @Arg('newPassword', () => String) newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: 'New password',
            message: 'password must at least be 6',
          },
        ],
      };
    }
    const userId = await redis.get(`FORGET_PASSWORD${token}`);

    if (!userId) {
      return {
        errors: [
          {
            field: 'New Password',
            message: 'Token no longer exits',
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }

    await User.update(
      {
        id: userIdNum,
      },
      {
        password: await argon2.hash(newPassword),
      }
    );
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg('email', () => String) email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();

    await sendEmail(
      email,
      `<a href="http:localhost:3000/change-password/${token}">reset password</a>`
    );
    redis.set(`FORGET_PASSWORD${token}`, user.id, 'ex', 1000 * 60 * 60 * 30);
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null;

    const user = await User.findOne({ where: { id: req.session.userId } });

    return user;
  }

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

  @Mutation(() => UserResponse)
  async register(
    @Arg('options', () => InputOptions) options: InputOptions,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user;
    const errors = validationUtil(options);

    if (errors) return { errors };

    const hashedPassword = await argon2.hash(options.password);
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning('*')
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code == '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username or email already taken',
            },
          ],
        };
      }
    }

    req.session.userId = user.id;
    return { user };
  }

  // @Mutation(() => User)
  // async updateUser(
  //   @Arg('id', () => Int) id: number,
  //   @Arg('username', () => String, { nullable: true }) username: string,
  //   @Arg('email', () => String, { nullable: true }) email: string,
  //   @Arg('password', () => String, { nullable: true }) password: string
  // ): Promise<User | undefined> {
  //   const user = await User.findOne(id);

  //   if (!user) return undefined;

  //   if (typeof username !== 'undefined') {
  //     user.username = username;
  //     await User.update({ id }, { username });
  //   }

  //   if (typeof password !== 'undefined') {
  //     user.password = password;
  //     const hashedPassword = await argon2.hash(password);
  //     await User.update({ id }, { password: hashedPassword });
  //   }

  //   if (typeof email !== 'undefined') {
  //     user.email = email;
  //     await User.update({ id }, { email });
  //   }

  //   return user;
  // }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => String) id: string): Promise<boolean> {
    await User.delete(id);
    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail', () => String) usernameOrEmail: string,
    @Arg('password', () => String) password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

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

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    res.clearCookie('vlogger');
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

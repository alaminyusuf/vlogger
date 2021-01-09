import { isAuth } from './../middleware/isAuth';
import { MyContext } from './../types';
import {
  Arg,
  ObjectType,
  Query,
  InputType,
  Field,
  Mutation,
  Ctx,
  UseMiddleware,
  Int,
} from 'type-graphql';
import { Post } from '../entity/Post';
import { getConnection } from 'typeorm';

@InputType()
class PostInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  title: string;
}

@ObjectType()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[] | undefined> {
    const realLimmit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('posts')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimmit);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('title', () => String) title: string
  ): Promise<Post | undefined> {
    return await Post.findOne({ where: { title } });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('options', () => PostInput) options: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return await Post.create({
      ...options,
      authorId: req.session.userId,
    }).save();
  }
}

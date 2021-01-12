import { isAuth } from './../middleware/isAuth';
import { MyContext } from './../types';
import {
  Arg,
  Query,
  InputType,
  Field,
  Mutation,
  Ctx,
  UseMiddleware,
  Int,
  Resolver,
  FieldResolver,
  Root,
  ObjectType,
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
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.content.slice(0, 65);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimmit = Math.min(50, limit);
    const realLimmitPusOne = Math.min(50, limit) + 1;
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('posts')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimmitPusOne);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }

    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimmit),
      hasMore: posts.length === realLimmitPusOne,
    };
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

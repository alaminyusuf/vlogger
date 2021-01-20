import { Updoot } from './../entity/Updoot';
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
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const val = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    await Updoot.insert({
      postId,
      userId,
      value: val,
    });
    await getConnection().query(
      `
      START TRANSACTION;
      
      update post
      set points = points + ${val}
      where id = ${postId};

      COMMIT;
    `
    );
    return true;
  }

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

    const replacements: any[] = [realLimmitPusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
      select p.*, 
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) author
      from post p
      inner join public.user u on u.id = p."authorId"
      ${cursor ? `where('post."createdAt" < $2` : ''}
      order by p."createdAt"
      limit $1
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimmit),
      hasMore: posts.length === realLimmitPusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
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

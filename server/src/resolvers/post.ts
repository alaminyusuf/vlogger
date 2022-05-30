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
  // @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  // async vote(
  // 	@Arg('postId', () => Int) postId: number,
  // 	@Arg('value', () => Int) value: number,
  // 	@Ctx() { req }: MyContext
  // ) {
  // 	const isUpdoot = value !== -1;
  // 	const val = isUpdoot ? 1 : -1;
  // 	const { userId } = req.session;

  // 	const updoot = await Updoot.findOne({ where: { postId, userId } });

  // 	if (updoot && updoot.value !== val) {
  // 		await getConnection().transaction(async (tm) => {
  // 			await tm.query(
  // 				`
  //        update updoot
  //        set value = $1
  //        where "postId" = $2 and "userId" = $3
  //      `,
  // 				[val, postId, userId]
  // 			);

  // 			await tm.query(
  // 				`
  //      update post
  //      set points = points + $1
  //      where id = $2
  //      `,
  // 				[val, postId]
  // 			);
  // 		});
  // 	} else if (!updoot) {
  // 		await getConnection().transaction(async (tm) => {
  // 			await tm.query(
  // 				`
  //      insert into updoot ("userId", "postId", "value")
  //      values ($1,$2,$3)
  //      `,
  // 				[userId, postId, val]
  // 			);
  // 			await tm.query(
  // 				`
  //      update post
  //      set points = points + $1
  //      where id = $2
  //      `,
  // 				[val, postId]
  // 			);
  // 		});
  // 	}
  // 	return true;
  // }

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.content.slice(0, 65);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimmit: number = Math.min(10, limit);

    let posts;
    let params: any[] = [realLimmit];

    if (cursor) {
      const parsedCursor = new Date(parseInt(cursor));
      params.push(parsedCursor);
      posts = await getConnection().query(
        `
		 	SELECT * FROM post
			 WHERE post."createdAt" < $2
			 limit $1
		 `,
        params
      );
    } else {
      posts = await Post.find({
        order: { createdAt: 'DESC' },
        take: realLimmit,
      });
    }

    console.log(realLimmit, posts.length);

    return {
      posts,
      hasMore: posts.length > realLimmit,
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async like(
    @Arg('postId', () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const post = await Updoot.findOne({ where: { postId, userId } });
    if (post) {
      if (post.value === false) {
        const val = true;
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
				       update updoot
				       set value = $1
				       where "postId" = $2 and "userId" = $3
				     `,
            [val, postId, userId]
          );
        });
        console.log('adding vote');
      } else if (post.value === true) {
        const val = false;
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
				    update updoot
				    set value = $1
				    where "postId" = $2 and "userId" = $3
				  `,
            [val, postId, userId]
          );
        });
        console.log('subtracting vote');
      }
    }
    return post?.value;
  }
}

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
		@Arg('cursor', () => String, { nullable: true }) cursor: string | null,
		@Ctx() { req }: MyContext
	): Promise<PaginatedPosts> {
		const realLimmit = Math.min(20, limit);
		const realLimmitPusOne = Math.min(20, limit) + 1;

		const replacements: any[] = [
			realLimmitPusOne,
			req.session.userId as number,
		];

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
        ) author,
        ${
					req.session.userId
						? '(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"'
						: ''
				}
      from post p
      inner join public.user u on u.id = p."authorId"
      ${cursor ? `where(post."createdAt" < $3` : ''}
      order by p."createdAt" DESC
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

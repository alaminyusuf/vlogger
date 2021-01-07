import { MyContext } from './../types';
import {
  Arg,
  ObjectType,
  Query,
  InputType,
  Field,
  Mutation,
  Ctx,
} from 'type-graphql';
import { Post } from '../entity/Post';

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
  async posts(): Promise<Post[] | undefined> {
    return await Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('title', () => String) title: string
  ): Promise<Post | undefined> {
    return await Post.findOne({ where: { title } });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('options', () => PostInput) options: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    if (!req.session.userId) {
      throw new Error('Not authenticated!!');
    }

    return await Post.create({
      ...options,
      authorId: req.session.userId,
    }).save();
  }
}

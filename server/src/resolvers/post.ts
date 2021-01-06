import { Arg, ObjectType, Query } from 'type-graphql';
import { Post } from '../entity/Post';

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

  //   @Mutation(() => Post)
  //   add(
  //     @Arg('author', () => String) author: string,
  //     @Arg('content', () => String) content: string,
  //     @Arg('title', () => String) title: string
  //   ): Promise<Post> {
  //     const post = Post.create({
  //       author,
  //       content,
  //       title,
  //     }).save();
  //     return post;
  //   }
}

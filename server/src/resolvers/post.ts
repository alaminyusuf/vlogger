import { Arg, ObjectType, Query } from 'type-graphql';
import { Post } from '../entity/Post';

@ObjectType()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[] | undefined> {
    return await Post.find();
  }

  @Query(() => Post)
  post(@Arg('title', () => String) title: string): Promise<Post | undefined> {
    return Post.findOne({ where: { title } });
  }
}

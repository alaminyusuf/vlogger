import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { LiveStream } from '../entity/LiveStream';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import { logger } from '../utils/Logger';

@InputType()
class LiveStreamInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;
}

@ObjectType()
class LiveStreamResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => LiveStream, { nullable: true })
  liveStream?: LiveStream;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@Resolver(LiveStream)
export class LiveStreamResolver {
  @Query(() => [LiveStream])
  async liveStreams(): Promise<LiveStream[]> {
    return LiveStream.find({ where: { isActive: true }, relations: ['creator'] });
  }

  @Query(() => LiveStream, { nullable: true })
  async liveStream(@Arg('id', () => Int) id: number): Promise<LiveStream | undefined> {
    return LiveStream.findOne(id, { relations: ['creator'] });
  }

  @Mutation(() => LiveStreamResponse)
  @UseMiddleware(isAuth)
  async createLiveStream(
    @Arg('options') options: LiveStreamInput,
    @Ctx() { req }: MyContext
  ): Promise<LiveStreamResponse> {
    try {
      const liveStream = await LiveStream.create({
        ...options,
        creatorId: req.session.userId,
      }).save();
      logger.info(`Live stream created: ${liveStream.id} by user ${req.session.userId}`);
      return { liveStream };
    } catch (err) {
      logger.error('Failed to create live stream', err);
      return {
        errors: [
          {
            field: 'liveStream',
            message: 'Internal server error',
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async endLiveStream(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const liveStream = await LiveStream.findOne(id);
    if (!liveStream || liveStream.creatorId !== req.session.userId) {
      return false;
    }
    await LiveStream.update({ id }, { isActive: false });
    logger.info(`Live stream ended: ${id}`);
    return true;
  }
}

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

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

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

import { v4 } from 'uuid';

/**
 * Resolver for LiveStream related operations.
 */
@Resolver(LiveStream)
export class LiveStreamResolver {
  /**
   * Fetches active live streams with pagination.
   */
  @Query(() => [LiveStream])
  async liveStreams(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('offset', () => Int, { defaultValue: 0 }) offset: number
  ): Promise<LiveStream[]> {
    return LiveStream.find({
      where: { status: 'live' },
      relations: ['creator'],
      take: Math.min(limit, 50),
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  @Query(() => LiveStream, { nullable: true })
  async liveStream(@Arg('id', () => Int) id: number): Promise<LiveStream | null> {
    return LiveStream.findOne({ where: { id }, relations: ['creator'] });
  }

  @Mutation(() => LiveStreamResponse)
  @UseMiddleware(isAuth)
  async createLiveStream(
    @Arg('options') options: LiveStreamInput,
    @Ctx() { req }: MyContext
  ): Promise<LiveStreamResponse> {
    try {
      const streamKey = `live_${v4().replace(/-/g, '')}`;
      const liveStream = await LiveStream.create({
        ...options,
        creatorId: req.session.userId,
        streamKey,
        status: 'live',
        isActive: true,
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
    const liveStream = await LiveStream.findOne({ where: { id } });
    if (!liveStream || liveStream.creatorId !== req.session.userId) {
      return false;
    }
    await LiveStream.update({ id }, { status: 'ended', isActive: false });
    logger.info(`Live stream ended: ${id}`);
    return true;
  }
}

import 'reflect-metadata';
import { PostResolver } from './resolvers/post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';

import { MyContext } from './types';

// Resolvers
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';
import { LiveStreamResolver } from './resolvers/liveStream';

import connectRedis from 'connect-redis';
import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import { logger } from './utils/Logger';
import { formatError } from './utils/ErrorHandler';

const main = async () => {
  const app = express();

  let retries = 5;
  while (retries) {
    try {
      await createConnection();
      logger.info('Database connected successfully');
      break;
    } catch (e) {
      logger.error('Database connection failed', e);
      retries -= 1;
      logger.info(`Retries left: ${retries}`);
      if (retries === 0) {
        logger.error('Could not connect to database, exiting...');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  //   const conn = getConnection();

  //   await conn.relationLoader;

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis({
    host: 'redis-service',
    port: 6379,
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: false,
      },
      secret: 'some secrect',
      resave: false,
      name: 'vlogger',
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver, LiveStreamResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
    formatError,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => logger.info('Server is running on PORT 4000'));
};

main();

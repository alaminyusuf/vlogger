import 'reflect-metadata';
import { PostResolver } from './resolvers/post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnection } from 'typeorm';
import cors from 'cors';

import { MyContext } from './types';

// Resolvers
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';

import connectRedis from 'connect-redis';
import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';

const main = async () => {
  const app = express();

  let retries = 5;
  try {
    while (retries) {
      await createConnection();
      break;
    }
  } catch (e) {
    console.log(e);
    retries -= 1;
    console.log(`retries left: ${retries}`);
    await new Promise((res) => setTimeout(res, 4000));
  }

  const conn = getConnection();

  await conn.runMigrations();

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
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.info('Server is running on PORT 4000'));
};

main();

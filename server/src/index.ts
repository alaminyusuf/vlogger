import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';
// import cors from 'cors';
import express from 'express';
import { v4 } from 'uuid';

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
  });

  // app.use(
  //   cors({
  //     origin: (origin, cb) => cb(null, true),
  //     credentials: true,
  //   })
  // );

  apolloServer.applyMiddleware({ app });
  const id = v4();
  console.log(id);

  app.listen(4000, () => console.info('Server is running on PORT 4000'));
};

main();

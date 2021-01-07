import Head from 'next/head';
import { withUrqlClient } from 'next-urql';

import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Head>
        <html lang='en' />
        <title>Home</title>
      </Head>
      <Layout>
        {!data ? (
          <div>Loading...</div>
        ) : (
          data.posts.map((post) => {
            return (
              <ul key={post.id}>
                <li>{post.content}</li>
              </ul>
            );
          })
        )}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

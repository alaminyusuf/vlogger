import Head from 'next/head';
import { withUrqlClient } from 'next-urql';
import { Link } from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Head>
        <html lang='en' />
        <title>Home</title>
      </Head>
      <Layout>
        <Link>
          <NextLink href='create-post'>Create Post</NextLink>
        </Link>
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

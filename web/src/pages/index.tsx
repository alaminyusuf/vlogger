import Head from 'next/head';
import { withUrqlClient } from 'next-urql';
import { Link, Stack, Box, Heading, Text } from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

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
          <Stack spacing={8}>
            {data.posts.map((post) => (
              <Box key={post.id} p={5} shadow='md' borderWidth='1px'>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

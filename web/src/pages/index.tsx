import Head from 'next/head';
import { withUrqlClient } from 'next-urql';

import Navbar from '../components/Navbar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Head>
        <html lang='en' />
        <title>Home</title>
      </Head>
      <Navbar />
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
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

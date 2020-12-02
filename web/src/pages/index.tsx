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
          return <div key={post.id}>{post.title}</div>;
        })
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

import Head from 'next/head';

import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <>
      <Head>
        <html lang='en' />
        <title>Home</title>
      </Head>
      <Navbar />
      <div>Hey</div>
    </>
  );
};

export default Index;

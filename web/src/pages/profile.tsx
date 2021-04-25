import { createUrqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import { Layout } from '../components/Layout';
import { useMeQuery } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { Flex, Heading, Link } from '@chakra-ui/react';
import { useIsAuth } from '../utils/useIsAuth';
import Head from 'next/head';

const profilePage = () => {
	useIsAuth();
	const [{ data }] = useMeQuery({
		pause: isServer(),
	});

	return (
		<>
			<Head>
				<html lang='en' />
				<title>Profile</title>
			</Head>
			<Layout>
				<Heading textTransform='capitalize' fontWeight='400'>
					{data?.me?.username}
				</Heading>
				<Flex>
					<Heading fontSize={18} my={4} fontWeight='400'>
						Posts
					</Heading>
					<Link href='create-post' ml='auto' my={4} fontSize={14}>
						Create Post
					</Link>
				</Flex>
			</Layout>
		</>
	);
};

export default withUrqlClient(createUrqlClient)(profilePage);

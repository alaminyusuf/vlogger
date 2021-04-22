import React from 'react';
import Head from 'next/head';
import { withUrqlClient } from 'next-urql';
import {
	Link,
	Stack,
	Box,
	Heading,
	Text,
	Flex,
	Button,
} from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { PostsQuery, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

import NextLink from 'next/link';
import UpdootComponent from '../components/Updoot';

const Index = () => {
	const [variables, setVariables] = React.useState({
		limit: 15,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});

	if (!fetching && !data) {
		return <div>Sorry, failed to load data</div>;
	}

	return (
		<>
			<Head>
				<html lang='en' />
				<title>Home</title>
			</Head>
			<Layout>
				<Flex>
					<Heading>Fashionista</Heading>
					<Link ml='auto'>
						<NextLink href='create-post'>Create Post</NextLink>
					</Link>
				</Flex>
				{!data && fetching ? (
					<div>Loading...</div>
				) : (
					<Stack spacing={8}>
						{data!.posts.posts.map((post) => (
							<Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
								<UpdootComponent post={post} />
								<Box>
									<Heading fontSize='xl'>{post.title}</Heading>
									<Text>posted by {post.author.username}</Text>
									<Text mt={4}>{post.textSnippet}</Text>
								</Box>
							</Flex>
						))}
					</Stack>
				)}
				{data && data.posts.posts.length > variables.limit ? (
					<Flex>
						{console.log(variables.limit)}
						<Button
							onClick={() =>
								setVariables({
									limit: variables.limit,
									cursor:
										data.posts.posts[data.posts.posts.length - 1].createdAt,
								})
							}
							m='auto'
							my={8}
						>
							Load More
						</Button>
					</Flex>
				) : null}
			</Layout>
		</>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

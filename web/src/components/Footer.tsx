import { Flex, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { usePostsQuery } from '../generated/graphql';
const Footer = () => {
	const router = useRouter();
	const variables = {
		limit: 15,
		cursor: null as null | string,
	};
	const [{ data }] = usePostsQuery({
		variables,
	});
	let body = null;

	if (router.pathname !== '/' && data!.posts.posts.length <= 2) {
		body = (
			<Flex
				justifyContent='space-evenly'
				py={5}
				bgColor='tan'
				mt={5}
				position='fixed'
				w='100%'
				bottom={0}
			>
				<Box>Fashionista</Box>
				&copy;2021
			</Flex>
		);
	} else {
		body = (
			<Flex
				justifyContent='space-evenly'
				py={5}
				bgColor='tan'
				mt={5}
				position='sticky'
				w='100%'
			>
				<Box>Fashionista</Box>
				&copy;2021
			</Flex>
		);
	}

	return <footer>{body}</footer>;
};

export default Footer;

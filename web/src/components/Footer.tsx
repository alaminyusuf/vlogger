import { Flex, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
const Footer = () => {
	const router = useRouter();
	let body = null;

	if (router.pathname === '/') {
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
	} else {
		body = (
			<Flex
				justifyContent='space-evenly'
				py={5}
				bgColor='tan'
				mt={5}
				bottom={0}
				position='fixed'
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

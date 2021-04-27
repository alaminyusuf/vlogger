import { Flex, Box } from '@chakra-ui/react';
const Footer = () => {
	return (
		<footer>
			<Flex
				justifyContent='space-evenly'
				py={5}
				bgColor='tan'
				mt={5}
				bottom={0}
			>
				<Box>Fashionista</Box>
				&copy;2021
			</Flex>
		</footer>
	);
};

export default Footer;

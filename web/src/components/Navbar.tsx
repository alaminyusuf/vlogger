import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';

interface navbarProp {}

const Navbar: React.FC<navbarProp> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	const router = useRouter();

	let body = null;

	if (fetching) {
		//
	} else if (!data?.me) {
		body = (
			<>
				<Link href='login' mr={2}>
					Login
				</Link>

				<Link href='register' mr={2}>
					Register
				</Link>
			</>
		);
	} else if (router.pathname === '/profile') {
		body = (
			<Flex mr={5}>
				<Button
					variant='link'
					onClick={() => logout()}
					isLoading={logoutFetching}
				>
					LogOut
				</Button>
			</Flex>
		);
	} else {
		body = (
			<Flex mr={2}>
				<Link href='profile'>
					<Box mr={2}>{data.me.username}</Box>
				</Link>
				<Button
					variant='link'
					onClick={() => logout()}
					isLoading={logoutFetching}
				>
					LogOut
				</Button>
			</Flex>
		);
	}
	return (
		<Flex bg='tan' py={5}>
			<Box ml='auto'>{body}</Box>
		</Flex>
	);
};

export default Navbar;

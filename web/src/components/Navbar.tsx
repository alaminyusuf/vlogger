import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@chakra-ui/icons';

interface navbarProp {}

const Navbar: React.FC<navbarProp> = ({}) => {
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	const router = useRouter();
	const goBack = () => router.back();

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
	} else if (
		router.pathname === '/profile' ||
		router.pathname === '/create-post'
	) {
		body = (
			<Flex justifyContent='space-between'>
				<Button variant='link' onClick={goBack} fontSize={20} ml={2}>
					<ChevronLeftIcon />
				</Button>
				<Button
					variant='link'
					onClick={() => logout()}
					isLoading={logoutFetching}
					mr={5}
				>
					LogOut
				</Button>
			</Flex>
		);
	} else {
		body = (
			<Box>
				<Flex mr={2} ml='auto' w='auto'>
					<Link href='profile' mr={2}>
						{data.me.username}
					</Link>
					<Button
						variant='link'
						onClick={() => logout()}
						isLoading={logoutFetching}
					>
						LogOut
					</Button>
				</Flex>
			</Box>
		);
	}
	return (
		<Flex bg='tan' py={5}>
			{router.pathname !== '/' ? (
				<Box w='100%'>{body}</Box>
			) : (
				<Box ml='auto'>{body}</Box>
			)}
		</Flex>
	);
};

export default Navbar;

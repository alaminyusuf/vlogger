import { createUrqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import { Layout } from '../components/Layout';
import { useMeQuery } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { Heading } from '@chakra-ui/react';
import { useIsAuth } from '../utils/useIsAuth';

const profilePage = () => {
	useIsAuth();
	const [{ data }] = useMeQuery({
		pause: isServer(),
	});

	return (
		<Layout>
			<Heading textTransform='capitalize' fontWeight='400'>
				{data?.me?.username}
			</Heading>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(profilePage);

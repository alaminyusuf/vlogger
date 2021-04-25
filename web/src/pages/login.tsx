import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Container';
import InputField from '../components/InputField';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { errorMapUtil } from '../utils/errorMapUtil';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Head from 'next/head';

const Login: React.FC = ({}) => {
	const router = useRouter();
	const [, login] = useLoginMutation();

	return (
		<>
			<Head>
				<html lang='en' />
				<title>Login</title>
			</Head>
			<Wrapper variant='small'>
				<Formik
					initialValues={{ usernameOrEmail: '', password: '' }}
					onSubmit={async ({ usernameOrEmail, password }, { setErrors }) => {
						const response = await login({ usernameOrEmail, password });
						if (response.data?.login.errors) {
							setErrors(errorMapUtil(response.data.login.errors));
						} else if (response.data?.login.user) {
							if (typeof router.query.next === 'string') {
								router.push(router.query.next);
							} else {
								router.push('/');
							}
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='usernameOrEmail'
								label='Username or Email'
								placeholder='username or email'
							/>
							<Box mt={4}>
								<InputField
									name='password'
									label='Password'
									placeholder='password'
									type='password'
								/>
							</Box>
							<Flex mt={4}>
								<Box ml={'auto'}>
									<Link href='forgetPassword'>forget password</Link>
								</Box>
							</Flex>
							<Button
								type='submit'
								mt={4}
								isLoading={isSubmitting}
								colorScheme='teal'
							>
								Login
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</>
	);
};

export default withUrqlClient(createUrqlClient)(Login);

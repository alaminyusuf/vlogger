import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Container';
import InputField from '../components/InputField';
import { useRouter } from 'next/router';
import { useRegisterMutation } from '../generated/graphql';
import { errorMapUtil } from '../utils/errorMapUtil';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Head from 'next/head';

const Register = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation();

	return (
		<>
			<Head>
				<html lang='en' />
				<title>Register</title>
			</Head>
			<Wrapper variant='small'>
				<Formik
					initialValues={{ username: '', email: '', password: '' }}
					onSubmit={async (values, { setErrors }) => {
						const respone = await register(values);
						if (respone.data?.register.errors) {
							setErrors(errorMapUtil(respone.data.register.errors));
						} else if (respone.data?.register.user) {
							router.push('/');
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='username'
								label='Username'
								placeholder='username'
							/>
							<Box mt={4}>
								<InputField
									name='email'
									label='Email'
									placeholder='email'
									type='email'
								/>
							</Box>
							<Box mt={4}>
								<InputField
									name='password'
									label='Password'
									placeholder='password'
									type='password'
								/>
							</Box>

							<Button
								type='submit'
								mt={4}
								isLoading={isSubmitting}
								colorScheme='teal'
							>
								Register
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</>
	);
};

export default withUrqlClient(createUrqlClient)(Register);

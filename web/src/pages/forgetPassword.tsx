import * as React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Container';
import InputField from '../components/InputField';
import { useForgetPasswordMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = React.useState(false);
	const [, forgotPassword] = useForgetPasswordMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async ({ email }) => {
					await forgotPassword({ email });
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box>
							if an account with that email exists, we sent you can email
						</Box>
					) : (
						<Form>
							<InputField
								name='email'
								placeholder='email'
								label='Email'
								type='email'
							/>
							<Button
								mt={4}
								type='submit'
								isLoading={isSubmitting}
								variantColor='teal'
							>
								forgot password
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);

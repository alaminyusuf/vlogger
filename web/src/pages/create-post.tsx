import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost = () => {
	const router = useRouter();
	useIsAuth();
	const [, createPost] = useCreatePostMutation();
	const handleForm = async (values: any) => {
		console.log(values);
		const { error } = await createPost({ options: values });

		if (!error) {
			router.push('/');
		}
	};
	return (
		<Layout variant='small'>
			<Formik initialValues={{ title: '', content: '' }} onSubmit={handleForm}>
				{({ isSubmitting }) => (
					<Form>
						<InputField name='title' label='Title' placeholder='title' />
						<Box mt={4}>
							<InputField
								name='content'
								label='Body'
								placeholder='content...'
								type='text'
								textarea
							/>
						</Box>

						<Button
							type='submit'
							mt={4}
							isLoading={isSubmitting}
							colorScheme='teal'
						>
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);

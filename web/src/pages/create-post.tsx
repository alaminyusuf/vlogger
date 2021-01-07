import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Wrapper from '../components/Container';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ title: '', content: '' }}
        onSubmit={async (values) => {
          await createPost({ options: values });
        }}
      >
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
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);

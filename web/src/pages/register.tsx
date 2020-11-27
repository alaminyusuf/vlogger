import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Container';
import InputField from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      username
      email
    }
  }
}

`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values) => {
          const respone = await register(values);
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
  );
};

export default Register;

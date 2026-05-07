import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, VStack, Heading, Text, Link } from '@chakra-ui/react';
import { Layout } from '../components/Layout';
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
      <Layout variant='small'>
        <Box px={10} py={14} bg="white" shadow="2xl" borderRadius="3xl" mt={10}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={2} color="teal.600">Join Vlogger</Heading>
              <Text color="gray.500">Start your streaming journey today.</Text>
            </Box>

            <Formik
              initialValues={{ username: '', email: '', password: '' }}
              onSubmit={async (values, { setErrors }) => {
                const response = await register({ options: values });
                if (response.data?.register.errors) {
                  setErrors(errorMapUtil(response.data.register.errors));
                } else if (response.data?.register.user) {
                  router.push('/');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <VStack spacing={4}>
                    <InputField
                      name='username'
                      label='Username'
                      placeholder='johndoe'
                    />
                    <InputField
                      name='email'
                      label='Email'
                      placeholder='john@example.com'
                      type='email'
                    />
                    <InputField
                      name='password'
                      label='Password'
                      placeholder='********'
                      type='password'
                    />
                    <Button
                      type='submit'
                      mt={6}
                      isLoading={isSubmitting}
                      colorScheme='teal'
                      size="lg"
                      width="full"
                      borderRadius="xl"
                      boxShadow="0 4px 14px 0 rgba(0, 128, 128, 0.39)"
                      _hover={{
                        boxShadow: "0 6px 20px rgba(0, 128, 128, 0.23)",
                        transform: "translateY(-1px)"
                      }}
                    >
                      Create Account
                    </Button>
                    <Flex pt={4} fontSize="sm" color="gray.600">
                      Already have an account?&nbsp;
                      <Link href="/login" color="teal.600" fontWeight="bold">Sign In</Link>
                    </Flex>
                  </VStack>
                </Form>
              )}
            </Formik>
          </VStack>
        </Box>
      </Layout>
		</>
	);
};

export default withUrqlClient(createUrqlClient)(Register);

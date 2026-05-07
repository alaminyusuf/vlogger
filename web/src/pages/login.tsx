import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link, VStack, Heading, Text } from '@chakra-ui/react';
import { Layout } from '../components/Layout';
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
      <Layout variant='small'>
        <Box px={10} py={14} bg="white" shadow="2xl" borderRadius="3xl" mt={10}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={2} color="teal.600">Welcome Back</Heading>
              <Text color="gray.500">Sign in to manage your live streams.</Text>
            </Box>

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
                  <VStack spacing={4}>
                    <InputField
                      name='usernameOrEmail'
                      label='Username or Email'
                      placeholder='your@email.com'
                    />
                    <Box w="full">
                      <InputField
                        name='password'
                        label='Password'
                        placeholder='********'
                        type='password'
                      />
                      <Flex mt={2} justifyContent="flex-end">
                        <Link href='forgetPassword' color="teal.500" fontSize="sm" fontWeight="semibold">
                          Forgot password?
                        </Link>
                      </Flex>
                    </Box>
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
                      Sign In
                    </Button>
                    <Flex pt={4} fontSize="sm" color="gray.600">
                      Don't have an account?&nbsp;
                      <Link href="/register" color="teal.600" fontWeight="bold">Register now</Link>
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

export default withUrqlClient(createUrqlClient)(Login);

import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { Wrapper } from '../components/Container';
import InputField from '../components/InputField';
import { useRouter } from 'next/router';
import { useCreateLiveStreamMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import Head from 'next/head';

const CreateLiveStream: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [, createLiveStream] = useCreateLiveStreamMutation();

  return (
    <>
      <Head>
        <title>Vlogger | Go Live</title>
      </Head>
      <Layout variant="small">
        <Box px={8} py={12} bg="white" shadow="2xl" borderRadius="2xl" mt={10}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={2} color="teal.600">Start Your Stream</Heading>
              <Text color="gray.500">Reach your audience in real-time with high-quality streaming.</Text>
            </Box>

            <Formik
              initialValues={{ title: '', description: '' }}
              onSubmit={async (values) => {
                const { data, error } = await createLiveStream({ options: values });
                if (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to create live stream. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                } else if (data?.createLiveStream.errors) {
                  // handle field errors if any
                } else if (data?.createLiveStream.liveStream) {
                  toast({
                    title: 'Stream Created!',
                    description: "You're now live (metaphorically). Redirecting to home...",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  router.push('/');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <VStack spacing={5}>
                    <InputField
                      name="title"
                      placeholder="Enter a catchy title for your stream"
                      label="Stream Title"
                    />
                    <InputField
                      textarea
                      name="description"
                      placeholder="What's this stream about?"
                      label="Description (Optional)"
                    />
                    <Button
                      mt={4}
                      type="submit"
                      isLoading={isSubmitting}
                      colorScheme="teal"
                      size="lg"
                      width="full"
                      borderRadius="xl"
                      _hover={{ transform: 'scale(1.02)' }}
                      _active={{ transform: 'scale(0.98)' }}
                    >
                      Go Live Now
                    </Button>
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

export default withUrqlClient(createUrqlClient)(CreateLiveStream);

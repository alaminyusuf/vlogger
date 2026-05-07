import React from 'react';
import Head from 'next/head';
import { withUrqlClient } from 'next-urql';
import { Stack, Box, Heading, Text, Flex, Button } from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useLiveStreamsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data, fetching }] = useLiveStreamsQuery();

  if (!fetching && !data) {
    return <div>Sorry, failed to load data</div>;
  }

  return (
    <>
      <Head>
        <html lang='en' />
        <title>Vlogger | Live Streams</title>
      </Head>
      <Layout>
        <Flex my={5} justifyContent="space-between" alignItems="center">
          <Heading size="lg">Active Live Streams</Heading>
        </Flex>
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={6}>
            {data?.liveStreams.map((stream) => (
              <Flex key={stream.id} p={5} shadow='lg' borderWidth='1px' borderRadius="lg" bg="white" transition="all 0.2s" _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}>
                <Box flex={1}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading fontSize='xl' color="teal.600">{stream.title}</Heading>
                    <Box px={2} py={1} bg="red.500" color="white" borderRadius="md" fontSize="xs" fontWeight="bold">
                      LIVE
                    </Box>
                  </Flex>
                  <Text mt={2} fontSize="sm" color="gray.600">by {stream.creator.username}</Text>
                  <Text mt={4}>{stream.description || 'No description provided.'}</Text>
                  <Flex mt={4} justifyContent="flex-end">
                    <Button size="sm" colorScheme="teal" variant="outline">
                      Watch Stream
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            ))}
            {data?.liveStreams.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">No active live streams at the moment.</Text>
              </Box>
            )}
          </Stack>
        )}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

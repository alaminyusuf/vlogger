import React from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useMeQuery } from '../generated/graphql';

interface navbarProp {}

const Navbar: React.FC<navbarProp> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) {
    //
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='register'>
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex mr={2}>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant='link'>LogOut</Button>
      </Flex>
    );
  }
  return (
    <Flex bg='tan' py={5}>
      <Box ml='auto'>{body}</Box>
    </Flex>
  );
};

export default Navbar;

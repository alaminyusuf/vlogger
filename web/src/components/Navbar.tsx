import React from 'react';
import NextLink from 'next/link';
import { Box, Flex, Link } from '@chakra-ui/react';

interface navbarProp {}

const Navbar: React.FC<navbarProp> = ({}) => {
  return (
    <Flex bg='tomato' py={4}>
      <Box ml='auto'>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='register'>
          <Link mr={2}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};

export default Navbar;

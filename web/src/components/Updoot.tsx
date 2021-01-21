import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { PostFragmentFragment } from '../generated/graphql';

interface upDootComponentProps {
  post: PostFragmentFragment;
}

const UpdootComponent: React.FC<upDootComponentProps> = ({ post }) => {
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton aria-label='updoot post' icon={<ChevronUpIcon />} />
      {post.points}
      <IconButton aria-label='downdoot post' icon={<ChevronDownIcon />} />
    </Flex>
  );
};

export default UpdootComponent;

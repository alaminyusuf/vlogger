import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { PostFragmentFragment, useVoteMutation } from '../generated/graphql';

interface upDootComponentProps {
  post: PostFragmentFragment;
}

const UpdootComponent: React.FC<upDootComponentProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading');
          await vote({
            value: 1,
            postId: post.id,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'updoot-loading'}
        aria-label='updoot post'
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={() => {
          setLoadingState('downdoot-loading');
          vote({
            value: -1,
            postId: post.id,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label='downdoot post'
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

export default UpdootComponent;

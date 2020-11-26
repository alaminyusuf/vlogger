import { Box } from '@chakra-ui/react';
interface WrapperProps {
  variant?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box
      w='90%'
      mt={8}
      mx='auto'
      maxW={variant === 'regular' ? '600px' : '400px'}
    >
      {children}
    </Box>
  );
};

export default Wrapper;

import React from 'react';
import { Wrapper, WrapperVariant } from './Container';
import NavBar from './Navbar';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Wrapper variant={variant}>
      <NavBar />
      {children}
    </Wrapper>
  );
};

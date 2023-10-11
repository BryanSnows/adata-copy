import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { FormGroupProps } from './types';

const containerVariants: Variants = {
  hidden: {
    y: 80,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      type: 'spring',
    },
  },
};

export const Container = styled(motion.div).attrs(() => ({
  variants: containerVariants,
  initial: 'hidden',
  animate: 'visible',
}))<FormGroupProps>`
  width: ${({ isfullwidth }) => (isfullwidth ? 'inherit' : 'none')};

  small {
    color: ${({ theme }) => theme.colors.danger.main};
    font-size: 14px;
    display: block;
    margin: 3px 0px 0px 3px;
  }
`;

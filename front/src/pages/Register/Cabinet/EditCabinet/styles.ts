import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {
    x: -200,
  },
  visible: {
    x: 0,
    transition: {
      duration: 2,
      type: 'spring',
    },
  },
};

export const ContainerEdit = styled(motion.div).attrs(() => ({
  variants: containerVariants,
  initial: 'hidden',
  animate: 'visible',
}))`
  width: 100%;
  max-width: 604px;
  height: 100%;
  max-height: 355px;
  background: #ffffff;
  border-radius: 5px;
  padding: 25px 35px;
  box-shadow: 0px 1px 4px #00000029;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 + form {
    margin-top: 2rem;
  }
  div + div {
    margin-top: 2rem;
  }
`;

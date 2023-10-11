import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';

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
      type: 'ease',
    },
  },
};

export const Header = styled.div`
  background-color: #05328d;
  width: 100%;
  height: 42px;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 4px;
`;

export const ContainerCentral = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  justify-content: space-around;
`;

export const Name = styled.div`
  margin-left: 80px;
  margin-bottom: 85px;
  width: 321px;
  display: flex;
  flex-direction: column;
  padding-right: 2rem;
  h1 {
    font-size: 52px;
    color: #04318d;
  }

  h4 {
    margin-top: 2rem;
    color: #6b6b6b;
  }

  @media (max-width: 1280px) {
    margin-left: 65px;
  }
`;

export const Container = styled(motion.div).attrs(() => ({
  variants: containerVariants,
  initial: 'hidden',
  animate: 'visible',
}))`
  position: absolute;
  width: 100%;
  max-width: 1200px;
  height: 550px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px #00000029;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

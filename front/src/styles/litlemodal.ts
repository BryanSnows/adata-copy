import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {
    x: 0,
    y: 0,
    scale: 0,
  },
  visible: {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      bounce: 0.4,
    },
  },
};

export const Overlay = styled.div`
  z-index: 5;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 18px;
`;

export const ContainerConfirm = styled(motion.div).attrs(() => ({
  variants: containerVariants,
  initial: 'hidden',
  animate: 'visible',
}))`
  background: #fff;
  border-radius: 4px;
  box-shadow: 9px 8px 20px #00000029; //rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 2px 26px;

  text-align: center;

  .text-group {
    margin-bottom: 28px;

    h1 {
      padding-bottom: 25px;
      font-size: 26px;
    }

    p {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .close-icon {
    color: #737373;
    font-size: 1.2rem;
    border: 0;
    background-color: transparent;
    align-self: flex-end;

    border-radius: 50%;
    width: 10%;
    height: 10%;

    transition: background-color 0.2s ease;

    &:hover {
      background-color: #ccc;
    }
  }
`;

export const ContainerLogout = styled(motion.div).attrs(() => ({
  variants: containerVariants,
  initial: 'hidden',
  animate: 'visible',
}))`
  background: #fff;
  border-radius: 4px;
  width: 398px;
  height: 280px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 2px 26px;

  text-align: center;

  .text-group {

    h1 {
      padding-bottom: 22px;
      font-size: 26px;
    }

  }

  .close-icon {
    color: #737373;
    font-size: 1.2rem;
    border: 0;
    background-color: transparent;
    align-self: flex-end;

    border-radius: 50%;
    width: 10%;
    height: 10%;

    transition: background-color 0.2s ease;

    &:hover {
      background-color: #ccc;
    }
  }
`;

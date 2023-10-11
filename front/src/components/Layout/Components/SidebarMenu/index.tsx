import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as ArrowDown } from '../../../../assets/icons/chevron-down.svg';
import { isAllowedTransaction } from '../../../../routes/PrivateRoute';
import { SidebarMenuProps } from '../../types/SidebarMenuProps';
import {
  Box,
  IconBox,
  SubMenuContainer,
  ToggleContainer,
  ToggleItem,
} from './styles';

export function SidebarMenu({
  showAnimation,
  route,
  isOpen,
  setIsOpen,
}: SidebarMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);

  const menuAnimation = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        when: 'afterChildren',
      },
    },
    show: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
      },
    },
  };

  const menuItemAnimation = {
    hidden: (index: number) => ({
      padding: 0,
      x: '-100%',
      transition: {
        duration: (index + 1) * 0.1,
      },
    }),
    show: (index: number) => ({
      x: 0,
      transition: {
        duration: (index + 1) * 0.1,
      },
    }),
  };

  return (
    <>
      <ToggleContainer onClick={toggleMenu}>
        <ToggleItem>
          <IconBox>{route.icon}</IconBox>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="link-text"
                variants={showAnimation}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </ToggleItem>
        {isOpen && (
          <motion.div
            className="icon-arrow"
            animate={
              isMenuOpen
                ? {
                    rotate: 0,
                  }
                : {
                    rotate: -90,
                  }
            }
          >
            <ArrowDown />
          </motion.div>
        )}
      </ToggleContainer>
      <SubMenuContainer>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="menu-container"
              variants={menuAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {route.subRoutes.map((subRoute, index: number) => {
                if (isAllowedTransaction(subRoute.transactions)) {
                  return (
                    <motion.div
                      key={index}
                      variants={menuItemAnimation}
                      custom={index}
                    >
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? 'link active' : 'link'
                        }
                        to={subRoute.path}
                      >
                        <Box>
                          <IconBox>{subRoute.icon}</IconBox>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                className="link-text"
                                variants={showAnimation}
                              >
                                {subRoute.name}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Box>
                      </NavLink>
                    </motion.div>
                  );
                }
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </SubMenuContainer>
    </>
  );
}

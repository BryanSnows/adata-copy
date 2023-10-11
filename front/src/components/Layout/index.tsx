import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactComponent as Pluzze } from '../../assets/icons/dashboard.svg';
import { ReactComponent as Card } from '../../assets/icons/card.svg';
import { ReactComponent as Mst } from '../../assets/icons/chamber.svg';
import { ReactComponent as Productivity } from '../../assets/icons/productivity.svg';
import { ReactComponent as Occupation } from '../../assets/icons/file-check.svg';
import { ReactComponent as Users } from '../../assets/icons/users.svg';
import { ReactComponent as UsersCheck } from '../../assets/icons/user-check.svg';
import { ReactComponent as SNList } from '../../assets/icons/SNList.svg';
import { ReactComponent as Clock } from '../../assets/icons/clock.svg';
import { ReactComponent as Gate } from '../../assets/icons/access.svg';
import { ReactComponent as Register } from '../../assets/icons/register.svg';
import { ReactComponent as RegisterMst } from '../../assets/icons/chamber-reg.svg';
import { ReactComponent as Office } from '../../assets/icons/office.svg';
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Cabinet } from '../../assets/icons/cabinet.svg';
import { ReactComponent as Slots } from '../../assets/icons/slots.svg';
import { ReactComponent as Code } from '../../assets/icons/bar-code.svg';
import { ReactComponent as Serials } from '../../assets/icons/serials.svg';
import { ReactComponent as Scan } from '../../assets/icons/scan.svg';

import { LayoutProps } from './types/LayoutProps';

import {
  Container,
  Header,
  Footer,
  ChildrenContainer,
  Divider,
  IconBox,
  Box,
  UserPhoto,
  UserName,
  BoxLogout,
} from './styles';
import { ReactComponent as Menu } from '../../assets/icons/menu.svg';

import logo from '../../assets/images/bird.png';
import womst from '../../assets/images/womst.png';
import { SidebarMenu } from './Components/SidebarMenu';
import { isAllowedTransaction } from '../../routes/PrivateRoute';
import { useAuthGlobal } from '../../context/AuthProvider/useAuthGlobal';
import { ModalLogout } from '../Modal/ModalLogout';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { DashboardTransactions } from '../../routes/transaction-enums/dashboard.transaction';
import { TravelCardTransactions } from '../../routes/transaction-enums/travel-card.transactions';
import { FpyMstTransactions } from '../../routes/transaction-enums/fpy-chamber.transactions';
import { ProductivityTransactions } from '../../routes/transaction-enums/productivity.transactions';
import { OccupationTransactions } from '../../routes/transaction-enums/occupation.transactions';
import { RegisterTransactions } from '../../routes/transaction-enums/register.transaction';
import { AccessControlTransactions } from '../../routes/transaction-enums/access-control.transaction';
import { SNListTransactions } from '../../routes/transaction-enums/sn-list.transaction copy';
import { useTranslation } from 'react-i18next';
import { SerialTransactions } from '../../routes/transaction-enums/resend-serials.transaction';
import { SlotsDefectTransactions } from '../../routes/transaction-enums/slots-defect.transaction';

export function Layout({ children }: LayoutProps) {
  const { userName, profile } = useAuthGlobal();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { t } = useTranslation();

  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  const routes = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      transactions: [DashboardTransactions.RESOURCE],
      icon: <Pluzze />,
    },
    {
      path: '/travel-card',
      name: 'Travel Card',
      transactions: [TravelCardTransactions.RESOURCE],
      icon: <Card />,
    },
    {
      path: '/fpy-mst',
      name: 'FPY - MST',
      transactions: [FpyMstTransactions.RESOURCE],
      icon: <Mst />,
    },
    {
      path: '/productivity',
      name: `${t('productivity')}`,
      transactions: [ProductivityTransactions.RESOURCE],
      icon: <Productivity />,
    },
    {
      path: '/occupation',
      name: `${t('occupation')}`,
      transactions: [OccupationTransactions.RESOURCE],
      icon: <Occupation />,
    },
    {
      path: '/faulty-slots',
      name: `${t('slots')}`,
      transactions: [SlotsDefectTransactions.RESOURCE],
      icon: <Slots />,
    },
    {
      name: `${t('production-register')}`,
      icon: <Register />,
      transactions: [RegisterTransactions.RESOURCE],
      subRoutes: [
        {
          path: '/register/cabinet',
          name: `${t('cabinet')}`,
          icon: <Cabinet />,
        },

        {
          path: '/register/Mst',
          name: 'MST',
          icon: <RegisterMst />,
        },
        // {
        //   path: '/register/fixtures',
        //   name: 'Fixtures',
        //   icon: <Flixture />,
        // },
      ],
    },
    {
      name: `${t('user-management')}`,
      icon: <UsersCheck />,
      transactions: [AccessControlTransactions.RESOURCE],
      subRoutes: [
        {
          path: '/user-management/users',
          name: `${t('user')}`,
          icon: <Users />,
        },
        {
          path: '/user-management/shift',
          name: `${t('shift')}`,
          icon: <Clock />,
        },
        {
          path: '/user-management/office',
          name: `${t('office')}`,
          icon: <Office />,
        },
      ],
    },
    {
      path: '/snlist',
      name: 'SN List',
      transactions: [SNListTransactions.RESOURCE],
      icon: <SNList />,
    },
    {
      path: '/access-control',
      name: `${t('access-control')}`,
      transactions: [AccessControlTransactions.RESOURCE],
      icon: <Gate />,
    },
    {
      name: `${t('serials')}`,
      icon: <Serials />,
      transactions: [SerialTransactions.RESOURCE],
      subRoutes: [
        {
          path: 'serials/resend-serials',
          name: `${t('resend-serials')}`,
          transactions: [SerialTransactions.RESOURCE],
          icon: <Code />,
        },
        {
          path: 'serials/failure-collection',
          name: `${t('failure-collection')}`,
          transactions: [SerialTransactions.RESOURCE],
          icon: <Scan />,
        },
      ],
    },

    {
      path: '/logout',
      name: `${t('logout')}`,
      icon: <Logout />,
    },
  ];

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
    show: {
      width: 'auto',
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const barsVariants = {
    open: {
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
    closed: {
      transition: { duration: 0.1, ease: 'easeOut' },
    },
  };

  const imgVariants = {
    hidden: {
      x: -100,
    },
    show: {
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  function handleOpenLogoutModal() {
    setIsLogoutModalOpen(true);
  }

  function handleCloseLogoutModal() {
    setIsLogoutModalOpen(false);
  }

  return (
    <>
      <ModalLogout
        isModalActive={isLogoutModalOpen}
        closeModal={handleCloseLogoutModal}
      />
      <Container>
        <motion.div
          className="sidebar"
          animate={{
            width: isOpen ? '300px' : '105px',
            transition: {
              duration: 0.5,
              type: 'spring',
              damping: 13,
            },
          }}
        >
          <Header>
            <motion.div
              className="bars"
              variants={barsVariants}
              animate={isOpen ? 'open' : 'closed'}
            >
              <img src={logo} alt="Logo" onClick={toggleSidebar} />
            </motion.div>
            {isOpen && (
              <motion.div
                className="logo"
                variants={imgVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                <img src={womst} alt="MST" onClick={toggleSidebar} />
                <Menu onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
              </motion.div>
            )}
          </Header>
          <Divider />
          <section>
            {routes.map((route: any, index: number) => {
              if (route.subRoutes && isAllowedTransaction(route.transactions)) {
                return (
                  <SidebarMenu
                    key={index}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    route={route}
                  />
                );
              }
              if (isAllowedTransaction(route.transactions)) {
                return (
                  <>
                    {route.path === '/logout' ? (
                      <BoxLogout>
                        <button
                          key={route.path}
                          className="link"
                          onClick={handleOpenLogoutModal}
                        >
                          <Box>
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
                          </Box>
                        </button>
                      </BoxLogout>
                    ) : (
                      <NavLink
                        key={route.name}
                        className={({ isActive }) =>
                          isActive ? 'link active' : 'link'
                        }
                        to={route.path}
                      >
                        <Box>
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
                        </Box>
                      </NavLink>
                    )}
                  </>
                );
              }
            })}
          </section>
          <Divider />
          <Footer>
            <Box>
              <UserPhoto>
                {userName
                  ? userName.split(' ').length > 1
                    ? userName.split(' ').at(0).substring(0, 1) +
                      userName.split(' ').at(-1).substring(0, 1)
                    : userName?.substring(0, 2)?.toUpperCase()
                  : '---'}
              </UserPhoto>
              <UserName>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="text-name"
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <p>
                        {userName
                          ? userName.split(' ').length > 1
                            ? userName.split(' ').at(0) +
                              ' ' +
                              userName.split(' ').at(-1)
                            : userName.split(' ').at(0)
                          : '------------'}
                      </p>
                      <small>
                        {profile ? t(`${profile}`) : '--------------'}
                      </small>
                    </motion.div>
                  )}
                </AnimatePresence>
              </UserName>
            </Box>
          </Footer>
        </motion.div>

        <motion.div
          animate={{
            width: isOpen ? '93%' : '94%',
          }}
        >
          <div className="translate">
            <LanguageSwitcher />
          </div>
          <ChildrenContainer>
            <div className="children-box">{children}</div>
          </ChildrenContainer>
        </motion.div>
      </Container>
    </>
  );
}

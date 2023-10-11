import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import { ReactComponent as ArrowRight } from '../../assets/icons/chevron-right.svg';
import Link from '@mui/material/Link';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { Container } from './styles';

import { BreadCrumbsProps } from './types';
import { useTranslation } from 'react-i18next';

export function BreadCrumbs({ params }: BreadCrumbsProps) {
  const { t } = useTranslation();
  const routes = [
    {
      path: '/',
      breadcrumb: null,
      children: [
        { path: '/access-control', breadcrumb: `${t('access-control')}` },
        { path: '/occupation', breadcrumb: `${t('occupation')}` },
        { path: '/productivity', breadcrumb: `${t('productivity')}` },
        {
          path: '/faulty-slots',
          breadcrumb: `${t('slots')}`,
          children: [
            {
              path: 'new',
              breadcrumb: `${t('slots-register')}`,
            },
            {
              path: `:id`,
              breadcrumb: `${params}`,
            },
          ],
        },
        {
          path: '/serials',
          breadcrumb: `${t('serials')}`,
          children: [
            {
              path: 'resend-serials',
              breadcrumb: `${t('resend-serials')}`,
            },
            {
              path: `failure-collection`,
              breadcrumb: `${t('failure-serials-collection')}`,
            },
          ],
        },
      ],
    },

    {
      path: '/user-management',
      breadcrumb: `${t('user-management')}`,
      children: [
        {
          path: '/user-management/users',
          breadcrumb: `${t('user')}`,
          children: [
            {
              path: '/user-management/users/new',
              breadcrumb: `${t('user-new')}`,
            },
          ],
        },
        {
          path: '/user-management/shift',
          breadcrumb: `${t('shift')}`,
          children: [
            {
              path: 'new-shift',
              breadcrumb: `${t('shift-new')}`,
            },
          ],
        },
        {
          path: '/user-management/office',
          breadcrumb: `${t('office')}`,
          children: [
            {
              path: 'new-office',
              breadcrumb: `${t('office-new')}`,
            },
          ],
        },
      ],
    },
    {
      path: '/register',
      breadcrumb: `${t('production-register')}`,
      children: [
        {
          path: '/register/cabinet',
          breadcrumb: `${t('cabinet')}`,
          children: [
            {
              path: '/register/cabinet/new',
              breadcrumb: `${t('cabinet-new')}`,
            },
          ],
        },
        {
          path: 'mst',
          breadcrumb: `${t('mst')}`,
          children: [
            {
              path: 'new',
              breadcrumb: `${t('mst-new')}`,
            },
          ],
        },
      ],
    },
  ];

  const breadcrumbs = useBreadcrumbs(routes);

  const isLast = breadcrumbs.length - 1;

  const noClick = 0;

  return (
    <Container>
      <Stack spacing={1}>
        <Breadcrumbs
          separator={<ArrowRight height="16px" color="#616C84" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map(({ match, breadcrumb }, index) => (
            <Link
              key={match.pathname}
              href={match.pathname}
              underline="none"
              aria-current="page"
              fontSize="13px"
              sx={{
                color: index === isLast ? '#262626' : '#616C84',
                fontWeight: index === isLast ? 'bold' : 'regular',
                pointerEvents:
                  index === noClick || index === isLast ? 'none' : 'auto',
              }}
            >
              {breadcrumb}
            </Link>
          ))}
        </Breadcrumbs>
      </Stack>
    </Container>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { Pagination } from '../../../components/Button/Pagination';
import { Search } from '../../../components/Input/Search';
import { Table } from '../../../components/Tables/Table';
import { ITableHeader } from '../../../components/Tables/Table/types';
import { ToggleBox } from '../../../components/ToggleBox';
import { IUser } from '../../../interfaces/IGlobal';
import Api from '../../../services/Api';
import { ActionsTop, Box, Container } from '../../../styles/global';
import { ModalEditUser } from './ModalEdit';
import { ModalResetPass } from './ModalResetPass';

export function Users() {
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const [onOff, setOnOff] = useState(true);
  const [active, setActive] = useState(false);
  const [modalReset, setModalReset] = useState(false);
  const [userId, setUserId] = useState(0);
  const [user, setUser] = useState<IUser>();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery(
    ['user', searchParam, pageParam, onOff, userId],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('search_name', searchParam);
      params.append('limit', '10');
      params.append('orderBy', 'NAME');
      params.append('sort', 'ASC');
      params.append('user_status', String(onOff === true ? 1 : 0));

      return Api.get('user', { params });
    },
    {
      onSuccess: (dataOnSuccess) => {
        const currentPage =
          dataOnSuccess?.data?.meta?.itemCount === 0 &&
          dataOnSuccess?.data?.meta?.currentPage >
            dataOnSuccess?.data?.meta?.totalPages;

        if (currentPage && pageParam !== 1) {
          setPageParam(pageParam - 1);
        }
      },

      keepPreviousData: true,
      staleTime: 2000,
    },
  );

  const tableData = data?.data?.items.map((item: any) => {
    return {
      user_enrollment: item?.user_enrollment,
      user_name: item?.user_name,
      profile_name: item?.profile?.profile_name,
      user_status: item?.user_status,
      user_id: item?.user_id,
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'user_enrollment',
      value: `${t('user-enrollment')}`,
      columnWidth: '25%',
    },

    {
      key: 'user_name',
      value: `${t('user-collaborator')}`,
      leftBody: true,
      leftHeader: true,
    },
    {
      key: 'profile_name',
      value: `${t('user-profile')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  function handleChangeStatus(user: IUser) {
    Api.patch(`user/status/${user.user_enrollment}`)
      .then((res) => {
        toast.success(
          res.data.user_status ? t('user-patch-act') : t('user-patch-des'),
        );
        refetch();
      })
      .catch(() => toast.error(t('user-error-toast')));
  }

  function handleEdit(user: IUser) {
    setUserId(user?.user_id);
    setActive(!active);
  }

  function handleReset(user: IUser) {
    setUser(user);
    setModalReset(!modalReset);
  }

  useEffect(() => {
    const message = error as any;
    toast.error(message?.message);
  }, [error]);

  return (
    <>
      <ModalResetPass
        isModalActive={modalReset}
        handleCancel={() => setModalReset(!modalReset)}
        user={user}
      />
      <ModalEditUser
        isModalActive={active}
        closeModal={() => {
          refetch();
          setActive(!active);
        }}
        keyId={userId}
      />
      <Container>
        <BreadCrumbs />
        <h1>{t('user')}</h1>
        <ActionsTop>
          <Search
            onSearch={(value) => {
              setSearchParam(value);
              setPageParam(1);
            }}
            inputWidth={'256px'}
          />

          <ButtonMain
            width="212px"
            label={t('user-addUser')}
            onClick={() => navigate('/user-management/users/new')}
          />
        </ActionsTop>
        <ToggleBox
          onOff={onOff}
          onChangeInactive={() => {
            setOnOff(false);
            setPageParam(1);
          }}
          onChangeActive={() => {
            setOnOff(true);
            setPageParam(1);
          }}
        />
        <Box>
          <Table
            headers={headers}
            data={tableData}
            enableActions
            onChangeStatus={handleChangeStatus}
            onEdit={handleEdit}
            onResetPassword={handleReset}
            emptyMessage={t('user-empty-message')}
            instruction={t('user-instruction')}
            loading={isLoading}
            currentPage={data?.data.meta.currentPage}
            totalPages={data?.data?.meta.totalPages}
            onPageChanges={(page) => {
              setPageParam(page);
            }}
          />
          {data?.data.items.length > 0 && (
            <Pagination
              currentPage={data?.data.meta.currentPage}
              totalPages={data?.data?.meta.totalPages}
              onPageChange={(page) => {
                setPageParam(page);
              }}
            />
          )}
        </Box>
      </Container>
    </>
  );
}

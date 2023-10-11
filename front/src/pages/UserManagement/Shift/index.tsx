import { ActionsTop, Container, Box } from '../../../styles/global';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { useNavigate } from 'react-router-dom';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { ToggleBox } from '../../../components/ToggleBox';
import { useState } from 'react';
import { Table } from '../../../components/Tables/Table';
import Api from '../../../services/Api';
import { useQuery } from 'react-query';
import { ITableHeader } from '../../../components/Tables/Table/types';
import { toast } from 'react-toastify';
import { ModalEditShift } from './ModalEdit';
import { Search } from '../../../components/Input/Search';
import { CircularProgressPortal } from '../../../components/Loader/CircularProgressPortal';
import { Pagination } from '../../../components/Button/Pagination';
import { useTranslation } from 'react-i18next';
import { IShift } from '../../../interfaces/IGlobal';

export function Shift() {
  const [onOff, setOnOff] = useState(true);
  const [searchParam, setSearchParam] = useState('');
  const [closeModal, setCloseModal] = useState(false);
  const [shiftId, setShiftId] = useState(0);
  const [pageParam, setPageParam] = useState(1);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery(
    ['shift', onOff, searchParam, pageParam],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', '10');
      if (searchParam.length > 0) params.append('search_name', searchParam);
      params.append('orderBy', 'NAME');
      params.append('shift_status', String(String(onOff === true ? 1 : 0)));
      params.append('sort', 'ASC');

      return Api.get('shift', { params });
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

  const tableData = data?.data?.items?.map((item: IShift) => {
    return {
      shift_id: item?.shift_id,
      shift_name: item?.shift_name,
      shift_status: item?.shift_status,
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'shift_name',
      value: `${t('shift')}`,
      leftHeader: true,
      leftBody: true,
      columnWidth: '90%',
    },
  ];

  function handleChangeStatusShift(shift: any) {
    Api.patch(`shift/${shift.shift_id}`)
      .then((res) => {
        toast.success(
          res.data.shift_status ? t('shift-patch-act') : t('shift-patch-des'),
        );
        refetch();
      })
      .catch(() => toast.error(t('shift-error-toast')));
  }

  function openModal(shift: IShift) {
    setShiftId(shift.shift_id);
    setCloseModal(!closeModal);
  }

  if (!data || isLoading) {
    return <CircularProgressPortal />;
  }

  return (
    <Container>
      <BreadCrumbs />
      <ModalEditShift
        isModalActive={closeModal}
        closeModal={() => {
          refetch();
          setCloseModal(!closeModal);
        }}
        keyId={shiftId}
      />
      <h1>{t('shift')}</h1>
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
          label={t('shift-addShift')}
          onClick={() => navigate('/user-management/shift/new-shift')}
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
          onChangeStatus={handleChangeStatusShift}
          onEdit={openModal}
          emptyMessage={t('shift-empty-message')}
          instruction={t('shift-instruction')}
          loading={isLoading}
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
  );
}

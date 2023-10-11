import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { Pagination } from '../../../components/Button/Pagination';
import { Search } from '../../../components/Input/Search';
import { CircularProgressPortal } from '../../../components/Loader/CircularProgressPortal';
import { Table } from '../../../components/Tables/Table';
import { ITableHeader } from '../../../components/Tables/Table/types';
import { ToggleBox } from '../../../components/ToggleBox';
import { IOffice } from '../../../interfaces/IGlobal';
import Api from '../../../services/Api';
import { ActionsTop, Box, Container } from '../../../styles/global';
import { ModalEditOffice } from './EditModal';

export function Office() {
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const [onOff, setOnOff] = useState(true);
  const [closeModal, setCloseModal] = useState(false);
  const [officeId, setOfficeId] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery(
    ['office', searchParam, pageParam, onOff, officeId],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('search_name', searchParam);
      params.append('limit', '10');
      params.append('orderBy', 'NAME');
      params.append('sort', 'ASC');
      params.append('office_status', String(String(onOff === true ? 1 : 0)));

      return Api.get('office', { params });
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

  const tableData = data?.data?.items.map((item: IOffice) => {
    return {
      office_name: item?.oficce_name,
      office_status: item?.office_status,
      office_id: item?.office_id,
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'office_name',
      value: `${t('office')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  function handleChangeStatus(office: IOffice) {
    Api.patch(`office/status/${office.office_id}`)
      .then((res) => {
        toast.success(
          res.data.office_status
            ? t('office-patch-act')
            : t('office-patch-des'),
        );
        refetch();
      })
      .catch(() => toast.error(t('office-error-toast')));
  }

  function openModalEdit(office: IOffice) {
    setOfficeId(office.office_id);
    setCloseModal(!closeModal);
  }

  if (!data || isLoading) {
    return <CircularProgressPortal />;
  }

  return (
    <Container>
      <BreadCrumbs />
      <ModalEditOffice
        isModalActive={closeModal}
        closeModal={() => {
          refetch();
          setCloseModal(!closeModal);
        }}
        keyId={officeId}
      />
      <h1>{t('office')}</h1>
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
          label={t('office-addOffice')}
          onClick={() => navigate('new-office')}
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
          onEdit={openModalEdit}
          emptyMessage={t('office-empty-message')}
          instruction={t('office-instruction')}
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
  );
}

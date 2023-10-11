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
import Api from '../../../services/Api';
import { ActionsTop, Box, Container } from '../../../styles/global';
import { ModalEditCabinet } from './EditCabinet';

export function Cabinet() {
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const [onOff, setOnOff] = useState(true);
  const [closeModal, setCloseModal] = useState(false);
  const [cabinetId, setCabinetId] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery(
    ['cabinet', searchParam, pageParam, onOff, cabinetId],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('cabinet_name', searchParam);
      params.append('limit', '10');
      params.append('orderBy', 'NAME');
      params.append('sort', 'ASC');
      params.append('cabinet_status', String(String(onOff === true ? 1 : 0)));

      return Api.get('cabinet', { params });
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
    },
  );

  const tableData = data?.data?.items.map((item: any) => {
    return {
      cabinet_name: item?.cabinet_name,
      cabinet_status: item?.cabinet_status,
      cabinet_id: item?.cabinet_id,
      cabinet_side: item?.cabinet_side === 0 ? t('left') : t('right'),
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'cabinet_name',
      value: `${t('cabinet')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'cabinet_side',
      value: `${t('cabinet-side')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  function handleChangeStatus(cabinet: any) {
    Api.patch(`cabinet/status/${cabinet.cabinet_id}`)
      .then((res) => {
        toast.success(
          res.data.cabinet_status
            ? t('cabinet-patch-act')
            : t('cabinet-patch-des'),
        );
        refetch();
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        code === 4000
          ? toast.error(t(`${object}`) + t(`${code}`))
          : toast.error(t('cabinet-error-toast'));
      });
  }

  function openModalEdit(cabinet: any) {
    setCabinetId(cabinet.cabinet_id);
    setCloseModal(!closeModal);
  }

  if (!data || isLoading) {
    return <CircularProgressPortal />;
  }

  return (
    <Container>
      <BreadCrumbs />
      <ModalEditCabinet
        isModalActive={closeModal}
        closeModal={() => {
          refetch();
          setCloseModal(!closeModal);
        }}
        keyId={cabinetId}
      />
      <h1>{t('cabinet')}</h1>
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
          label={t('cabinet-addCabinet')}
          onClick={() => navigate('new')}
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
          emptyMessage={t('cabinet-empty-message')}
          instruction={t('cabinet-instruction')}
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

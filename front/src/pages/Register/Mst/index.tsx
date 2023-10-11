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
import { EditModalMst } from './EditModal';
import { IMst } from './types';

export function Mst() {
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const [onOff, setOnOff] = useState(true);
  const [closeModal, setCloseModal] = useState(false);
  const [mstId, setMstId] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery(
    ['mst', searchParam, pageParam, onOff, mstId],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('search_name', searchParam);
      params.append('limit', '10');
      params.append('orderBy', 'NAME');
      params.append('sort', 'ASC');
      params.append('mst_status', String(String(onOff === true ? 1 : 0)));

      return Api.get('mst', { params });
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

  const tableData = data?.data?.items.map((item: IMst) => {
    return {
      mst_name: item?.mst_name,
      mst_status: item?.mst_status,
      mst_id: item?.mst_id,
      mst_ip: item?.mst_ip,
      mst_side: item?.mst_side === 0 ? t('left') : t('right'),
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'mst_name',
      value: `${t('mst')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'mst_ip',
      value: `${t('ip-mst')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'mst_side',
      value: `${t('mst-side')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  function handleChangeStatus(mst: IMst) {
    Api.patch(`mst/status/${mst.mst_id}`)
      .then((res) => {
        toast.success(
          res.data.mst_status ? t('mst-patch-act') : t('mst-patch-des'),
        );
        refetch();
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        code === 4000
          ? toast.error(t(`${object}`) + t(`${code}`))
          : toast.error(t('mst-error-toast'));
      });
  }

  function openModalEdit(mst: IMst) {
    setMstId(mst.mst_id);
    setCloseModal(!closeModal);
  }

  if (!data || isLoading) {
    return <CircularProgressPortal />;
  }

  return (
    <>
      <Container>
        <BreadCrumbs />
        <EditModalMst
          isModalActive={closeModal}
          closeModal={() => {
            refetch();
            setCloseModal(!closeModal);
          }}
          keyId={mstId}
        />

        <h1>{t('mst')}</h1>

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
            label={t('mst-addMst')}
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
            emptyMessage={t('mst-empty-message')}
            instruction={t('mst-instruction')}
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

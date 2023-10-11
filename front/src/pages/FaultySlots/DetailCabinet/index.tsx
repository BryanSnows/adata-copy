import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../../services/Api';
import { ITableHeader } from '../../../components/Tables/Table/types';
import { ActionsTop, Box, Container } from '../../../styles/global';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { Search } from '../../../components/Input/Search';
import { Table } from '../../../components/Tables/Table';
import { Pagination } from '../../../components/Button/Pagination';
import { formatDate } from '../../../utils/formatParams/formatDate';
import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left.svg';
import { toast } from 'react-toastify';
import { ModalConfirm } from '../../../components/Modal/ModalConfirm';

export function DetailCabinet() {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const { id } = useParams();

  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [item, setItem] = useState();

  const { data, isLoading, refetch } = useQuery(
    ['travel', searchParam, pageParam, id],
    () => {
      let params = new URLSearchParams();
      params.append('cabinet_name', id);
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('search', searchParam);
      params.append('limit', '10');

      return Api.get(`slot-defect/${id}`, { params });
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

  const tableData = data?.data?.items?.map((item: any) => {
    return {
      position: item?.position,
      date: formatDate(item?.created_at),
      user: item?.user_name,
      slot_status: item?.status,
      cabinet_id: item?.cabinet_id,
    };
  });

  const headers: ITableHeader[] = [
    {
      key: 'position',
      value: `${t('position')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'date',
      value: `${t('last-date')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'user',
      value: `${t('user')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  function handleRepair(slot: any) {
    const payload = {
      position: slot.position,
    };

    Api.patch(`slot-defect/status/${slot?.cabinet_id}`, payload)
      .then((res) => {
        toast.success(t('position-repair-toast'));
        refetch();
      })
      .catch(() => toast.error(t('position-repair-error-toast')));
    setIsModalConfirmOpen(false);
  }

  return (
    <Container>
      <BreadCrumbs params={id} />
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={() => setIsModalConfirmOpen(false)}
        handleClose={() => handleRepair(item)}
        title={t('repair-confirm')}
        message={t('repair-message')}
        icon
      />

      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <button
          style={{ background: 'none', border: 'none' }}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </button>
        <h1>{t('slots')}</h1>
      </div>
      <ActionsTop>
        <Search
          onSearch={(value) => {
            setSearchParam(value);
            setPageParam(1);
          }}
          inputWidth={'256px'}
        />
      </ActionsTop>
      <Box>
        <Table
          headers={headers}
          data={tableData}
          enableActions
          onRepair={(e) => {
            setIsModalConfirmOpen(true);
            setItem(e);
          }}
          emptyMessage={t('slots-empty-message')}
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

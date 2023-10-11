import { useState } from 'react';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { Pagination } from '../../components/Button/Pagination';
import { Search } from '../../components/Input/Search';
import { Table } from '../../components/Tables/Table';
import { ActionsTop, Box, Container } from '../../styles/global';
import { ContainerCentral } from '../FPY-Mst/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import Api from '../../services/Api';
import { ITableHeader } from '../../components/Tables/Table/types';
import { ButtonMain } from '../../components/Button/ButtonMain';
import { useNavigate } from 'react-router-dom';
import { ICabinet } from '../../interfaces/IGlobal';

export function FaultySlots() {
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();

  function goToCabinetView(cabinet: ICabinet) {
    navigate(`${cabinet.cabinet_name}`);
  }

  const { data, isLoading } = useQuery(
    ['travel', searchParam, pageParam],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('search', searchParam);
      params.append('limit', '10');

      return Api.get('slot-defect', { params });
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

  const tableData = data?.data?.data?.map((item: any) => {
    return {
      cabinet_name: item?.cabinet,
      cabinet_id: item?.id,
      cont: item?.count,
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
      key: 'cont',
      value: `${t('slots-quant')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  return (
    <Container>
      <BreadCrumbs />
      <h1>{t('slots')}</h1>
      <ActionsTop>
        <Search
          onSearch={(value) => {
            setSearchParam(value);
            setPageParam(1);
          }}
          inputWidth={'256px'}
        />
        <ContainerCentral>
          <ButtonMain
            label={t('slots-buttom')}
            width="212px"
            onClick={() => navigate('/faulty-slots/new')}
          />
        </ContainerCentral>
      </ActionsTop>
      <Box>
        <Table
          headers={headers}
          data={tableData}
          enableActions
          onDetail={goToCabinetView}
          emptyMessage={t('slots-empty-message')}
          loading={isLoading}
          currentPage={data?.data.meta.currentPage}
          totalPages={data?.data?.meta.totalPages}
          onPageChanges={(page) => {
            setPageParam(page);
          }}
        />
        {data?.data.data.length > 0 && (
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

import { useEffect, useState } from 'react';
import { BreadCrumbs } from '../../components/BreadCrumbs';

import { Pagination } from '../../components/Button/Pagination';
import { Calendar } from '../../components/Calendar';
import { Search } from '../../components/Input/Search';
import { Table } from '../../components/Tables/Table';
import { ActionsTop, Box, Container } from '../../styles/global';
import { ContainerCentral } from '../FPY-Mst/styles';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import Api from '../../services/Api';
import { ITableHeader } from '../../components/Tables/Table/types';
import { formatDateBack } from '../../utils/formatParams/formatDateBack';
import { ITravel } from '../../interfaces/ITravel';

import ModalDetails from './ModalDetails';
import { formatDateAndTime } from '../../utils/formatParams/formatDateAndTime';

export function TravelCard() {
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);
  const { t } = useTranslation();
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [dateUn, setDateUn] = useState([]);
  const [TravelId, setTravelId] = useState(0);
  const [contId, setContId] = useState(0);

  const { data, isLoading } = useQuery(
    ['travel', searchParam, pageParam, dateStart, dateEnd],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('serial_number', searchParam);
      params.append('limit', '10');
      if (dateStart.length > 0) params.append('start_date', dateStart);
      if (dateEnd.length > 0) params.append('end_date', dateEnd);

      return Api.get('travel-card', { params });
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

  useEffect(() => {
    setContId(contId);
  }, [contId]);

  const tableData = data?.data?.items?.map((item: ITravel) => {
    return {
      serial_number: item?.workorder_serial?.serial?.serial_number,
      mst_name: item?.mst?.mst_name,
      cabinet_name: item?.cabinet?.cabinet_name,
      position: item?.position,
      created_at: formatDateAndTime(item?.created_at),
      test_serial_count: item?.test_serial_count,
    };
  });

  function openModal(travel: any) {
    setTravelId(travel?.serial_number);
    setContId(travel?.test_serial_count);
    setOpenModalDetails(!openModalDetails);
  }

  function params() {
    setPageParam(1);
  }

  const headers: ITableHeader[] = [
    {
      key: 'serial_number',
      value: 'SSD',
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'mst_name',
      value: 'MST',
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'cabinet_name',
      value: `${t('cabinet')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'position',
      value: `${t('component-table-position')}`,
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'created_at',
      value: `${t('component-table-date')}`,
      leftHeader: true,
      leftBody: true,
    },
  ];

  useEffect(() => {
    if (dateUn.length === 2) {
      setDateStart(formatDateBack(dateUn[0]));
      setDateEnd(formatDateBack(dateUn[1]));
      setPageParam(1);
    }
    if (dateUn.length === 0) {
      setDateStart('');
      setDateEnd('');
    }
  }, [dateUn]);

  const handleToggleCommentDrawer = (isDrawerOpen: boolean) => {
    setOpenModalDetails(isDrawerOpen);
  };

  return (
    <Container>
      <ModalDetails
        isCommentDrawerActive={openModalDetails}
        toggleCommentDrawer={handleToggleCommentDrawer}
        travelCardSerial={TravelId}
        cont={contId}
      />

      <BreadCrumbs />
      <h1>Travel Card</h1>
      <ActionsTop>
        <Search
          onSearch={(value) => {
            setSearchParam(value);
            setPageParam(1);
          }}
          inputWidth={'256px'}
        />
        <ContainerCentral>
          <Calendar
            value={dateUn}
            setDatePicker={setDateUn}
            placeholder={t('fpy-date')}
            label={t('fpy-date')}
            width="300px"
            line="none"
            interval
            onChange={params}
          />
        </ContainerCentral>
      </ActionsTop>
      <Box>
        <Table
          headers={headers}
          data={tableData}
          enableActions
          onDetail={openModal}
          emptyMessage={t('travel-empty-message')}
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

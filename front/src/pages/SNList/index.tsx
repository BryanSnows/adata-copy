import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { ButtonIcon } from '../../components/Button/ButtonIcon';
import { BasicDatePicker } from '../../components/DataCalendar';
import { Search } from '../../components/Input/Search';
import { ActionsTop, Box, Container } from '../../styles/global';
import { ContainerCentral } from '../Home/styles';
import Api from '../../services/Api';
import { ITableHeader } from '../../components/Tables/Table/types';
import { Filters } from '../Productivity/styles';
import { MST } from '../Productivity/types';
import { SelectList } from '../../components/SelectList';
import { times } from '../Productivity/data';
import { Table } from '../../components/Tables/Table';
import { Pagination } from '../../components/Button/Pagination';
import { formatDateBack } from '../../utils/formatParams/formatDateBack';
import { ISnList } from '../../interfaces/IGlobal';
import { formatDateAndTime } from '../../utils/formatParams/formatDateAndTime';
import { Detail } from './Detail';
import { DocumentsDownload } from '../Travel Card/DocumentsDownload';
import { exportExcel } from '../../utils/exportExcel';
import { snlistget } from './servises';

export function SNList() {
  const { t } = useTranslation();
  const [mst, setMst] = useState<any>('Todos');
  const [status, setStatus] = useState<any>('Todos');
  const [dateBasic, setDateBasic] = useState<Date | null>(null);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);

  const [
    isModalDocumentsViewAndDownloadOpen,
    setIsModalDocumentsViewAndDownloadOpen,
  ] = useState(false);

  const [serial, setSerial] = useState();

  const queryMST = useQuery(['get-MST'], () => Api.get('mst'));

  const getMst = queryMST?.data?.data?.items.map((item: MST) => ({
    value: item.mst_name,
    name: item.mst_name,
  }));

  const { data, isLoading } = useQuery(
    [
      'snlist',
      searchParam,
      pageParam,
      timeStart,
      timeEnd,
      status,
      mst,
      dateBasic,
    ],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (searchParam.length > 0) params.append('serial_number', searchParam);
      if (mst && mst !== 'Todos') params.append('mst_name', mst);
      if (status && status !== 'Todos')
        params.append('status', status === 'Aprovados' ? '1' : '0');
      params.append('limit', '10');
      if (dateBasic)
        params.append('created_at', formatDateBack(dateBasic).toString());
      if (timeStart && timeEnd)
        params.append('start_hour', timeStart.slice(0, 2));
      if (timeStart && timeEnd) params.append('end_hour', timeEnd.slice(0, 2));

      return Api.get('sn-list', { params });
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

  function handleListInputChange(event: any) {
    setPageParam(1);
    setMst(event.target.value);
  }

  function handleListStatusInputChange(event: any) {
    setPageParam(1);
    setStatus(event.target.value);
  }

  function handleBasicCaledarInput(value: any) {
    setPageParam(1);
    setDateBasic(() => value);
  }

  function handleClearBasicCaledarInput() {
    setPageParam(1);
    setDateBasic(null);
  }

  function handleChangeTimeStart(event) {
    setPageParam(1);
    setTimeStart(event.target.value);
  }

  function handleChangeTimeEnd(event) {
    setPageParam(1);
    setTimeEnd(event.target.value);
  }

  function openModal(snlist: any) {
    setSerial(snlist.serial_number);
    setOpenModalDetails(!openModalDetails);
  }

  function clearHour(id: string) {
    if (id === 'start') {
      return setTimeStart('');
    }

    setTimeEnd('');
  }

  const toggleDocumentsViewAndDownloadModal = () => {
    setIsModalDocumentsViewAndDownloadOpen(
      !isModalDocumentsViewAndDownloadOpen,
    );
  };

  async function handleDownload() {
    let serial = '';
    let mstActual = '';
    let statusActual = '';
    let date = '';
    let start = '';
    let end = '';

    if (searchParam.length > 0) {
      serial = searchParam;
    }

    if (mst !== 'Todos') {
      mstActual = mst;
    }

    if (status !== 'Todos') {
      statusActual = status === 'Aprovados' ? '1' : '0';
    }

    if (dateBasic) {
      date = formatDateBack(dateBasic).toString();
    }

    if (timeStart && timeEnd) {
      start = timeStart.slice(0, 2);
      end = timeEnd.slice(0, 2);
    }

    const get = await snlistget(
      serial,
      mstActual,
      statusActual,
      date,
      start,
      end,
    );

    const row = get?.items.map((item) => ({
      serial: item?.serial_number,
      mst: item?.mst_name,
      armario: item?.cabinet_name,
      posicao: item?.position,
      data: formatDateAndTime(item?.created_at),
      status: item?.status ? t('approved') : t('disapproved'),
      work_order: item?.work_order_number,
      modelo: item?.model_name,
      cliente: item?.customer,
    }));

    const header = [
      { header: 'SERIAL', key: 'serial', width: 15 },
      { header: 'MST', key: 'mst', width: 15 },
      { header: `${t('Cabinet')}`, key: 'armario', width: 15 },
      { header: `${t('component-table-position')}`, key: 'posicao', width: 15 },
      { header: `${t('component-table-date')}`, key: 'data', width: 25 },
      { header: 'STATUS', key: 'status', width: 15 },
      { header: 'WORK ORDER', key: 'work_order', width: 15 },
      { header: `${t('model')}`, key: 'modelo', width: 30 },
      { header: `${t('radial-client')}`, key: 'cliente', width: 40 },
    ];

    exportExcel('SN_List', header, row, 'SN_List');
  }

  const tableData = data?.data?.items?.map((item: ISnList) => {
    return {
      serial_number: item?.serial_number,
      mst_name: item?.mst_name,
      cabinet_name: item?.cabinet_name,
      position: item?.position,
      created_at: formatDateAndTime(item?.created_at),
      status: item?.status ? t('approved') : t('disapproved'),
    };
  });

  const dataStatus = [
    { value: 'Aprovados', name: t('approved') },
    { value: 'Reprovados', name: t('disapproved') },
  ];

  const headers: ITableHeader[] = [
    {
      key: 'serial_number',
      value: 'Serial',
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
    {
      key: 'status',
      value: 'Status',
      leftHeader: true,
      leftBody: true,
    },
  ];

  const handleToggleCommentDrawer = (isDrawerOpen: boolean) => {
    setOpenModalDetails(isDrawerOpen);
  };

  const timestart = timeEnd
    ? times.filter((time) => timeEnd.slice(0, 2) >= time)
    : times;

  const start = timestart.map((item) => ({
    value: `${item}:00`,
    name: `${item}:00`,
  }));

  const timesEnd = times.filter((time) => timeStart.slice(0, 2) <= time);

  const end = timesEnd.map((item) => ({
    value: `${item}:59`,
    name: `${item}:59`,
  }));

  return (
    <Container>
      <Detail
        isCommentDrawerActive={openModalDetails}
        toggleCommentDrawer={handleToggleCommentDrawer}
        snlist={serial}
      />

      <DocumentsDownload
        isModalOpen={isModalDocumentsViewAndDownloadOpen}
        onRequestClose={toggleDocumentsViewAndDownloadModal}
        handleDownload={handleDownload}
        text="SN_List"
      />
      <BreadCrumbs />
      <h1>SN List</h1>

      <ActionsTop>
        <Search
          onSearch={(value) => {
            setSearchParam(value);
            setPageParam(1);
          }}
          inputWidth={'256px'}
        />
        <ContainerCentral>
          <ButtonIcon
            cloud
            label={t('button-export')}
            onClick={() => setIsModalDocumentsViewAndDownloadOpen(true)}
          />
        </ContainerCentral>
      </ActionsTop>

      <Filters>
        <SelectList
          onChangeValue={handleListInputChange}
          currentValue={mst}
          width="160px"
          label="MST"
          placeholder="MST"
          text={t('all')}
          data={getMst}
          id="mst"
        />

        <SelectList
          onChangeValue={handleListStatusInputChange}
          currentValue={status}
          width="160px"
          label="Status"
          placeholder="Status"
          id="status"
          text={t('all')}
          data={dataStatus}
        />

        <BasicDatePicker
          label={t('productivity-date')}
          value={dateBasic}
          line="none"
          setDatePicker={handleClearBasicCaledarInput}
          onChangeValue={handleBasicCaledarInput}
          width="100%"
        />

        <SelectList
          onChangeValue={handleChangeTimeStart}
          currentValue={timeStart}
          width="160px"
          label={t('productivity-time-start')}
          placeholder={t('productivity-time-start')}
          id="start"
          data={start}
          clearValue={() => clearHour('start')}
          hour
        />

        <SelectList
          onChangeValue={handleChangeTimeEnd}
          currentValue={timeEnd}
          width="160px"
          label={t('productivity-time-end')}
          placeholder={t('productivity-time-end')}
          id="start"
          data={end}
          clearValue={clearHour}
          hour
          disabled={timeStart ? false : true}
        />
      </Filters>

      <Box>
        <Table
          headers={headers}
          data={tableData}
          enableActions
          onDetail={openModal}
          emptyMessage={t('sn-list-empty-message')}
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

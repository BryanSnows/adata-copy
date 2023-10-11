import { useTranslation } from 'react-i18next';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { useEffect, useState } from 'react';
import { times } from './data';
import { ToggleBox } from '../../components/ToggleBox';
import Api from '../../services/Api';
import { ContainerColum, Filters, Header, Container, Table } from './styles';
import { Calendar } from '../../components/Calendar';
import Check from '../../assets//images/checkGrenn.png';
import Reject from '../../assets//images/rejected.png';

import { BarChart } from '../../components/Charts/BarColumm';
import { RadialProgress } from '../../components/Charts/RadialProgress';
import { useQuery, useQueryClient } from 'react-query';
import { getProductivityHour, getProductivityMST } from './service';

import { BasicDatePicker } from '../../components/DataCalendar';

import { CircularProgressPortal } from '../../components/Loader/CircularProgressPortal';
import { SelectList } from '../../components/SelectList';
import { DocumentsDownload } from '../Travel Card/DocumentsDownload';
import { exportExcel } from '../../utils/exportExcel';
import { ContainerCentral } from '../Home/styles';
import { ButtonIcon } from '../../components/Button/ButtonIcon';
import { ActionsExport } from '../../styles/global';
import { formatDate } from '../../utils/formatParams/formatDate';

export function Productivity() {
  const { t } = useTranslation();
  const [dateMultiple, setDateMultiple] = useState([]);

  const state = dateMultiple ? dateMultiple : [new Date(), new Date()];

  const [dateBasic, setDateBasic] = useState<Date | null>(new Date());
  const [
    isModalDocumentsViewAndDownloadOpen,
    setIsModalDocumentsViewAndDownloadOpen,
  ] = useState(false);

  const [mst, setMst] = useState<any>('Todos');

  const initial = new Date();

  const finish = new Date();

  initial.setDate(initial.getDate() - 15);

  let dataAtual = new Date();

  const [dataMST, setDataMst] = useState([]);

  let horas = dataAtual.getHours();

  const [timeStart, setTimeStart] = useState('00:00');

  const [timeEnd, setTimeEnd] = useState(
    horas < 10 ? `0${horas}:59` : `${horas}:59`,
  );

  const [onOff, setOnOff] = useState(true);

  const [filters, setFilters] = useState({
    mst_name: '',
    current_date: dateBasic,
    start_hour: 0,
    end_hour: horas,
  });
  const [approvedAndDisapproved, setApprovedAndDisapproved] = useState({
    approved: null,
    disapproved: null,
    approvedMST: null,
    disapprovedMST: null,
  });

  const [filtersMST, setFiltersMST] = useState({
    mst_name: '',
    start_date: null,
    end_date: null,
  });
  const [porcent, setPorcent] = useState(0);

  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: 'productivity-approved',
        data: [],
        backgroundColor: ['#28C38D'],
      },
      {
        label: 'productivity-disapproved',
        data: [],
        backgroundColor: ['#D4445C'],
      },
    ],
  });

  const [userDataMST, setUserDataMST] = useState({
    labels: [],
    datasets: [
      {
        label: 'productivity-approved',
        data: [],
        backgroundColor: ['#28C38D'],
      },
      {
        label: 'productivity-disapproved',
        data: [],
        backgroundColor: ['#D4445C'],
      },
    ],
  });

  useQuery(['get-MSTs'], () => Api.get('mst'), {
    onSuccess: (dataOnSuccess) => {
      const list = dataOnSuccess?.data?.items?.map((item: any) => ({
        value: item.mst_name,
        name: item.mst_name,
      }));

      setDataMst(list);
    },
  });

  const queryProductivityHour = useQuery(
    ['get-hour', filters, onOff],
    () => getProductivityHour(filters),
    {
      onSuccess: (dataOnSuccess) => {
        setApprovedAndDisapproved((value) => ({
          ...value,
          approved: dataOnSuccess?.data?.reduce(
            (acc, cur) => acc + cur.seriais_aproved,
            0,
          ),
          disapproved: dataOnSuccess?.data?.reduce(
            (acc, cur) => acc + cur.seriais_reproved,
            0,
          ),
        }));

        setUserData((currentValue) => ({
          ...currentValue,
          labels: dataOnSuccess?.data?.map((item) => `${item.hour_test}:00`),
          datasets: currentValue.datasets?.map((items, index) => {
            return {
              ...items,
              data:
                index === 0
                  ? dataOnSuccess?.data?.map((item) => item.seriais_aproved)
                  : dataOnSuccess?.data?.map((item) => item.seriais_reproved),
            };
          }),
        }));
      },
      keepPreviousData: true,
      enabled: onOff,
      staleTime: 100,
    },
  );

  const mstList = useQuery(
    ['get-mst', filtersMST, onOff],
    () => getProductivityMST(filtersMST),
    {
      onSuccess: (dataOnSuccess) => {
        let mstTotal = dataOnSuccess?.data?.reduce(
          (acc, cur) => acc + cur.aprovedSeriais,
          0,
        );

        setApprovedAndDisapproved((value) => ({
          ...value,
          approvedMST: mstTotal,
          disapprovedMST: dataOnSuccess?.data?.reduce(
            (acc, cur) => acc + cur.reprovedSeriais,
            0,
          ),
        }));

        setUserDataMST((currentValue) => ({
          ...currentValue,
          labels: dataOnSuccess?.data?.map((item) => item.mst),
          datasets: currentValue.datasets?.map((items, index) => {
            return {
              ...items,
              data:
                index === 0
                  ? dataOnSuccess?.data?.map((item) => item.aprovedSeriais)
                  : dataOnSuccess?.data?.map((item) => item.reprovedSeriais),
            };
          }),
        }));

        const total = dataOnSuccess?.data?.reduce(
          (acc, cur) => acc + cur.totalSeriais,
          0,
        );

        let porcent = (mstTotal / total) * 100;

        setPorcent(Number(porcent.toFixed(1)));
      },
      keepPreviousData: true,
      enabled: !onOff,
    },
  );

  useEffect(() => {
    setFiltersMST((currentValue) => ({
      ...currentValue,
      start_date: initial,
      end_date: finish,
    }));

    if (dateMultiple?.length === 2) {
      setFiltersMST((currentValue) => ({
        ...currentValue,
        start_date: dateMultiple[0],
        end_date: dateMultiple[1],
      }));
    }
  }, [dateMultiple]);

  function handleChangeTimeStart(event) {
    setTimeStart(event.target.value);

    const time =
      Number(event.target.value.slice(0, 2)) <= Number(timeEnd.slice(0, 2));

    if (time) {
      return setFilters((currentValue) => ({
        ...currentValue,
        start_hour: Number(event.target.value.slice(0, 2)),
        end_hour: Number(timeEnd.slice(0, 2)),
      }));
    }
  }

  const toggleDocumentsViewAndDownloadModal = () => {
    setIsModalDocumentsViewAndDownloadOpen(
      !isModalDocumentsViewAndDownloadOpen,
    );
  };

  function handleChangeTimeEnd(event) {
    setTimeEnd(event.target.value);

    return setFilters((currentValue) => ({
      ...currentValue,
      start_hour: Number(timeStart.slice(0, 2)),
      end_hour: Number(event.target.value.slice(0, 2)),
    }));
  }

  function handleListInputChange(event: any) {
    setMst(event.target.value);
    if (onOff) {
      return setFilters((currentValue) => ({
        ...currentValue,
        mst_name: event.target.value === 'Todos' ? '' : event.target.value,
      }));
    }

    setFiltersMST((currentValue) => ({
      ...currentValue,
      mst_name: event.target.value === 'Todos' ? '' : event.target.value,
    }));
  }

  function handleBasicCaledarInput(value: any) {
    setDateBasic(() => value);

    return setFilters((currentValue) => ({
      ...currentValue,
      current_date: value,
    }));
  }

  function handleClearBasicCaledarInput() {
    setDateBasic(null);

    setFilters((currentValue) => ({
      ...currentValue,
      current_date: null,
    }));
  }

  async function handleDownload() {
    const date =
      dateMultiple?.length !== 0
        ? [formatDate(state[0]), formatDate(state[1])]
        : [formatDate(initial), formatDate(finish)];

    const row = onOff
      ? queryProductivityHour?.data?.data?.map((item) => ({
          mst: mst === 'Todos' ? `${t('all')}` : mst,
          data: formatDate(dateBasic),
          hora: `${item.hour_test}:00`,
          aprovados: item.seriais_aproved,
          reprovados: item.seriais_reproved,
        }))
      : mstList?.data?.data?.map((item) => ({
          mst: item.mst,
          data: `${date[0]} - ${date[1]}`,
          aprovados: item.aprovedSeriais,
          reprovados: item.reprovedSeriais,
          total: item.totalSeriais,
        }));
    const header = onOff
      ? [
          { header: 'MST', key: 'mst', width: 25 },
          { header: `${t('component-table-date')}`, key: 'data', width: 25 },
          { header: `${t('TEST-TIME')}`, key: 'hora', width: 25 },
          { header: `${t('approved')}`, key: 'aprovados', width: 25 },
          { header: `${t('disapproved')}`, key: 'reprovados', width: 25 },
        ]
      : [
          { header: 'MST', key: 'mst', width: 25 },
          { header: `${t('component-table-date')}`, key: 'data', width: 30 },
          { header: `${t('approved')}`, key: 'aprovados', width: 25 },
          { header: `${t('disapproved')}`, key: 'reprovados', width: 25 },
          { header: 'TOTAL', key: 'total', width: 25 },
        ];

    exportExcel(t('productivity'), header, row, t('productivity'));
  }

  if (queryProductivityHour?.isLoading) {
    return <CircularProgressPortal />;
  }

  const timesStart = times.filter((item) => item);

  const start = timesStart?.map((item) => ({
    value: `${item}:00`,
    name: `${item}:00`,
  }));

  const timesEnd = times.filter((item) => timeStart.slice(0, 2) <= item);

  const end = timesEnd?.map((item) => ({
    value: `${item}:59`,
    name: `${item}:59`,
  }));

  return (
    <Container>
      <DocumentsDownload
        isModalOpen={isModalDocumentsViewAndDownloadOpen}
        onRequestClose={toggleDocumentsViewAndDownloadModal}
        handleDownload={handleDownload}
        text={t('productivity')}
      />
      <BreadCrumbs />
      <h1>{t('productivity')}</h1>

      <ActionsExport>
        <ToggleBox
          onOff={onOff}
          onChangeInactive={() => {
            setOnOff(false);

            setMst('Todos');

            setFilters({
              mst_name: '',
              current_date: new Date(),
              start_hour: 0,
              end_hour: horas,
            });

            setDateBasic(new Date());

            setTimeStart('00:00');

            setTimeEnd(horas < 10 ? `0${horas}:59` : `${horas}:59`);
          }}
          onChangeActive={() => {
            setOnOff(true);
            setMst('Todos');

            setFiltersMST({
              mst_name: '',
              start_date: null,
              end_date: null,
            });
            setDateMultiple([]);
          }}
          textActive={t('productivity-hours')}
          textInactive="MST"
        />
        <ContainerCentral>
          <ButtonIcon
            cloud
            label={t('button-export')}
            onClick={() => setIsModalDocumentsViewAndDownloadOpen(true)}
          />
        </ContainerCentral>
      </ActionsExport>

      <Filters>
        <SelectList
          onChangeValue={handleListInputChange}
          currentValue={mst}
          width="220px"
          label="MST"
          placeholder="MST"
          text={t('all')}
          data={dataMST}
          id="mst"
        />

        {onOff ? (
          <BasicDatePicker
            label={t('productivity-date')}
            value={dateBasic}
            line="none"
            setDatePicker={handleClearBasicCaledarInput}
            onChangeValue={handleBasicCaledarInput}
            width="225px"
            clean
          />
        ) : (
          <Calendar
            value={dateMultiple}
            setDatePicker={setDateMultiple}
            placeholder={t('productivity-interval')}
            label={t('productivity-interval')}
            width="300px"
            line="none"
            interval
            initial={[initial, finish]}
          />
        )}

        {onOff && (
          <>
            <SelectList
              onChangeValue={handleChangeTimeStart}
              currentValue={timeStart}
              width="220px"
              label={t('productivity-time-start')}
              data={start}
              id="start"
            />

            <SelectList
              onChangeValue={handleChangeTimeEnd}
              currentValue={timeEnd}
              width="220px"
              label={t('productivity-time-end')}
              data={end}
              id="end"
            />
          </>
        )}
      </Filters>

      <ContainerColum onOff={onOff}>
        <Header onOff={onOff} />

        <div className="container">
          <div className="status">
            {!onOff && (
              <div className="icons">
                <div className="check">
                  <img src={Check} alt="check" width={39} />
                  <h1>{approvedAndDisapproved.approvedMST}</h1>
                  <p>{t('productivity-approved')}</p>
                </div>
                <div className="reject">
                  <img src={Reject} alt="check" width={39} />
                  <h1>{approvedAndDisapproved.disapprovedMST}</h1>
                  <p>{t('productivity-disapproved')}</p>
                </div>
              </div>
            )}
            <Table onOff={onOff}>
              {onOff ? (
                <BarChart
                  produtivity
                  dataChart={userData}
                  width={
                    userData?.labels?.length <= 7
                      ? '100%'
                      : `calc(100% + ${140 * (userData?.labels?.length - 7)}px)`
                  }
                />
              ) : (
                <BarChart
                  produtivity
                  dataChart={userDataMST}
                  width={
                    userDataMST?.labels?.length <= 7
                      ? '100%'
                      : `calc(100% + ${
                          140 * (userDataMST?.labels?.length - 7)
                        }px)`
                  }
                />
              )}
            </Table>
          </div>

          {onOff && (
            <div>
              <div className="total">Total</div>
              <div className="check">
                <img src={Check} alt="check" width={39} />
                <h1>{approvedAndDisapproved.approved}</h1>
                <p>{t('productivity-approved')}</p>
              </div>
              <div className="reject">
                <img src={Reject} alt="check" width={39} />
                <h1>{approvedAndDisapproved.disapproved}</h1>
                <p>{t('productivity-disapproved')}</p>
              </div>
            </div>
          )}
          {!onOff && (
            <div className="bar">
              <h1>{t('productivity-Grand')}</h1>
              <RadialProgress
                progressNumber={porcent ? porcent : 0}
                height={260}
                text={porcent ? t('productivity-approval') : ''}
              />
            </div>
          )}
        </div>
      </ContainerColum>
    </Container>
  );
}

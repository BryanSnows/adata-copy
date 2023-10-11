import { io } from 'socket.io-client';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import {
  Header,
  Table,
  Line,
  Container,
  Occuppation,
  ContainerColum,
} from './styles';
import { useEffect, useState } from 'react';
import { RadialFinish } from '../../components/Charts/RadialFinish';
import { RadialOcuppation } from '../../components/Charts/RadialOccupation';
import { useTranslation } from 'react-i18next';
import { IMsts, IRealTime } from '../../interfaces/IRealTime';
import { BarChart } from '../../components/Charts/BarColumm';

export function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<IMsts[]>([]);
  const [ssd, setSsd] = useState(0);
  const [msts, setMsts] = useState(0);
  const [free, setFree] = useState<IMsts[]>([]);
  const [flash, setFlash] = useState<any>([]);

  const [userDataMST, setUserDataMST] = useState({
    labels: [],
    datasets: [
      {
        label: 'dashboard-test',
        data: [],
        backgroundColor: ['#05328D'],
        wo: [],
        quantity: [],
      },
      {
        label: 'dashboard-occuppation',
        data: [],
        backgroundColor: ['#EC9C00'],
        wo: [],
        quantity: [],
      },
    ],
  });

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SOCKET_BASE_URL}`, {
      path: '/api/socket.io',
    });

    setInterval(
      () =>
        socket.emit('get-mst-status', (event: IRealTime) => {
          setFlash(event?.mst_to_finalize);
          setData(event?.msts);
          setUserDataMST((currentValue) => ({
            ...currentValue,

            labels: event?.msts?.map((item) => item.mst_name),
            datasets: currentValue.datasets.map((items, index) => {
              return {
                ...items,
                wo: event?.msts?.map((item) => item.work_order),
                quantity: event?.msts?.map((item) => item.ssd_quantity),
                time: event?.msts?.map((item) => item.remaining_time),
                data:
                  index === 0
                    ? event?.msts?.map((item) => item.test_time_percentage)
                    : event?.msts?.map((item) => item.capacity_percentage),
              };
            }),
          }));
          setSsd(event?.total_ssds);
          setMsts(event?.msts.length);
          setFree(
            event?.msts?.filter((item) => item?.capacity_percentage === 0),
          );
        }),
      1000,
    );

    return () => {
      socket.off('get-mst-status');
    };
  }, []);

  return (
    <Container>
      <BreadCrumbs />
      <h1>Dashboard</h1>
      <ContainerColum>
        <Header />
        <div className="grid">
          <div className="container">
            <div className="info">
              <div className="total">
                <h6>{t('dashboard-ssd')}</h6>
                <h1>{ssd || ssd === 0 ? ssd : '--'}</h1>
              </div>
              <div className="mst">
                <h6>{t('dashboard-mst')}</h6>
                <h1>{msts || msts === 0 ? msts : '--'}</h1>
              </div>
              <div className="length">
                <h6>{t('dashboard-out')}</h6>
                <h1>{free || free.length === 0 ? free.length : '--'}</h1>
              </div>
            </div>

            <Table>
              <BarChart
                dataChart={userDataMST}
                dashboard
                width={
                  userDataMST?.labels.length <= 7
                    ? '100%'
                    : `calc(100% + ${150 * (userDataMST?.labels.length - 7)}px)`
                }
              />
            </Table>
          </div>

          <RadialFinish
            wo={flash?.work_order}
            mst={flash?.mst_name}
            client={flash?.customer}
            occupationNumber={flash?.capacity_percentage}
            time={flash?.remaining_time}
          />
        </div>
        <div className="occup">
          <Occuppation>
            <div className="line">
              <Line />
              <h6>{t('dashboard-occ')}</h6>
              <Line />
            </div>
            <div className="space">
              <div
                className="box"
                style={{
                  width:
                    data.length <= 7
                      ? '100%'
                      : `calc(100% + ${210 * (data.length - 7)}px)`,
                }}
              >
                {data?.map((item) => (
                  <RadialOcuppation
                    wo={item ? item?.work_order : '--'}
                    mst={item ? item?.mst_name : '--'}
                    progressNumber={item ? item?.capacity_percentage : 0}
                    time={item ? item?.remaining_time : '--'}
                  />
                ))}
              </div>
            </div>
          </Occuppation>
        </div>
      </ContainerColum>
    </Container>
  );
}

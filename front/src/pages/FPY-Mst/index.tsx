import { useEffect, useState } from 'react';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { Calendar } from '../../components/Calendar';
import {
  ContainerCentral,
  ContainerChart,
  ContainerT,
  Container,
  Dunet,
  Header,
  LineDivider,
} from './styles';
import { formatDateChart } from '../../utils/formatParams/formatDateChart';
import { formatDate } from '../../utils/formatParams/formatDate';
import { useQuery } from 'react-query';
import Api from '../../services/Api';
import { formatDateBack } from '../../utils/formatParams/formatDateBack';

import { Line } from '../../components/Charts/Line';
import { IFpy, IHistory } from '../../interfaces/IFpy';
import { useTranslation } from 'react-i18next';
import { ButtonIcon } from '../../components/Button/ButtonIcon';
import { DocumentsDownload } from '../Travel Card/DocumentsDownload';
import { exportExcel } from '../../utils/exportExcel';
import { IMst } from '../Register/Mst/types';
import { BarChartHorizontal } from '../../components/Charts/HorizontalChart/ChartBarHorizontal';
import { parse } from 'date-fns';

export function FPYMst() {
  const language = localStorage.getItem('language');
  const { t } = useTranslation();
  const [
    isModalDocumentsViewAndDownloadOpen,
    setIsModalDocumentsViewAndDownloadOpen,
  ] = useState(false);

  const [dateUn, setDateUn] = useState([]);
  const [dataChart, setdataChart] = useState<any>([]);
  const [labelAll, setLabelAll] = useState([]);

  const [userDataMST, setUserDataMST] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        datalabels: {
          align: 'start',
          anchor: 'start',
          clamp: true,
        },
      },
    ],
  });

  const colors = [
    '#EC9C00',
    '#1EA7EA',
    '#05328D',
    '#EEE800',
    '#40A731',
    '#C70026',
    '#9E4394',
  ];

  const finish = new Date();
  const initial = new Date();
  initial.setDate(initial.getDate() - 6);

  const [filtersMST, setFiltersMST] = useState({
    start_date: formatDateBack(initial),
    end_date: formatDateBack(finish),
  });

  const [dateInterval, setDateInterval] = useState([]);
  const [dateCompare, setDateCompare] = useState([]);
  const [filterDown, setfilterDown] = useState<null | Number>();
  const [colorMSts, setColorsMsts] = useState([]);

  function Interval(dateIn, dateFinish, form) {
    const somedays = new Date(dateIn);
    const fin = new Date(dateFinish);
    const inte = [];
    while (somedays <= fin) {
      if (form) {
        inte.push(formatDateChart(somedays));
      } else {
        inte.push(formatDate(somedays));
      }

      somedays.setDate(somedays.getDate() + 1);
    }
    return inte;
  }

  useEffect(() => {
    setFiltersMST((currentValue) => ({
      ...currentValue,
      start_date: String(initial),
      end_date: String(finish),
    }));
    setDateInterval(Interval(initial, finish, true));
    setDateCompare(Interval(initial, finish, false));

    if (dateUn.length === 2) {
      setDateInterval(Interval(dateUn[0], dateUn[1], true));
      setDateCompare(Interval(dateUn[0], dateUn[1], false));
      setFiltersMST((currentValue) => ({
        ...currentValue,
        start_date: dateUn[0],
        end_date: dateUn[1],
      }));
    }
  }, [dateUn, language]);

  const queryMst = useQuery(
    ['mst'],
    () => {
      let params = new URLSearchParams();

      params.append('limit', '99999999');
      params.append('orderBy', 'NAME');
      params.append('sort', 'ASC');

      return Api.get('mst', { params });
    },
    {
      onSuccess: (dataOnSuccess) => {
        setLabelAll(
          dataOnSuccess?.data?.items
            ?.filter((item: IMst) => item?.mst_status === true)
            .map((item: IMst) => item?.mst_name),
        );
      },
      keepPreviousData: true,
      staleTime: 2000,
    },
  );

  const { data } = useQuery(
    ['fpy', filtersMST, labelAll],
    () => {
      let params = new URLSearchParams();

      const startDate = formatDateBack(filtersMST?.start_date);

      const endDate = formatDateBack(filtersMST?.end_date);

      if (filtersMST.start_date && filtersMST.end_date)
        params.append('start_date', startDate);
      if (filtersMST.start_date && filtersMST.end_date)
        params.append('end_date', endDate);

      return Api.get('travel-card/fpy', { params });
    },
    {
      onSuccess: (dataOnSuccess) => {
        setUserDataMST({
          labels: [''],
          datasets: dataOnSuccess?.data?.map((item: IFpy) => {
            return {
              label: item?.mst,
              data: [item?.fpy],
              backgroundColor: colorMSts.find(
                (mst: any) => mst?.mst === item?.mst,
              )?.color,
              datalabels: {
                align: '4',
                anchor: 'start',
                clamp: true,
                formatter: function (value, context) {
                  return context.dataset.label + ': ' + value + '%';
                },
              },
            };
          }),
        });
      },

      keepPreviousData: true,
      staleTime: 2000,
    },
  );
  
  function ColorIndex(index) {
    if (index <= 6) {
      return index;
    } else {
      return ColorIndex(index - 7);
    }
  }

  useEffect(() => {
    setColorsMsts(
      labelAll?.map((mst: string, index: number) => {
        return {
          mst: mst,
          color: colors[ColorIndex(index)],
        };
      }),
    );
    setdataChart([]);
    labelAll?.map((mst: string) =>
      setdataChart((prevState) => [
        ...prevState,
        {
          data: dateCompare?.map((date: string) => {
            const qualmst = data?.data?.find((fpy: IFpy) => mst === fpy?.mst);

            const temNadata = qualmst?.history.find(
              (dado: IHistory) => date === dado?.day,
            );
            return temNadata ? temNadata?.fpy : 0;
          }),

          name: mst,
        },
      ]),
    );
  }, [labelAll, dateCompare, data]);

  const toggleDocumentsViewAndDownloadModal = () => {
    setIsModalDocumentsViewAndDownloadOpen(
      !isModalDocumentsViewAndDownloadOpen,
    );
  };

  async function handleDownload() {
    const header = [
      { header: 'MST', key: 'mst', width: 25 },
      { header: `${t('component-table-date')}`, key: 'data', width: 25 },
      { header: `${t('Qty')}`, key: 'aprovados', width: 30 },
      { header: `${t('Qtd')}`, key: 'teste', width: 30 },
      { header: `${t('rate')}`, key: 'taxa', width: 25 },
    ];
    const array = data?.data.map((item) => item.history);

    const history = array.flatMap((item) => item);

    const filter = labelAll?.find((item, index) => index === filterDown);
    const fineshedFilter = history.filter((item) => item?.mst === filter);

    if (filter === undefined || filter === null) {
      const row = history.map((item) => ({
        mst: item?.mst,
        data: item?.day,
        aprovados: item?.firstApproved,
        teste: item?.totalTested,
        taxa: item?.fpy || item?.fpy === 0 ? `${item?.fpy}%` : null,
      }));

      row.sort((a: any, b: any) => {
        const fisrt = parse(a.data, 'dd/MM/yyyy', new Date());
        const second = parse(b.data, 'dd/MM/yyyy', new Date());
        return new Date(fisrt).valueOf() - new Date(second).valueOf();
      });

      exportExcel('FPY_MST', header, row, 'FPY_MST');
    } else {
      const row = fineshedFilter.map((item) => ({
        mst: item?.mst,
        data: item?.day,
        aprovados: item?.firstApproved,
        teste: item?.totalTested,
        taxa: item?.fpy || item?.fpy === 0 ? `${item?.fpy}%` : null,
      }));

      row.sort((a: any, b: any) => {
        const fisrt = parse(a.data, 'dd/MM/yyyy', new Date());
        const second = parse(b.data, 'dd/MM/yyyy', new Date());
        return new Date(fisrt).valueOf() - new Date(second).valueOf();
      });

      exportExcel('FPY_MST', header, row, 'FPY_MST');
    }
  }

  return (
    <Container>
      <DocumentsDownload
        isModalOpen={isModalDocumentsViewAndDownloadOpen}
        onRequestClose={toggleDocumentsViewAndDownloadModal}
        handleDownload={handleDownload}
        text={'FPY_MST'}
      />
      <BreadCrumbs />
      <h1>FPY - MST</h1>
      <ContainerCentral>
        <Calendar
          value={dateUn}
          setDatePicker={setDateUn}
          placeholder={t('fpy-date')}
          label={t('fpy-date')}
          width="300px"
          line="none"
          interval
          initial={[initial, finish]}
        />
        <ButtonIcon
          cloud
          label={t('button-export')}
          onClick={() => setIsModalDocumentsViewAndDownloadOpen(true)}
        />
      </ContainerCentral>
      <ContainerT>
        <Header />
        <div className="row">
          <ContainerChart>
            <Line
              title={
                t('fpy') +
                ` ${
                  dateUn[0] && dateUn[1]
                    ? formatDate(dateUn[0]) + ' - ' + formatDate(dateUn[1])
                    : formatDate(initial) + ' - ' + formatDate(finish)
                }`
              }
              seriesData={dataChart ? dataChart : []}
              categories={dateInterval}
              onFilter={(e) => setfilterDown(e)}
            />
          </ContainerChart>
          <Dunet>
            <h3>{t('fpy-tax')}</h3>
            <LineDivider />
            <BarChartHorizontal dataChart={userDataMST} />
          </Dunet>
        </div>
      </ContainerT>
    </Container>
  );
}

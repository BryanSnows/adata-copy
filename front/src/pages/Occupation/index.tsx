import { useTranslation } from 'react-i18next';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import {
  Box,
  Chart,
  ContainerT,
  Filters,
  Header,
  Container,
  Gri,
} from './styles';
import { SelectList } from '../../components/SelectList';
import { useEffect, useState } from 'react';
import Api from '../../services/Api';
import { useQuery } from 'react-query';
import { MST } from '../Productivity/types';
import { Calendar } from '../../components/Calendar';
import { BarChart } from '../../components/Charts/BarColumm';
import { ITableHeader } from '../../components/Tables/Table/types';
import { Table } from '../../components/Tables/Table';
import { IDetailHistory, IOccupation } from '../../interfaces/IOccupation';
import { formatDateBack } from '../../utils/formatParams/formatDateBack';
import { formatDate } from '../../utils/formatParams/formatDate';

export function Occupation() {
  const { t } = useTranslation();
  const [mst, setMst] = useState<any>('Todos');
  const [dateUn, setDateUn] = useState([]);
  const [filtersMST, setFiltersMST] = useState({
    mst_name: '',
    start_date: null,
    end_date: null,
  });
  const [dataTable, setDataTable] = useState<IDetailHistory[]>([]);

  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: 'occup-quant',
        data: [],
        backgroundColor: ['#1DA0E9'],
      },
    ],
  });

  const initial = new Date();
  const finish = new Date();
  initial.setDate(initial.getDate() - 14);

  const { isLoading } = useQuery(
    ['occupation', filtersMST],
    () => {
      let params = new URLSearchParams();

      const startDate = formatDateBack(filtersMST?.start_date);

      const endDate = formatDateBack(filtersMST?.end_date);

      if (filtersMST?.mst_name) params.append('mst_name', filtersMST?.mst_name);
      if (filtersMST.start_date && filtersMST.end_date)
        params.append('start_date', startDate);
      if (filtersMST.start_date && filtersMST.end_date)
        params.append('end_date', endDate);
      return Api.get('sn-list/occupation/history', { params });
    },
    {
      onSuccess: (dataOnSuccess) => {
        const items = dataOnSuccess?.data?.MST.filter(
          (item) => item.quantity_without_cappacity_total !== 0,
        );

        setUserData((currentValue) => ({
          ...currentValue,
          labels: items.map(
            (item: IOccupation) => item?.cabinet_history[0]?.mst_name,
          ),
          datasets: currentValue?.datasets?.map((item) => {
            return {
              ...item,
              data: items.map((item) => item?.quantity_without_cappacity_total),
            };
          }),
        }));

        const array = items
          .map((cont: IOccupation) =>
            cont?.cabinet_history.map((item) => {
              return { ...item, created_at: formatDate(item?.created_at) };
            }),
          )
          .flat();

        let values = array.filter(function (a) {
          return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null));

        function objectsAreEqual(obj1, obj2) {
          return JSON.stringify(obj1) === JSON.stringify(obj2);
        }

        function contReduce(item: any, array: any) {
          const quantity = array.reduce((acc: number, value: any) => {
            if (objectsAreEqual(item, value)) {
              return (acc = acc + 1);
            }
            return acc;
          }, 0);
          return quantity;
        }

        const contArray = values.map((item: any) => ({
          ...item,
          quantity: contReduce(item, array),
        }));

        setDataTable(contArray);
      },

      keepPreviousData: true,
      staleTime: 2000,
    },
  );

  useEffect(() => {
    setFiltersMST((currentValue) => ({
      ...currentValue,
      start_date: initial,
      end_date: finish,
    }));
    if (dateUn.length === 2) {
      setFiltersMST((currentValue) => ({
        ...currentValue,
        start_date: dateUn[0],
        end_date: dateUn[1],
      }));
    }
  }, [dateUn]);

  const queryMST = useQuery(['get-MST'], () => Api.get('mst'));

  const getMst = queryMST?.data?.data?.items.map((item: MST) => ({
    value: item.mst_name,
    name: item.mst_name,
  }));

  function handleListInputChange(event: any) {
    setMst(event.target.value === 'Todos' ? 'Todos' : event.target.value);

    setFiltersMST((currentValue) => ({
      ...currentValue,
      mst_name: event.target.value === 'Todos' ? '' : event.target.value,
    }));
  }

  const headers: ITableHeader[] = [
    {
      key: 'mst_name',
      value: 'MST',
    },
    {
      key: 'cabinet',
      value: `${t('cabinet')}`,
    },
    {
      key: 'quantity',
      value: `${t('occup-quant')}`,
    },
    {
      key: 'created_at',
      value: `${t('component-table-date')}`,
    },
  ];

  return (
    <>
      <Container>
        <BreadCrumbs />
        <h1>{t('occupation')}</h1>

        <Filters>
          <SelectList
            onChangeValue={handleListInputChange}
            currentValue={mst}
            width="250px"
            label="MST"
            placeholder="MST"
            text={t('all')}
            data={getMst}
          />
          <Calendar
            value={dateUn}
            setDatePicker={setDateUn}
            placeholder={t('fpy-date')}
            label={t('fpy-date')}
            width="105%"
            line="none"
            initial={[initial, finish]}
          />
        </Filters>
        <Gri>
          <ContainerT>
            <Header />
            <Chart>
              <BarChart
                dataChart={userData}
                ocupation
                width={
                  userData.labels.length <= 7
                    ? '100%'
                    : `calc(100% + ${200 * (userData.labels.length - 7)}px)`
                }
                widthMin={
                  userData.labels.length <= 7
                    ? '100%'
                    : `calc(100% + ${150 * (userData.labels.length - 7)}px)`
                }
              />
            </Chart>
          </ContainerT>

          <Box>
            <Table
              headers={headers}
              data={dataTable}
              emptyMessage={t('occup-empty-message')}
              loading={isLoading}
              otherColor="#E5E5E5"
              textColor="#575757"
            />
          </Box>
        </Gri>
      </Container>
    </>
  );
}

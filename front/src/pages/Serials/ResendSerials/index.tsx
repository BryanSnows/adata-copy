import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { Pagination } from '../../../components/Button/Pagination';
import { Search } from '../../../components/Input/Search';

import { Table } from '../../../components/Tables/Table';
import { ITableHeader } from '../../../components/Tables/Table/types';
import Api from '../../../services/Api';
import { ActionsTop, Box, Container } from '../../../styles/global';
import { formatDate } from '../../../utils/formatParams/formatDate';
import { ContainerCentral } from '../../Home/styles';
import { IAccessToken, getDecodedToken } from '../../../utils/auth';

export function ResendSerials() {
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useState('');
  const [pageParam, setPageParam] = useState(1);

  const [serialAll, setSerialAll] = useState(false);
  const [serial, setSerial] = useState([]);

  const { data, isLoading, refetch } = useQuery(
    ['serial', searchParam, pageParam],
    () => {
      let params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('sort', 'ASC');
      params.append('resent', '0');
      if (searchParam.length > 0) params.append('search', searchParam);
      params.append('limit', '10');

      return Api.get('mes-consume/serial-exception', { params });
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

  const headers: ITableHeader[] = [
    {
      key: 'workorder_serial_id',
      value: 'W.O',
      leftHeader: true,
      leftBody: true,
    },
    {
      key: 'mserial_id',
      value: 'Serial',
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

  const tableData = data?.data?.items?.map((item: any) => {
    return {
      workorder_serial_id:
        item?.workorder_serial?.work_order?.work_order_number,
      mserial_id: item?.workorder_serial.serial.serial_number,
      created_at: formatDate(item?.serial_exception_created_at),
    };
  });

  function handleSerial(items: any) {
    const exist = serial.some((serial) => serial === items.mserial_id);

    if (exist) {
      if (serial.length === tableData.length && serialAll) {
        setSerialAll((currentValue) => !currentValue);
      }

      return setSerial((currentValue) =>
        currentValue.filter((serial: any) => serial !== items.mserial_id),
      );
    }
    setSerial((currentValue) => [...currentValue, items.mserial_id]);
  }

  function handleSerialAll() {
    if (!serialAll) {
      const seriais = tableData.map((item: any) => item.mserial_id);

      setSerialAll((currentValue) => !currentValue);

      return setSerial(seriais);
    }

    setSerialAll((currentValue) => !currentValue);

    setSerial([]);
  }

  async function handlePostSeril() {
    const decoded_access_token: IAccessToken = getDecodedToken();

    if (!decoded_access_token?.user_mes_id) {
      return toast.error(t('mes_id'));
    }
    await Api.post('mes-consume/approved-serials', {
      approved_serials: serial,
      user_mes_id: decoded_access_token?.user_mes_id,
    })
      .then(() => {
        toast.success(t('serial-toast'));
        refetch();
        setSerialAll(false);
        setSerial([]);
      })
      .catch((error) => {
        const code =
          error?.response?.data?.code === 6000 ? '6000' : 'serial-toast-failed';
        toast.error(t(`${code}`));
      });
  }

  return (
    <Container>
      <BreadCrumbs />
      <h1>{t('resend-serials')}</h1>
      <ActionsTop>
        <Search
          onSearch={(value) => {
            setSearchParam(value);
            setPageParam(1);
            setSerialAll(false);
            setSerial([]);
          }}
          inputWidth={'256px'}
        />
        <ContainerCentral>
          <ButtonMain
            label={t('button-serial')}
            type="button"
            width="188px"
            disabled={serial.length === 0}
            onClick={handlePostSeril}
          />
        </ContainerCentral>
      </ActionsTop>

      <Box>
        <Table
          headers={headers}
          data={tableData}
          emptyMessage={t('serial-empty-message')}
          loading={isLoading}
          checkBox
          checkState={serial}
          checkStateAll={serialAll}
          onCheckAll={handleSerialAll}
          onCheck={handleSerial}
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
              setSerialAll(false);
              setSerial([]);
            }}
          />
        )}
      </Box>
    </Container>
  );
}

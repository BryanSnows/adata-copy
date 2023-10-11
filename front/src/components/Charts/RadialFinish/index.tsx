import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { IRadialProgress } from './types';
import { Botton, Box, Divider, Header, Top } from './styles';
import { useTranslation } from 'react-i18next';

export function RadialFinish({
  occupationNumber,
  wo,
  client,
  mst,
  time,
}: IRadialProgress) {
  const [resetChart, setResetChart] = useState(false);
  const series = [occupationNumber ? occupationNumber : 0];
  const { t } = useTranslation();
  useEffect(() => {
    setResetChart(true);
    return () => {
      setResetChart(false);
    };
  }, [resetChart]);

  const options: ApexOptions = {
    tooltip: {
      enabled: false,
    },
    labels: [t('radial-occuppation')],
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: '50%',
        },
        track: {
          background: '#E0E1E2',
        },

        dataLabels: {
          name: {
            show: true,
            color: '#394555',
            fontWeight: 'bold',
            fontSize: '12px',
            offsetY: 20,
            fontFamily: 'Roboto',
          },
          value: {
            fontSize: '30px',
            fontWeight: '600',
            color: '#394555',
            show: true,
            offsetY: -10,
            fontFamily: 'Roboto',
          },
        },
      },
    },
    fill: {
      colors: ['#EC9C00'],
    },
  };

  return (
    <>
      <Box>
        <Header>
          <h3>{t('radial-next')}</h3>
        </Header>
        <Divider />
        <Top>
          <h2> {mst ? mst : ''}</h2>
          <h6> WO: {wo ? wo : '--'}</h6>
          <h6>
            {' '}
            {t('radial-client')}: {client ? client : '--'}
          </h6>
        </Top>

        {resetChart && (
          //@ts-ignore

          <Chart
            type="radialBar"
            height={240}
            options={options}
            series={series}
            labels={[t('radial-occuppation')]}
          />
        )}

        <Botton>
          <h5>{`${t('radial-aft')} ${time ? time : '--'} ${t(
            'radial-before',
          )}`}</h5>
          <h5>{t('radial-finish')}</h5>
        </Botton>
      </Box>
    </>
  );
}

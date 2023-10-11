import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { IRadialProgress } from './types';
import { Bottom, Box, Divider, Header } from './styles';
import { useTranslation } from 'react-i18next';

export function RadialOcuppation({
  progressNumber,
  wo,
  mst,
  time,
}: IRadialProgress) {
  const { t } = useTranslation();
  const [resetChart, setResetChart] = useState(false);
  const series = [progressNumber];
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
            show: false,
          },
          value: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#394555',
            show: true,
            offsetY: 4,
          },
        },
      },
    },
    fill: {
      colors: ['#EC9C00'],
    },
  };

  return (
    <Box>
      <Header>
        <h5> {mst}</h5>
        <h6> WO: {wo}</h6>
      </Header>
      <Divider />
      {resetChart && (
        //@ts-ignore

        <Chart
          type="radialBar"
          height={120}
          options={options}
          series={series}
        />
      )}
      <Divider />
      <Bottom>
        <h5>
          {progressNumber
            ? `${t('radial-aft')} ${time} ${t('radial-before')}`
            : t('radial-dis')}
        </h5>
      </Bottom>
    </Box>
  );
}

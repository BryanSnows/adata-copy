import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { IFill, IRadialProgress } from './types';

export function RadialProgress({
  progressNumber,
  minium,
  text,
  height,
}: IRadialProgress) {
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
    chart: {
      events: {
        mounted: (chart) => {
          chart.windowResizeHandler();
        },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -360,
        endAngle: 0,
        hollow: {
          size: '60%',
        },
        track: {
          background: ['#D4445C'],
          strokeWidth: '90%',
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontWeight: '600',
            offsetY: 40,
            color: '#394555',
          },
          value: {
            fontSize: '46px',
            fontWeight: '600',
            color: '#4A4A4A',
            show: true,
            offsetY: 0,
          },
        },
      },
    },
    fill: {
      colors: ['#28C38D'],
    },
    labels: [text],
  };

  return (
    <>
      {resetChart && (
        //@ts-ignore
        <Chart
          type="radialBar"
          height={height}
          options={options}
          series={series}
        />
      )}
    </>
  );
}

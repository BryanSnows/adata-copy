import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

import { BarProps } from './types';

export function Bar({
  data,
  seriesName,
  categories,
  barWidth,
  title,
  onClickBar,
}: BarProps) {
  const series = [
    {
      name: seriesName,
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: 'basic-bar',
      events: {
        dataPointSelection(_e, _chart, option) {
          const dataPointIndex =
            option.selectedDataPoints[0].length > 0
              ? option.selectedDataPoints[0][0]
              : null;

          onClickBar && onClickBar(dataPointIndex);
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: barWidth ? barWidth : '70%',
      },
    },
    title: {
      text: title,
      style: {
        color: '#424c69',
        fontSize: '12px',
        fontWeight: '400',
      },
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      enabled: false,
    },
    fill: {
      colors: ['#428687'],
    },
  };

  return (
    <>
      {/* @ts-ignore */}
      <Chart type="line" height={375} options={options} series={series} />
    </>
  );
}

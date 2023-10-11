import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { IBar } from './types';

export function BarChart({ data, seriesName }: IBar) {
  const [resetChart, setResetChart] = useState(false);

  useEffect(() => {
    setResetChart(true);
    return () => {
      setResetChart(false);
    };
  }, [resetChart]);

  const seriesFake = [
    {
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      events: {
        mounted: (chart) => {
          chart.windowResizeHandler();
        },
      },
    },
    colors: [
      '#EC9C00',
      '#1EA7EA',
      '#05328D',
      '#EEE800',
      '#40A731',
      '#C70026',
      '#9E4394',
    ],

    plotOptions: {
      bar: {
        barHeight: '80%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      offsetX: -5,
      style: {
        fontFamily: 'Roboto',
        colors: ['#fff'],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val + '%';
      },
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: seriesName,
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (value) => {
          return `${value}` + '%';
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <>
      {resetChart && (
        //@ts-ignore

        <Chart type="bar" height={300} options={options} series={seriesFake} />
      )}
    </>
  );
}

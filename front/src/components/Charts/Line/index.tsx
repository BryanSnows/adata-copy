import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { LineProps } from './types';
import { useState } from 'react';

export function Line({ seriesData, categories, title, onFilter }: LineProps) {
  const [first, setFirst] = useState(true);

  const options: ApexOptions = {
    colors: [
      '#EC9C00',
      '#1EA7EA',
      '#05328D',
      '#EEE800',
      '#40A731',
      '#C70026',
      '#9E4394',
    ],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
      events: {
        legendClick: function (chartContext, seriesIndex, config) {
          if (first) {
            onFilter(seriesIndex);
            seriesData?.map((item: any, index: number) =>
              index !== seriesIndex
                ? chartContext.hideSeries(item?.name)
                : chartContext.showSeries(item?.name),
            );
            setFirst(false);
          } else {
            if (config?.globals?.seriesLog?.[seriesIndex].length <= 0) {
              onFilter(seriesIndex);
              seriesData?.map((item: any, index: number) =>
                index !== seriesIndex
                  ? chartContext.hideSeries(item?.name)
                  : chartContext.showSeries(item?.name),
              );
            } else {
              onFilter(null);
              seriesData?.map((item: any, index: number) =>
                chartContext.showSeries(item?.name),
              );
              setFirst(true);
            }
          }
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 600,
      },
      offsetY: 12,
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: seriesData?.map((item, index) =>
        item?.data.filter((data: number) => data > 0)?.length > 0
          ? index
          : null,
      ),
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      onItemClick: {
        toggleDataSeries: false,
      },
      itemMargin: {
        vertical: 15,
      },
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      max: 100,
      min: 0,
      labels: {
        formatter: (value) => {
          return seriesData.length > 0 ? `${value}` + '%' : ' ';
        },
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    },
  };

  return (
    <>
      {/* @ts-ignore */}
      <Chart
        type="line"
        height={'100%'}
        options={options}
        series={seriesData}
      />
    </>
  );
}

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Container } from './styles';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export interface IBar {
  dataChart: any;
  ocupation?: boolean;
  dashboard?: boolean;
  produtivity?: boolean;
  width?: string;
  widthMin?: string;
}

export function BarChart({
  dataChart,
  ocupation,
  dashboard,
  produtivity,
  width,
  widthMin,
}: IBar) {
  const { t } = useTranslation();

  const total = dataChart?.labels.length;

  const datasets = dataChart?.datasets.map((item: any) => ({
    ...item,
    label: `${t(item?.label)}`,
  }));
  const chartjs = { ...dataChart, datasets: datasets };

  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          beforeLabel: function (context, index) {
            let label = context.dataset.wo
              ? context.dataset.wo[context.dataIndex]
              : '';

            return dashboard ? 'WO: ' + label : null;
          },
          label: function (context: any) {
            let label = context.raw || '';
            let labelProd = context.dataset.label || '';
            let time = context.dataset.time
              ? context.dataset.time[context.dataIndex]
              : '';

            let chart = context.datasetIndex ? true : false;

            return produtivity
              ? labelProd + ': ' + label
              : ocupation
              ? `${t('chart-cap')}` + label
              : dashboard && chart
              ? `${t('chart-occup')}` + label + '%'
              : dashboard
              ? label +
                `${t('chart-concl')}` +
                `${t('radial-aft')} ` +
                time +
                ` ${t('radial-before')}`
              : null;
          },
          afterLabel: function (context: any) {
            let label = context.dataset.quantity
              ? context.dataset.quantity[context.dataIndex]
              : '';

            return dashboard ? `${t('chart-ssd')}` + label : null;
          },
        },
      },
      legend: {
        position: !ocupation ? ('top' as const) : ('bottom' as const),
        align: !ocupation ? ('start' as const) : ('center' as const),
        labels: {
          boxWidth: 26,
          boxHeight: 24,
          font: {
            size: 15,
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          display: true,
          autoSkip: false,
          callback: function (label: any) {
            return dashboard ? label + '%' : label;
          },
        },
        min: dashboard ? 0 : null,
        max: dashboard ? 100 : null,
      },
      x: {
        min: 0,
        max: total,
      },
    },
  };
  const legend = {
    id: 'legendPadding',
    beforeInit: function (chart: any) {
      const fitValue = chart.legend.fit;

      chart.legend.fit = function fit() {
        fitValue.bind(chart.legend)();
        return (this.height += 10);
      };
    },
  };

  const tableTwo = total > 7 ? `${1000 + (total - 7) * 110}px` : '100%';

  const controledWidth = total > 7 ? width : '100%';

  const controledWidthMin = total > 7 ? widthMin : '100%';

  return (
    <Container
      newWidth={width ? controledWidth : tableTwo}
      widthMin={controledWidthMin}
    >
      <Bar id="myChart" options={options} data={chartjs} plugins={[legend]} />
    </Container>
  );
}

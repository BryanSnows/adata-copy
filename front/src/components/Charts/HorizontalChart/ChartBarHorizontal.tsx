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
import { useTranslation } from 'react-i18next';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  fpy?: boolean;
}

export function BarChartHorizontal({ dataChart }: IBar) {
  const { t } = useTranslation();
  const options: any = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#ffff',
        font: {
          weight: 'bold',
          size: 13,
        },
        textStrokeColor: 'black',
      },
      tooltip: {
        xAlign: 'left',
        callbacks: {
          label: function (context) {
            return context?.dataset?.label + ': ' + context.raw + '%';
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          stepSize: 25,
          callback: function (label) {
            return label + '%';
          },
        },
        min: 0,
        max: 100,
      },
    },
  };
  const legend = {
    id: 'legendPadding',
    beforeInit: function (chart) {
      const fitValue = chart.legend.fit;

      chart.legend.fit = function fit() {
        fitValue.bind(chart.legend)();
        return (this.height += 10);
      };
    },
  };

  return (
    <div style={{ height: '75%', width: '100%' }}>
      <Bar
        id="myChart"
        options={options}
        data={dataChart}
        plugins={[ChartDataLabels]}
      />
    </div>
  );
}

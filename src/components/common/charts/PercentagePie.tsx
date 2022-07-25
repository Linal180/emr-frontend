/* This pie chart shows:
* Total number of Discharged patients and Total Appointments
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
export interface PieChartProps {
  total: number;
  completed: number;
  showText?: boolean;
  className?: string;
}

const PercentagePie: FC<PieChartProps> = ({ total, completed, className, showText }): JSX.Element => {
  const percentage = ((completed / total) * 100).toFixed(2) || 0.00
  const [chartOptions, setChartOptions] = useState({
    tooltip: { enabled: false },
    credits: { enabled: false },

    chart: {
      renderTo: 'container',
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      type: 'pie',
      marginTop: 0,
      spacingTop: 0,
    },

    title: {
      text: ``,
      align: 'center',
      verticalAlign: 'middle',
    },

    colors: ['#0BB783', '#3699FF'],

    borderWidth: 10,

    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },

    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: false
          }
        }
      },

      pie: {
        allowPointSelect: false,
        dataLabels: {
          enabled: false,
          distance: -10,
        },

        startAngle: -210,
        endAngle: 360,
        size: '60%',
      }
    },

    series: [{
      showInLegend: false,
      type: 'pie',
      name: 'Discharged Patients',
      innerSize: '65%',

      data: [
        ['appointments', 100],
        ['patients', 0],
      ],

      states: {
        hover: {
          enabled: false
        }
      }
    }],
  });

  const updateChart = useCallback(async () => {
    setChartOptions({
      ...chartOptions,
      title: { ...chartOptions.title, text: showText ? `${percentage}%` : '' },
      series: [{
        ...chartOptions.series[0], data: [
          ['appointments', total],
          ['patients', completed],
        ]
      }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])

  useEffect(() => {
    !!total && updateChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, updateChart])

  return (
    <Box className={className}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  )
};

export default PercentagePie;

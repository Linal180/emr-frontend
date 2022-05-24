/* This pie chart shows:
* Total number of users in a shift
* and is used in FACILITY-ADMIN only
*/

// packages block
import { FC, useState } from "react";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";

const PieChart3Component: FC = (): JSX.Element => {
  const [pieChart3] = useState(
    {
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
        text: '',
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
        name: 'Practices',
        innerSize: '65%',

        data: [
          ['total', 132],
          ['available', 70],
        ],

        states: {
          hover: {
            enabled: false
          }
        }
      }],
    });

  return (
    <Box className="chartContainerSmall">
      <HighchartsReact highcharts={Highcharts} options={pieChart3} />
    </Box>
  )
};

export default PieChart3Component;

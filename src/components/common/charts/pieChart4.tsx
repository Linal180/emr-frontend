/* This pie chart shows:
* Total number of Discharged patients and Total Appointments
*/

// packages block
import { FC, useState } from "react";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";

const PieChart4Component: FC = (): JSX.Element => {
  const [pieChart4] = useState(
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
        text: '12.5%',
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
          ['appointments', 24],
          ['patients', 3],
        ],

        states: {
          hover: {
            enabled: false
          }
        }
      }],
    });

  return (
    <Box className="chartContainer">
      <HighchartsReact highcharts={Highcharts} options={pieChart4} />
    </Box>
  )
};

export default PieChart4Component;

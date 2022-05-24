/* This bar chart shows:
* Practice registrations
* and is for SUPER-ADMIN only
*/

// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";

const BarChart2Component: FC = (): JSX.Element => {
  const [barChart2] = useState({
    credits: { enabled: false },

    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: "#ffffff",
      marginBottom: 40,
    },

    title: {
      text: '',
    },

    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],

      crosshair: false
    },

    yAxis: {
      className: 'highcharts-color-0',
      min: 0,
      title: {
        text: ''
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },

    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: false
          }
        }
      },

      column: {
        pointPadding: 0.1,
        borderWidth: 0,
        color: '#E9EDFA',
        borderRadius: 4,
      },
    },

    series: [
      {
        name: '',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#E9EDFA',
      },
    ]
  });

  return (
    <Box className="barChart2Container">
      <HighchartsReact highcharts={Highcharts} options={barChart2} />
    </Box>
  )
};

export default BarChart2Component;

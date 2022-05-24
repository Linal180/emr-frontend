/* This bar chart shows:
* Total number of Users against each Practice
* and is for SUPER-ADMIN only
*/

// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";

const BarChart1Component: FC = (): JSX.Element => {
  const [barChart1] = useState({
    credits: { enabled: false },
    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: "#21E1D8",
      marginBottom: 40,
    },

    title: {
      text: '',
    },

    xAxis: {
      categories: [
        'Our Lady’s Hospital',
        'University Hospital Kerry',
        'Mercy University Hospital',
        'Cavan General Hospital',
        'County Hospital',
        'Horizon Eye Care Center',
        'Best Hospital'
      ],
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
        pointPadding: 0.4,
        borderWidth: 0,
        color: '#ffffff',
        borderRadius: 4,
      }
    },

    series: [{
      name: '',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
      color: '#ffffff',
    }]
  });

  return (
    <Box className="barChart1Container">
      <HighchartsReact highcharts={Highcharts} options={barChart1} />
    </Box>
  )
};

export default BarChart1Component;

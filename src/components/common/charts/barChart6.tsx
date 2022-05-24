// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";

const BarChart6Component: FC = (): JSX.Element => {
  const [barChart6] = useState({
    credits: { enabled: false },

    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: "#FF6A7A",
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

      ],

      crosshair: false,
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
      data: [49.9, 71.5, 106.4, 129.2, 144.0],
      color: '#ffffff',
    }]
  });

  return (
    <Box className="practice-chart-container">
      <HighchartsReact highcharts={Highcharts} options={barChart6} />
    </Box>
  )
};

export default BarChart6Component;

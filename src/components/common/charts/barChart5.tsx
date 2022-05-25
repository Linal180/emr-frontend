/* This bar chart shows:
* Total number of Users against each Role
* and is for PRACTICE-ADMIN only
*/

// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";

const BarChart5Component: FC = (): JSX.Element => {
  const [barChart5] = useState({
    credits: { enabled: false },

    chart: {
      type: 'bar',
      backgroundColor: '#A075F8'
    },

    title: {
      text: ''
    },

    subtitle: {
      text: '',
    },

    xAxis: {
      categories: ['Patient', 'Doctor', 'Front Desk', 'Technician', 'Accountant', 'Nurse', 'Administion Manager'],
      title: {
        text: null
      },
    },

    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)',
        align: 'high',
        enabled: false
      },

      labels: {
        overflow: 'justify'
      }
    },

    tooltip: {
      valueSuffix: ' millions',
      enabled: false
    },

    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false
        }
      }
    },

    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      shadow: false,
      hide: true,
      enabled: false
    },

    series: [{
      data: [2000, 0, 0, 0, 0, 0, 0],
      color: '#ffffff'
    },

    {
      data: [0, 1345, 0, 0, 0, 0, 0],
      color: '#ffffff'
    },

    {
      data: [0, 0, 3000, 0, 0, 0, 0],
      color: '#ffffff'
    },

    {
      data: [0, 0, 0, 1738, 0, 0, 0],
      color: '#ffffff'
    },

    {
      data: [0, 0, 0, 0, 2240, 0, 0],
      color: '#ffffff'
    },

    {
      data: [0, 0, 0, 0, 0, 2901, 0],
      color: '#ffffff'
    },

    {
      data: [0, 0, 0, 0, 0, 0, 1288],
      color: '#ffffff'
    }]
  });

  return (
    <Box className="barChart5Container">
      <HighchartsReact highcharts={Highcharts} options={barChart5} />
    </Box>
  )
};

export default BarChart5Component;

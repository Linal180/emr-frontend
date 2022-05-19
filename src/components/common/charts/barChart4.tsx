// packages block
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";

import { FC, useState } from "react";
const BarChart4Component: FC = (): JSX.Element => {
  const [barChart4] = useState({
    credits: { enabled: false },
    chart: {
        type: 'column',
        styledMode: false,
        backgroundColor: "#21E1D8",

    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [
            'Our Lady’s Hospital',
            'Eye Care Center',
            'ENT Department',
            'City Cardiology',
            'Lady’s General Hospital', 
          ],
        crosshair: true
    },
    yAxis: {
        min: 10,
        max : 1000,
        title: {
            text: 'Rainfall (mm)'
        },
        color :'#fffff'
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
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            borderTopRadius : 10,
            color: '#ffffff',
        }
    },
    series: [{
        name: 'Patients',
        data: [888.9, 911.5, 706.4, 911.5, 706.4],
        color: '#204ECF',
    }, {
        name: 'Doctor',
        data: [283.6, 870.5, 898.3, 870.5, 898.3],
        color: '#FFC700',

    }, {
        name: 'Staff',
        data: [248.9, 850.5, 679.3, 850.5, 679.3],
        color: '#7E22CE',
    }]
  });

  return (
    <Box className="barChart4Container">
      <HighchartsReact highcharts={Highcharts} options={barChart4} />
    </Box>
  )
};

export default BarChart4Component;

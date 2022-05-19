// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
// constant
import { PRACTICES } from "../../../constants";

const PieChart2Component: FC = (): JSX.Element => {
  const [pieChart2] = useState(
    {
      tooltip: { enabled: true },

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
        text: 'Claim Ratio',
        align: 'center',
        verticalAlign: 'middle',
      },

      colors: ['#0BB783', '#3699FF', '#F64E60'],

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
          startAngle: -90,
          endAngle: 90,
          size: '80%',
        }
      },

      series: [{
        showInLegend: false,
        type: 'pie',
        name: 'ClaimRatio',
        innerSize: '85%',
        data: [
          ['active', 50],
          ['inactive', 30],
          ['noninactive', 20],
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
      <HighchartsReact highcharts={Highcharts} options={pieChart2} />
    </Box>
  )
};

export default PieChart2Component;

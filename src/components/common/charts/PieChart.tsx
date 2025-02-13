/* This pie chart shows:
* Total number of Active and In-Active Practices
* and is for SUPER-ADMIN only
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
// constant
import { PRACTICES } from "../../../constants";
import { PieChartProps } from "../../../interfacesTypes";

const PieChart: FC<PieChartProps> = ({ activePractices, inactivePractices }): JSX.Element => {
  const [pieChart1, setPieChart1] = useState(
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
        text: PRACTICES,
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
        innerSize: '85%',

        data: [
          ['active', 0],
          ['inactive', 0],
        ],

        states: {
          hover: {
            enabled: false
          }
        }
      }],
    });

  const setPieChartValue = useCallback(() => {
    setPieChart1((prev) => ({
      ...prev,
      series: [{
        ...prev.series, data: [['active', activePractices ?? 0],
        ['inactive', inactivePractices ?? ""],], showInLegend: false,
        type: 'pie',
        name: 'Practices',
        innerSize: '85%', states: {
          hover: {
            enabled: false
          }
        }
      }],
    }))
  }, [activePractices, inactivePractices])

  useEffect(() => {
    setPieChartValue()
  }, [setPieChartValue])

  return (
    <Box className="chartContainer">
      <HighchartsReact highcharts={Highcharts} options={pieChart1} />
    </Box>
  )
};

export default PieChart;

// packages block
import { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";


import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// component
import PracticesTableComponent from "./tables/practicesTable";
// svgs block
import { BillingCardIcon, PlusRoundIcon, RedirectIcon } from "../../../assets/svgs";
// constant
import { CREATE_PRACTICE, PRACTICES, QUICK_ACTIONS, TOTAL_TEXT, VIEW_BILLING } from "../../../constants";
// styles
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { WHITE } from "../../../theme";

const SuperAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  const [basicBarChartOptions] = useState({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Monthly Average Rainfall'
    },
    subtitle: {
      text: 'Source: WorldClimate.com'
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
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Rainfall (mm)'
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Tokyo',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }]
  })

  const [basicBarTwoChartOptions] = useState({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Monthly Average Rainfall'
    },
    subtitle: {
      text: 'Source: WorldClimate.com'
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
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Rainfall (mm)'
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Tokyo',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }]
  })

  const [piechart] = useState(
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
        text: 'Practices',
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
          enableMouseTracking: false
        },
        pie: {
          allowPointSelect: false,
          dataLabels: {
            enabled: false,
            distance: -10,
          },
          startAngle: -230,
          endAngle: 360,
          size: '60%',

        }
      },
      series: [{
        showInLegend: false,
        type: 'pie',
        name: 'Practices',
        innerSize: '80%',
        minSize: 80,
        data: [
          ['active', 90],
          ['inactive', 10],
        ],
        states: {
          hover: {
            enabled: false
          }
        }
      }],
    });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box px={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{PRACTICES}</Typography>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <Box p={1}>
              <PracticesTableComponent />
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box>
              <HighchartsReact highcharts={Highcharts} options={basicBarChartOptions} />
            </Box>
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box display='flex' justifyContent='center' className={classes.cardContainer}>
              <Box className={classes.cardBox}>
                <PlusRoundIcon />
                <Typography variant="h6">{CREATE_PRACTICE}</Typography>
              </Box>

              <Box p={2} />

              <Box className={classes.cardBox}>
                <BillingCardIcon />
                <Typography variant="h6">{VIEW_BILLING}</Typography>
              </Box>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant="h5">{PRACTICES}</Typography>
                <Box p={0.5} />
                <Typography variant="body2">26 {TOTAL_TEXT}</Typography>
              </Box>

              <IconButton>
                <RedirectIcon />
              </IconButton>
            </Box>

            <Box>
              <HighchartsReact highcharts={Highcharts} options={piechart} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box p={2} />

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Card>
            <Box>
              <HighchartsReact highcharts={Highcharts} options={basicBarChartOptions} />
            </Box>
          </Card>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Card>
            <Box>
              <HighchartsReact highcharts={Highcharts} options={basicBarTwoChartOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default SuperAdminDashboardComponent;

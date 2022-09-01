/* This bar chart shows:
* Total number of Users against each Role in a Practice
* and is for PRACTICE-ADMIN only
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { pluck } from "underscore";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
// utils, interfaces and graphql block
import { PURPLE_TWO, WHITE } from "../../../theme";
import { practiceChartOptions } from "../../../utils";
import { PracticeChartProps } from "../../../interfacesTypes";
import { useGetPracticeUserRolesCountLazyQuery } from "../../../generated/graphql";

const PracticeUserRoles: FC<PracticeChartProps> = ({ practiceId }): JSX.Element => {
  const { credits, title, subtitle } = practiceChartOptions(PURPLE_TWO)

  const [chartOptions, setChartOptions] = useState<any>({
    credits, title, subtitle,
    chart: {
      type: 'bar',
      backgroundColor: PURPLE_TWO,
    },

    xAxis: {
      categories: [],
      title: {
        text: null
      },
    },

    yAxis: {
      min: 0,
      title: {
        text: 'Users',
        enabled: false,
      },

      labels: {
        overflow: 'justify',
      }
    },

    tooltip: {
      valueSuffix: '--',
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
      backgroundColor: WHITE,
      shadow: false,
      hide: true,
      enabled: false
    },

    series: [{
      data: [],
      color: WHITE
    }]
  });

  const [findPracticeUserRoleCount] = useGetPracticeUserRolesCountLazyQuery({
    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { getUsersWithRoles } = data

        if (getUsersWithRoles) {
          const { response, userRoles } = getUsersWithRoles

          if (response) {
            const { status } = response

            if (userRoles && status && status === 200) {
              const roles = pluck(userRoles, 'role')
              const counts = pluck(userRoles, 'count')

              setChartOptions({
                ...chartOptions,
                xAxis: { ...chartOptions.xAxis, categories: roles as string[] },
                series: [
                  { ...chartOptions.series, data: counts },
                ],
              })
            }
          }
        }
      }
    }
  })

  const fetchPracticeUserRoleCount = useCallback(async () => {
    try {
      practiceId && await findPracticeUserRoleCount({
        variables: { usersWithRolesInputs: { practiceId } }
      })
    } catch (error) { }
  }, [findPracticeUserRoleCount, practiceId])

  useEffect(() => {
    fetchPracticeUserRoleCount()
  }, [fetchPracticeUserRoleCount])

  return (
    <Box className="practice-users-roles-container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  )
};

export default PracticeUserRoles;

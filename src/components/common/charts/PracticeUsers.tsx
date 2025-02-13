// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { pluck } from "underscore";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts";
// constants and graphql
import { BLUE_TEN, WHITE } from "../../../theme";
import { practiceChartOptions } from "../../../utils";
import { useGetPracticeUserLazyQuery } from "../../../generated/graphql";

const PracticeUsers: FC = (): JSX.Element => {
  const { chart, credits, plotOptions, title, tooltip, yAxis } = practiceChartOptions(BLUE_TEN)
  const [chartOptions, setChartOptions] = useState<any>({
    credits, chart, title, yAxis, tooltip, plotOptions,

    xAxis: {
      categories: [],
    },

    series: [{
      name: '',
      data: undefined,
      color: WHITE,
    } as SeriesOptionsType]
  });

  const [getPracticeUsers] = useGetPracticeUserLazyQuery({
    onError() { },

    onCompleted(data) {
      const { getPracticesUser } = data || {};

      if (getPracticesUser) {
        const { response, practiceUsers } = getPracticesUser

        if (response) {
          const { status } = response

          if (practiceUsers && status && status === 200) {
            const practiceName = pluck(practiceUsers, 'name') || ['']
            const usersCount = pluck(practiceUsers, 'userCount') || []

            !!usersCount.length && usersCount.length > 10 && setChartOptions({
              ...chartOptions, series: { ...chartOptions.series, data: usersCount },
              xAxis: { ...chartOptions.xAxis, categories: practiceName as string[] }
            })
          }
        }
      }
    }
  });

  const fetchPracticeUser = useCallback(async () => {
    await getPracticeUsers()
  }, [getPracticeUsers])

  useEffect(() => {
    fetchPracticeUser()
  }, [fetchPracticeUser])

  return (
    <Box className="practice-bar-chart-container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  )
};

export default PracticeUsers;

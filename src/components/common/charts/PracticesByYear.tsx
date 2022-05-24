// packages block
import { FC, useState, useCallback, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts";
import { Box } from "@material-ui/core";
import { WHITE } from "../../../theme";
import { MONTHS } from "../../../constants";
import { practiceChartOptions } from "../../../utils";
import { useGetPracticeByYearLazyQuery } from "../../../generated/graphql";
import { pluck } from "underscore";

export interface PracticesByYearProps {
  year: string;
}
const PracticesByYear: FC<PracticesByYearProps> = ({ year }): JSX.Element => {
  const { chart, credits, plotOptions, title, tooltip, yAxis } = practiceChartOptions(WHITE)

  const [chartOptions, setChartOptions] = useState<any>({
    credits, chart, title, yAxis, tooltip, plotOptions,

    xAxis: {
      categories: MONTHS,
      crosshair: false
    },

    series: [{
      name: '',
      data: undefined,
      color: '#E9EDFA',
    } as SeriesOptionsType]
  });

  const [getPracticesByYear, { loading }] = useGetPracticeByYearLazyQuery({
    onError() { },

    onCompleted(data) {
      const { getPracticesViaDate } = data || {};

      if (getPracticesViaDate) {
        const { response, practices } = getPracticesViaDate

        if (response) {
          const { status } = response

          if (practices && status && status === 200) {
            const practiceName = pluck(practices, 'name') || ['']
            let facilitiesCount: number[] = []
            facilitiesCount = (pluck(practices, 'count') || []) as number[]

            setChartOptions({
              ...chartOptions, series: { ...chartOptions.series, data: facilitiesCount },
              xAxis: { ...chartOptions.xAxis, categories: practiceName as string[] }
            })
          }
        }
      }
    }
  });

  const fetchPracticesByYear = useCallback(async () => {
    await getPracticesByYear({ 
      variables: { practicesViaDateInputs: { date: parseInt(year) }}
    })
  }, [getPracticesByYear, year])

  useEffect(() => {
    fetchPracticesByYear()
  }, [fetchPracticesByYear, year])

  return (
    <>
      {!loading &&
        <Box className="barChart2Container">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      }
    </>
  )
};

export default PracticesByYear;

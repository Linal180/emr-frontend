// packages block
import { FC, useState, useCallback, useEffect, useRef } from "react";
import { pluck } from "underscore";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts";
// constants, utils and graphql block
import { WHITE } from "../../../theme";
import { MONTHS } from "../../../constants";
import { practiceChartOptions } from "../../../utils";
import { dashboardInputsProps } from "../../../interfacesTypes";
import { useGetPracticeByYearLazyQuery } from "../../../generated/graphql";

const PracticesByYear: FC<dashboardInputsProps> = ({ year }): JSX.Element => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
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

    async onCompleted(data) {
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

            chartRef.current?.chart.redraw()
          }
        }
      }
    }
  });

  const fetchPracticesByYear = useCallback(async () => {
    try {
      const { name: selectedYear } = year || {}

      !!selectedYear && !!parseInt(selectedYear) && await getPracticesByYear({
        variables: { practicesViaDateInputs: { date: parseInt(selectedYear) } }
      })
    } catch (error) { }
  }, [getPracticesByYear, year])

  useEffect(() => {
    fetchPracticesByYear()
  }, [fetchPracticesByYear, year])

  return (
    <>
      {!loading &&
        <Box className="barChart2Container">
          <HighchartsReact ref={chartRef} highcharts={Highcharts} options={chartOptions} updateArgs={[true, true, true]} />
        </Box>
      }
    </>
  )
};

export default PracticesByYear;

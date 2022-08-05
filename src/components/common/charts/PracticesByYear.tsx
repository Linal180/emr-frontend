// packages block
import { FC, useState, useCallback, useEffect } from "react";
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
  const { chart, credits, plotOptions, title, yAxis } = practiceChartOptions(WHITE)

  const [chartOptions, setChartOptions] = useState<any>({
    credits, chart, title, yAxis, plotOptions,

    tooltip: {
      valueDecimals: 0,
      valueSuffix: ' practices',
      pointFormat: '{point.y}'
    },

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

  const [getPracticesByYear] = useGetPracticeByYearLazyQuery({
    onError() { },

    async onCompleted(data) {
      const { getPracticesByYear } = data || {};

      if (getPracticesByYear) {
        const { response, practices } = getPracticesByYear

        if (response) {
          const { status } = response

          if (practices && status && status === 200) {
            const practiceName = pluck(practices, 'name') || ['']
            let facilitiesCount: number[] = []
            facilitiesCount = (pluck(practices, 'count') || []) as number[]

            setChartOptions({
              ...chartOptions,
              xAxis: { ...chartOptions.xAxis, categories: practiceName as string[] },
              series: [{ ...chartOptions.series, data: facilitiesCount, color: '#E9EDFA', name: '' }],
            })
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
    <Box className="barChart2Container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  )
};

export default PracticesByYear;

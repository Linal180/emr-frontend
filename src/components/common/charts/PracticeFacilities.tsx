/* This bar chart shows:
* All Practices name
* Facility count against each Practice
* and is for SUPER-ADMIN only
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { pluck } from "underscore";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts";
// constants and graphql block
import { WHITE } from "../../../theme";
import { practiceChartOptions } from "../../../utils";
import { useGetPracticeFacilitiesLazyQuery } from "../../../generated/graphql";

const PracticeFacilities: FC = (): JSX.Element => {
  const { chart, credits, plotOptions, title, tooltip, yAxis } = practiceChartOptions('#A075F8')

  const [chartOptions, setChartOptions] = useState<any>({
    credits, chart, title, yAxis, tooltip, plotOptions,
    xAxis: {
      categories: [],
      crosshair: false,
    },

    series: [{
      name: '',
      data: undefined,
      color: WHITE,
    } as SeriesOptionsType]
  });

  const [getPracticeFacilities, { loading }] = useGetPracticeFacilitiesLazyQuery({
    onError() { },

    onCompleted(data) {
      const { getPracticesFacilities } = data || {};

      if (getPracticesFacilities) {
        const { response, practiceFacilities } = getPracticesFacilities

        if (response) {
          const { status } = response

          if (practiceFacilities && status && status === 200) {
            const practiceName = pluck(practiceFacilities, 'name') || ['']
            let facilitiesCount: number[] = []
            facilitiesCount = (pluck(practiceFacilities, 'facility') || []) as number[]

            setChartOptions({
              ...chartOptions, series: { ...chartOptions.series, data: facilitiesCount },
              xAxis: { ...chartOptions.xAxis, categories: practiceName as string[] }
            })
          }
        }
      }
    }
  });

  const fetchPracticeFacilities = useCallback(async () => {
    await getPracticeFacilities()
  }, [getPracticeFacilities])

  useEffect(() => {
    fetchPracticeFacilities()
  }, [fetchPracticeFacilities])

  return (
    <>
      {!loading &&
        <Box className="practice-bar-chart-container">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      }
    </>
  )
};

export default PracticeFacilities;

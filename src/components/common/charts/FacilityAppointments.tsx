/* This bar chart shows:
* Total number of Appointments against each Facility
* and is for PRACTICE-ADMIN only
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { pluck } from "underscore";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
// constants, interfaces and graphql block
import { WHITE } from "../../../theme";
import { practiceChartOptions } from "../../../utils";
import { PracticeChartProps } from "../../../interfacesTypes";
import { useGetPracticeFacilityAppointmentsLazyQuery } from "../../../generated/graphql";

const FacilityAppointments: FC<PracticeChartProps> = ({ practiceId }): JSX.Element => {
  const { credits, chart, yAxis, title, tooltip, plotOptions } = practiceChartOptions("#FF6A7A")
  const [chartOptions, setChartOptions] = useState<any>({
    credits, chart, yAxis, plotOptions, title, tooltip,
    xAxis: {
      categories: [],
      crosshair: false,
    },

    series: [{
      name: '',
      data: [],
      color: WHITE,
    }]
  });

  const [findPracticeFacilityAppointments, { loading }] = useGetPracticeFacilityAppointmentsLazyQuery({
    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { getPracticeFacilityAppointments } = data

        if (getPracticeFacilityAppointments) {
          const { response, facilitiesAppointments } = getPracticeFacilityAppointments

          if (response) {
            const { status } = response

            if (facilitiesAppointments && status && status === 200) {
              const facilities = pluck(facilitiesAppointments, 'facility')
              const appointmentCount = pluck(facilitiesAppointments, 'count')

              setChartOptions({
                ...chartOptions,
                xAxis: { ...chartOptions.xAxis, categories: facilities as string[] },
                series: [
                  { ...chartOptions.series, data: appointmentCount }
                ],
              })
            }
          }
        }
      }
    }
  })

  const fetchPracticeFacilityAppointments = useCallback(async () => {
    try {
      practiceId && await findPracticeFacilityAppointments({
        variables: { practiceFacilityAppointmentsInputs: { practiceId } }
      })
    } catch (error) { }
  }, [findPracticeFacilityAppointments, practiceId])

  useEffect(() => {
    fetchPracticeFacilityAppointments()
  }, [fetchPracticeFacilityAppointments])

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

export default FacilityAppointments;

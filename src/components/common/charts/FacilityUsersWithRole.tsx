/* This bar chart shows:
* Total number of Users against each Practice
* and is for PRACTICE-ADMIN only
*/

// packages block
import { FC, useCallback, useEffect, useState } from "react";
import Highcharts from "highcharts";
import { Box } from "@material-ui/core";
import HighchartsReact from "highcharts-react-official";
// constants and utils block
import { practiceChartOptions, getPracticeFacilityUsersData } from "../../../utils";
import { BLUE, VERY_MILD, WHITE } from "../../../theme";
import { PracticeRolesTypes, useGetPracticeUsersWithRolesLazyQuery } from "../../../generated/graphql";
import { PracticeChartProps } from "../../../interfacesTypes";

const FacilityUsersWithRole: FC<PracticeChartProps> = ({ practiceId }): JSX.Element => {
  const { credits, title, tooltip } = practiceChartOptions('#21E1D8')

  const [chartOptions, setChartOptions] = useState<any>({
    credits, title,
    tooltip,
    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: "#21E1D8",
    },

    xAxis: {
      categories: [],
      crosshair: true
    },

    yAxis: {
      min: 10,
      max: 1000,

      title: {
        text: 'Rainfall (mm)'
      },

      color: WHITE
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderTopRadius: 10,
        color: WHITE,
      }
    },

    series: [
      {
        name: 'Patients',
        data: [],
        color: BLUE,
      },

      {
        name: 'Doctors',
        data: [],
        color: VERY_MILD,
      },

      {
        name: 'Staff',
        data: [],
        color: '#7E22CE',
      }
    ]
  });

  const [findPracticeUsersWithRoles, { loading }] = useGetPracticeUsersWithRolesLazyQuery({
    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { getPracticeFacilitiesUsersWithRoles } = data

        if (getPracticeFacilitiesUsersWithRoles) {
          const { response, practiceUsers } = getPracticeFacilitiesUsersWithRoles

          if (response) {
            const { status } = response

            if (practiceUsers && status && status === 200) {
              const { facilityNames, doctorCount, patientCount, staffCount }
                = getPracticeFacilityUsersData(practiceUsers)

              setChartOptions({
                ...chartOptions,
                xAxis: { ...chartOptions.xAxis, categories: facilityNames as string[] },
                series: [
                  { ...chartOptions.series[0], data: patientCount },
                  { ...chartOptions.series[1], data: doctorCount },
                  { ...chartOptions.series[2], data: staffCount }
                ],
              })
            }
          }
        }
      }
    }
  })

  const fetchPracticeUsers = useCallback(async () => {
    try {
      practiceId && await findPracticeUsersWithRoles({
        variables: {
          practiceFacilitiesUsersInputs: {
            practiceId,
            roles: [PracticeRolesTypes.Doctor, PracticeRolesTypes.Patient]
          }
        }
      })
    } catch (error) { }
  }, [findPracticeUsersWithRoles, practiceId])

  useEffect(() => {
    fetchPracticeUsers();
  }, [fetchPracticeUsers])

  return (
    <>
      {!loading &&
        <Box className="practice-users-chart-container">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
      }
    </>
  )
};

export default FacilityUsersWithRole;

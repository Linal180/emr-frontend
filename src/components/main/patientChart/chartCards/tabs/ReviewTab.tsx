import { Box, Card, colors, Typography } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ALLERGIES_TEXT, DASHES, DIAGNOSES, INTAKE, MEDICATIONS } from '../../../../../constants'
import { PatientVitals, useGetPatientChartingReviewLazyQuery } from '../../../../../generated/graphql'
import { ParamsType, PatientChartingReview, ReviewTabProps } from '../../../../../interfacesTypes'
import { useChartingStyles } from '../../../../../styles/chartingStyles'
import AppointmentReason from './AppointmentReason'

function ReviewTab({ shouldShowAdd }: ReviewTabProps) {
  const classes = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [patientChartingReview, setPatientChartingReview] = useState<PatientChartingReview | null>(null)

  const [getPatientChartingReview] = useGetPatientChartingReviewLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientChartingReview(null)
    },

    onCompleted(data) {
      if (data) {
        const { getPatientChartingReview } = data;

        if (getPatientChartingReview) {
          const { response, patientAllergies, patientMedications, patientProblems, patientVitals } = getPatientChartingReview

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              setPatientChartingReview({
                patientAllergies, patientMedications, patientProblems, patientVitals
              } as PatientChartingReview)
            }
          }
        }
      }
    }
  })

  const fetchPatientChartingView = useCallback(() => {
    try {
      getPatientChartingReview({
        variables: {
          patientChartingReviewInput: {
            appointmentId,
            patientId
          }
        }
      })
    } catch (error) { }
  }, [appointmentId, getPatientChartingReview, patientId])

  useEffect(() => {
    fetchPatientChartingView()
  }, [fetchPatientChartingView])

  const { patientAllergies, patientMedications, patientProblems, patientVitals } = patientChartingReview || {}

  const latestPatientVitals = patientVitals?.sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))?.[0] || {}

  return (
    <div>
      <AppointmentReason shouldShowAdd />

      <Box m={2} />

      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{INTAKE}</Typography>
          </Box>
          <Box m={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h4'>{'Vitals'}</Typography>
            {Object.keys(latestPatientVitals as PatientVitals).map(vital => {
              if (['patientTemperature', 'systolicBloodPressure', 'diastolicBloodPressure', 'respiratoryRate', 'PatientBMI'].includes(vital)) {
                return (
                  <Box display="flex" alignItems="center">
                    <Typography variant='body1'>{vital}</Typography>
                    <Box p={2} />
                    <Typography variant='body2'>{(latestPatientVitals as PatientVitals)[vital as keyof PatientVitals] || DASHES}</Typography>
                  </Box>
                )
              }

              return <></>
            })}

          </Box>
          <Box m={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h4'>{DIAGNOSES}</Typography>
            <Box p={0.5} />
            {!patientProblems?.length ? <Box mb={1}>
              <Typography variant='body2'>{'None Recorded'}</Typography>
            </Box> : patientProblems.map(problem => {
              const { ICDCode } = problem
              return (
                <Box mb={1}>
                  <Typography variant='body2'>{ICDCode?.description || DASHES}</Typography>
                </Box>
              )
            })}
          </Box>
          <Box m={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h4'>{MEDICATIONS}</Typography>
            <Box p={0.5} />
            {!patientMedications?.length ? <Box mb={1}>
              <Typography variant='body2'>{'None Recorded'}</Typography>
            </Box> : patientMedications.map(patientMedication => {
              const { medication } = patientMedication || {}
              const { fullName } = medication || {}
              return (
                <Box mb={1}>
                  <Typography variant='body2'>{fullName || DASHES}</Typography>
                </Box>
              )
            })}
          </Box>
          <Box m={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h4'>{ALLERGIES_TEXT}</Typography>
            <Box p={0.5} />
            {!patientAllergies?.length ? <Box mb={1}>
              <Typography variant='body2'>{'None Recorded'}</Typography>
            </Box> : patientAllergies.map(patientAllergy => {
              const { allergy } = patientAllergy || {}
              const { name } = allergy || {}
              return (
                <Box mb={1}>
                  <Typography variant='body2'>{name || DASHES}</Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Card>

    </div>
  )
}

export default ReviewTab
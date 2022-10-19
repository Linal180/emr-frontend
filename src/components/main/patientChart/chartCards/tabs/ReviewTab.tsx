import { Box, Card, colors, Typography } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
//components blocks
import AppointmentReason from './AppointmentReason'
import TriageNoteTab from './TriageNotesListing'
//constants, style, interface, graphql
import { useChartingStyles } from '../../../../../styles/chartingStyles'
import { ALLERGIES_TEXT, DASHES, DIAGNOSES, INTAKE, MEDICATIONS, PATIENT_HISTORY_ILLNESS_TEXT, REVIEW_OF_SYSTEM_TEXT } from '../../../../../constants'
import { ParamsType, PatientChartingReview, ReviewTabProps } from '../../../../../interfacesTypes'
import { PatientIllnessHistoryPayload, PatientVitals, ReviewOfSystemPayload, useGetPatientChartingReviewLazyQuery, usePatientIllnessHistoryLazyQuery, useReviewOfSystemLazyQuery } from '../../../../../generated/graphql'


function ReviewTab({ shouldShowCheckout, handleStepChange, shouldDisableEdit, shouldShowAdd, shouldShowExamDetails }: ReviewTabProps) {
  const classes = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [patientChartingReview, setPatientChartingReview] = useState<PatientChartingReview | null>(null)
  const [reviewOfSystem, setReviewOfSystem] = useState<ReviewOfSystemPayload['reviewOfSystem']>(null)
  const [patientIllnessHistory, setPatientIllnessHistory] = useState<PatientIllnessHistoryPayload['patientIllnessHistory']>(null)

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

  const [patientReviewOfSystem] = useReviewOfSystemLazyQuery({
    onCompleted: (data) => {
      const { reviewOfSystem: dataResponse } = data || {}
      const { response, reviewOfSystem } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setReviewOfSystem(reviewOfSystem as ReviewOfSystemPayload['reviewOfSystem'])

      }
    },
    onError: () => { }
  })

  const fetchPatientReviewOfSystem = useCallback(async () => {
    appointmentId && await patientReviewOfSystem({
      variables: {
        reviewOfSystemInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [patientReviewOfSystem, appointmentId])

  const [getPatientIllnessHistory] = usePatientIllnessHistoryLazyQuery({
    onCompleted: (data) => {
      const { patientIllnessHistory: dataResponse } = data || {}
      const { response, patientIllnessHistory } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setPatientIllnessHistory(patientIllnessHistory as PatientIllnessHistoryPayload['patientIllnessHistory'])
      }
    },
    onError: () => { }
  })

  const fetchPatientIllnessHistory = useCallback(async () => {
    appointmentId && await getPatientIllnessHistory({
      variables: {
        patientIllnessHistoryInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [getPatientIllnessHistory, appointmentId])

  useEffect(() => {
    if (shouldShowExamDetails) {
      fetchPatientIllnessHistory()
      fetchPatientReviewOfSystem()
    }
  }, [fetchPatientIllnessHistory, fetchPatientReviewOfSystem, shouldShowExamDetails])

  const { patientAllergies, patientMedications, patientProblems, patientVitals } = patientChartingReview || {}

  const latestPatientVitals = patientVitals?.sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))?.[0] || {}

  return (
    <div>
      <AppointmentReason shouldShowAdd={shouldShowAdd} shouldShowCheckout={shouldShowCheckout} handleStepChange={handleStepChange} shouldDisableEdit={shouldDisableEdit} />

      <Box mt={2} />

      {!shouldShowCheckout && <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />}

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

      {shouldShowExamDetails && <>
        <Box m={3} />
        <Card>
          <Box pb={2} className={classes.cardBox}>
            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h3'>{PATIENT_HISTORY_ILLNESS_TEXT}</Typography>
            </Box>

            <Box p={2}>
              {patientIllnessHistory?.answers?.map(answerInfo => {
                const { answer, value } = answerInfo || {}
                const { name } = answer || {}

                return <>
                  <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                    <Box>
                      {!value ? <Typography variant='inherit'>{name}</Typography> :
                        <Box display="flex" flexDirection="row"><Typography>{`${name?.split("fill")[0]} ${value} `}</Typography> &nbsp;<Typography>{name?.split("fill")[1]}</Typography></Box>
                      }
                    </Box>
                  </Box>
                </>
              })}
            </Box>
          </Box>
        </Card>
        <Box m={3} />
        <Card>
          <Box pb={2} className={classes.cardBox}>
            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h3'>{REVIEW_OF_SYSTEM_TEXT}</Typography>
            </Box>

            <Box p={2}>
              {reviewOfSystem?.answers?.map(answerInfo => {
                const { answer, value } = answerInfo || {}
                const { name, } = answer || {}

                return <>
                  <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                    <Box>
                      {!value ? <Typography variant='inherit'>{name}</Typography> :
                        <Box display="flex" flexDirection="row"><Typography>{`${name?.split("fill")[0]} ${value} `}</Typography>&nbsp;<Typography>{name?.split("fill")[1]}</Typography></Box>
                      }

                    </Box>
                  </Box>
                </>
              })}
            </Box>
          </Box>
        </Card>
        <Box m={3} />
      </>}

    </div>
  )
}

export default ReviewTab
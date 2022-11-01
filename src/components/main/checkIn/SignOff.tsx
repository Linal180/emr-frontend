import { Box, Button, Card, Checkbox, colors, FormControlLabel, Typography } from '@material-ui/core'
import { AddCircleOutline, ChevronRight } from '@material-ui/icons'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { 
  ASSESSMENT_PLAN, DASHES, EIGHT_PAGE_LIMIT, ENCOUNTER_INFORMATION, FOLLOWUP, PATIENT_HISTORY_ILLNESS_TEXT, 
  REVIEW_OF_SYSTEM_TEXT, TO_CHECKOUT 
} from '../../../constants'
import { 
  PatientIllnessHistoryPayload, ReviewOfSystemPayload, ScribePayload, useFindAllPatientProblemsWithMedicationLazyQuery, 
  usePatientIllnessHistoryLazyQuery, useReviewOfSystemLazyQuery, useUpdateScribeCheckMutation 
} from '../../../generated/graphql'
import { AssessmentProblemType, ParamsType, SignOffProps } from '../../../interfacesTypes'
import { useChartingStyles } from '../../../styles/chartingStyles'
import UserSearchModal from '../../common/UserSearchModal'
import ReviewTab from '../patientChart/chartCards/tabs/ReviewTab'

function SignOff({ handleStepChange, appointmentInfo }: SignOffProps) {
  const classes = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [assessmentProblems, setAssessmentProblems] = useState<AssessmentProblemType[]>([])
  const [reviewOfSystem, setReviewOfSystem] = useState<ReviewOfSystemPayload['reviewOfSystem']>(null)
  const [patientIllnessHistory, setPatientIllnessHistory] = useState<PatientIllnessHistoryPayload['patientIllnessHistory']>(null)
  const [isScribe, setIsScribe] = useState(false)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false)
  const [scribeItem, setScribeItem] = useState<ScribePayload['scribe']>(null)

  const { provider, appointmentType, appointmentDate, scribe } = appointmentInfo || {}
  const { firstName, lastName } = provider || {}
  const { id: itemId, firstName: scribeFirstName, lastName: scribeLastName } = scribeItem || {}

  useEffect(() => {
    setScribeItem(scribe as ScribePayload['scribe'])
    setIsScribe(scribe?.isScribed || false)
  }, [scribe, scribe?.isScribed])

  const [findAllPatientProblems] = useFindAllPatientProblemsWithMedicationLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {

    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientProblem } = data;

        if (findAllPatientProblem) {
          const { response, patientProblems } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              const transformedPatientProblems = patientProblems.map((problem, index) => {
                const { ICDCode, id: problemId, snowMedCode, patientMedications, forOrders, isSigned, labTests } = problem || {}
                const { id: snoMedCodeId } = snowMedCode || {}

                const icdCodes = {
                  id: ICDCode?.id || '',
                  code: ICDCode?.code || '',
                  description: ICDCode?.description || '',
                  snoMedCodeId: snoMedCodeId || ''
                }

                const transformedPatientMedications = patientMedications?.map((patientMedication, subIndex) => {
                  const { id: patientMedicationId, medication } = patientMedication || {}
                  const id = medication?.id || ''
                  const fullName = medication?.fullName
                  const medicationId = medication?.id || ''
                  const rxNumber = medication?.rxNumber
                  const termType = medication?.termType
                  const updatedAt = medication?.updatedAt

                  return {
                    id,
                    fullName,
                    medicationId,
                    rxNumber,
                    termType,
                    updatedAt,
                    patientMedicationId,
                    isSigned: isSigned || false
                  }
                }) || []

                const transformedPatientTests = labTests?.map((patientTest, subIndex) => {
                  const { id: patientTestId, test } = patientTest || {}
                  const id = test?.id || ''
                  const component = test?.component
                  const testId = test?.id || ''

                  return {
                    id,
                    component,
                    testId,
                    patientTestId,
                    isSigned: isSigned || false
                  }
                }) || []

                return {
                  isSigned: isSigned || false,
                  icdCodes,
                  problemId: problemId || '',
                  medications: transformedPatientMedications,
                  forOrders: forOrders || false,
                  tests: transformedPatientTests
                }
              })

              setAssessmentProblems(transformedPatientProblems)
            }
          }
        }
      }
    }
  });

  const fetchProblems = useCallback(async () => {
    try {
      await findAllPatientProblems({
        variables: {
          patientProblemInput: { patientId, appointmentId, paginationOptions: { page: 1, limit: EIGHT_PAGE_LIMIT }, forOrders: true }
        },
      })
    } catch (error) { }
  }, [appointmentId, findAllPatientProblems, patientId]);

  useEffect(() => {
    patientId && fetchProblems()
  }, [fetchProblems, patientId])

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

  const [updateScribe] = useUpdateScribeCheckMutation({
    onCompleted: (data) => {
      const { updateScribeCheck } = data || {}
      const { response, scribe } = updateScribeCheck || {}
      const { status } = response || {}

      if (status === 200) {
        setScribeItem(scribe as ScribePayload['scribe'])
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

  useEffect(() => {
    fetchPatientReviewOfSystem()
  }, [fetchPatientReviewOfSystem])

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
    fetchPatientIllnessHistory()
  }, [fetchPatientIllnessHistory])

  return (
    <>
      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{ENCOUNTER_INFORMATION}</Typography>

            <Box display='flex' alignItems='center'>
              <Box p={1} />


              <Button
                variant='contained'
                color='primary'
                onClick={() => handleStepChange && handleStepChange(5)}
                size="large"
              >
                {TO_CHECKOUT}
                <ChevronRight />
              </Button>
            </Box>
          </Box>

          <Box p={2}>
            <Typography>{appointmentType?.name || DASHES}, {appointmentDate} </Typography>
            {!!provider && <Typography>Performed by {firstName} {lastName}</Typography>}

            <Box display="flex" alignItems="center" className={classes.checkBoxScribe}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={isScribe}
                    onChange={({ target: { checked } }) => {
                      setIsScribe(checked)
                      updateScribe({
                        variables: { scribeCheckInput: { id: itemId, isScribed: checked, appointmentId } }
                      })
                    }}
                  />
                }
                label={''}
              />
              <Box display="flex" alignItems='center'>
                Documented by scribe
                {(isScribe) ?
                  <Box display="flex" alignItems='center'>
                    , scribed by {
                      !scribeFirstName ? <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Button
                          onClick={() => setIsUsersModalOpen(true)}
                        >
                          <AddCircleOutline color='secondary' />
                          <Box ml={1} />
                        </Button>
                      </Box> :
                        <Box pl={2}>
                          <Button onClick={() => setIsUsersModalOpen(true)} size='small' variant='outlined' color='secondary'>{scribeFirstName} {scribeLastName}</Button>
                        </Box>
                    }
                  </Box> : ''}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box m={3} />

      <ReviewTab shouldShowAdd={false} handleStepChange={handleStepChange} />

      <Box m={3} />

      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{ASSESSMENT_PLAN}</Typography>
          </Box>

          <Box p={2}>
            {assessmentProblems.map(problem => {
              const { icdCodes, medications, tests } = problem || {}
              const { code, description } = icdCodes || {}

              return <>
                <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                  <Box>
                    <Typography variant='h4'>{`${description} | ${code} `}</Typography>
                  </Box>
                </Box>
                <Typography>Medications</Typography>
                {medications?.map((medication => {
                  const { fullName } = medication || {}
                  return (
                    <Box px={2}>
                      <ul>
                        <li>
                          <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                            <Typography>{fullName}</Typography>
                          </Box>
                        </li>
                      </ul>
                    </Box>
                  )
                }))}

                <Typography>Lab Tests</Typography>
                {tests?.map((test => {
                  const { component } = test || {}
                  return (
                    <Box px={2}>
                      <ul>
                        <li>
                          <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                            <Typography>{component}</Typography>
                          </Box>
                        </li>
                      </ul>
                    </Box>
                  )
                }))}
              </>
            })}
          </Box>
        </Box>
      </Card>

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

      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{FOLLOWUP}</Typography>
          </Box>

          <Box p={2}>
            <Typography>Patient will return to the office as needed.</Typography>
          </Box>
        </Box>
      </Card>

      {isUsersModalOpen &&
        <UserSearchModal
          isOpen={isUsersModalOpen}
          handleModalClose={() => setIsUsersModalOpen(false)}
          itemId={itemId}
          setScribeItem={setScribeItem}
        />
      }
    </>
  )
}

export default SignOff
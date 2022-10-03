import { Box, IconButton, Typography } from '@material-ui/core'
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons'
import { Reducer, useReducer } from 'react'
import { useParams } from 'react-router'
import { CrossIcon } from '../../../../../assets/svgs'
import { LabTestStatus, LoincCodePayload, Medications, useAddPatientMedicationMutation, useCreateLabTestMutation, useRemoveLabTestMutation, useRemovePatientMedicationMutation, useRemovePatientProblemMutation } from '../../../../../generated/graphql'
import { AssessmentPlanMedicationProps, ParamsType } from '../../../../../interfacesTypes'
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer'
import { generateString } from '../../../../../utils'
import Alert from '../../../../common/Alert'
import DiagnosesModal from './DiagnosesModal'

function AssessmentPlanMedication({ index, problem, setAssessmentProblems, assessmentProblems, shouldDisableEdit }: AssessmentPlanMedicationProps) {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const { medications, problemId, icdCodes, tests } = problem || {}
  const { code, description } = icdCodes
  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { medicationIndex, isSubModalOpen, testIndex } = state

  const handleChildModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const [addPatientMedication] = useAddPatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientMedication: { response, patientMedication } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          const { id } = patientMedication || {}

          const transformedMedications = medications?.map((medication, subIndex) => {
            let transformedMedicationId
            if (medicationIndex === subIndex) {
              transformedMedicationId = id
            } else {
              transformedMedicationId = medication.patientMedicationId
            }

            return {
              ...medication,
              patientMedicationId: transformedMedicationId
            }
          })

          const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
            if (problemIndex === index) {
              return {
                ...problem,
                medications: transformedMedications
              }
            }

            return problem
          })

          setAssessmentProblems(transformedProblems)
        }
      }
    }
  });

  const [createLabTest] = useCreateLabTestMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { createLabTest } = data
        const { labTest } = createLabTest || {}
        const { id } = labTest || {}

        const transformedTests = tests?.map((test, subIndex) => {
          let transformedTestId
          if (testIndex === subIndex) {
            transformedTestId = id
          } else {
            transformedTestId = test.patientTestId
          }

          return {
            ...test,
            patientTestId: transformedTestId
          }
        })

        const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
          if (problemIndex === index) {
            return {
              ...problem,
              tests: transformedTests
            }
          }

          return problem
        })

        setAssessmentProblems(transformedProblems)
      }
    }
  });

  const [removePatientMedication] = useRemovePatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const [removePatientLabTest] = useRemoveLabTestMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removeLabTest } = data || {};
      const { response } = removeLabTest || {}

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const handleAddOrder = async (item: Medications | LoincCodePayload['loincCode'], type: string) => {
    if (type === 'medication') {
      dispatch({ type: ActionType.SET_MEDICATION_INDEX, medicationIndex: Number(medications?.length || 0) })
      const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
        if (problemIndex === index) {
          return {
            ...problem,
            medications: [...(medications || []), { ...item, medicationId: (item as Medications).id, isSigned: false }]
          }
        }

        return problem
      })

      setAssessmentProblems(transformedProblems)

      await addPatientMedication({
        variables: {
          createPatientMedicationInput: {
            appointmentId,
            patientId,
            medicationId: (item as Medications).id,
            patientProblemId: problemId,
            status: 'ACTIVE'
          }
        }
      })
    } else {
      dispatch({ type: ActionType.SET_TEST_INDEX, testIndex: Number(tests?.length || 0) })
      const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
        if (problemIndex === index) {
          return {
            ...problem,
            tests: [...(tests || []), { ...item, testId: (item as LoincCodePayload['loincCode'])?.id, isSigned: false }]
          }
        }

        return problem
      })

      setAssessmentProblems(transformedProblems)

      await createLabTest({
        variables: {
          createLabTestInput: {
            createLabTestItemInput: {
              patientId,
              appointmentId,
              problemId,
              accessionNumber: generateString(6),
              orderNumber: generateString(),
              status: LabTestStatus.OrderEntered,
            },
            test: item?.id
          }
        }
      })
    }
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleRemoveOrder = async (subIndex: number, isMedication?: boolean) => {
    if (isMedication) {
      const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
        if (problemIndex === index) {
          return {
            ...problem,
            medications: medications?.filter((_, indexToRemove) => indexToRemove !== subIndex)
          }
        }

        return problem
      })
      setAssessmentProblems(transformedProblems)
      const medication = medications?.[subIndex]
      removePatientMedication({
        variables: {
          removePatientMedication: {
            id: medication?.patientMedicationId || ''
          }
        }
      })
    } else {
      const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
        if (problemIndex === index) {
          return {
            ...problem,
            tests: tests?.filter((_, indexToRemove) => indexToRemove !== subIndex)
          }
        }

        return problem
      })
      setAssessmentProblems(transformedProblems)
      const test = tests?.[subIndex]
      removePatientLabTest({
        variables: {
          removeLabTest: {
            id: test?.patientTestId
          }
        }
      })
    }
  }

  const [removePatientProblem] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const handleProblemRemove = async (problemIndex: number) => {
    setAssessmentProblems(assessmentProblems.filter((_, indexToRemove) => indexToRemove !== problemIndex))
    const problem = assessmentProblems[problemIndex]

    await removePatientProblem({
      variables: {
        removeProblem: {
          id: problem.problemId
        }
      }
    })
  }

  return <>
    <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
      <Box>
        <Typography variant='h4'>{`${description} | ${code} `}</Typography>
      </Box>

      {shouldDisableEdit && <Box display='flex' alignItems='center'>
        <IconButton size='small' onClick={() => {
          dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
        }}>
          <AddCircleOutline color='secondary' />
        </IconButton>

        <IconButton size='small' onClick={() => handleProblemRemove(index)}>
          <RemoveCircleOutline color='error' />
        </IconButton>
      </Box>}
    </Box>
    {!!medications?.length && <Typography>Medications</Typography>}
    {
      medications?.length ? medications?.map((medication, subIndex) => {
        const { fullName } = medication
        return (
          <Box px={2}>
            <ul>
              <li className='li-hover'>
                <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography>{fullName}</Typography>
                  {shouldDisableEdit && <IconButton size='small' onClick={() => handleRemoveOrder(subIndex, true)}>
                    <CrossIcon />
                  </IconButton>}
                </Box>
              </li>
            </ul>
          </Box>
        )
      }) :
        <></>
    }

    {!!tests?.length && <Typography>Lab Tests</Typography>}
    {
      tests?.length ? tests?.map((test, subIndex) => {
        const { component } = test || {}
        return (
          <Box px={2}>
            <ul>
              <li className='li-hover'>
                <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography>{component}</Typography>
                  {shouldDisableEdit && <IconButton size='small' onClick={() => handleRemoveOrder(subIndex)}>
                    <CrossIcon />
                  </IconButton>}
                </Box>
              </li>
            </ul>
          </Box>
        )
      }) :
        <></>
    }

    {isSubModalOpen &&
      <DiagnosesModal
        isOpen={isSubModalOpen}
        handleModalClose={handleChildModalClose}
        alreadyAddedMedications={medications?.map(medication => medication.medicationId)}
        fetch={() => { }}
        handleAdd={(item: Medications | LoincCodePayload['loincCode'], type: string) => handleAddOrder(item, type)}
      />}
  </>
}

export default AssessmentPlanMedication
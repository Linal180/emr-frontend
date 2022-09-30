import { Box, IconButton, Typography } from '@material-ui/core'
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons'
import { Reducer, useReducer } from 'react'
import { useParams } from 'react-router'
import { CrossIcon } from '../../../../../assets/svgs'
import { Medications, useAddPatientMedicationMutation, useRemovePatientMedicationMutation, useRemovePatientProblemMutation } from '../../../../../generated/graphql'
import { AssessmentPlanMedicationProps, ParamsType } from '../../../../../interfacesTypes'
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer'
import Alert from '../../../../common/Alert'
import AddMedication from '../../medications/modals/AddMedication'

function AssessmentPlanMedication({ index, problem, setAssessmentProblems, assessmentProblems }: AssessmentPlanMedicationProps) {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const { medications, problemId, icdCodes } = problem || {}
  const { code, description } = icdCodes
  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { medicationIndex, isSubModalOpen } = state

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

  const [removePatientMedication] = useRemovePatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          // dispatch({ type: ActionType.SET_MEDICATION_DELETE_ID, medicationDeleteId: '' })
          // dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          // if (!!patientMedications && (patientMedications.length > 1 || isLast(patientMedications.length, page))) {
          //   await fetchMedications()
          // } else {
          //   dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientMedications?.length || 0) })
          // }
        }
      }
    }
  });

  const handleAddMedication = async (item: Medications) => {
    dispatch({ type: ActionType.SET_MEDICATION_INDEX, medicationIndex: Number(medications?.length || 0) })
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          medications: [...(medications || []), { ...item, medicationId: item.id }]
        }
      }

      return problem
    })

    setAssessmentProblems(transformedProblems)
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
    await addPatientMedication({
      variables: {
        createPatientMedicationInput: {
          appointmentId,
          patientId,
          medicationId: item.id,
          patientProblemId: problemId,
          status: 'ACTIVE'
        }
      }
    })
  }

  const handleRemoveMedication = async (subIndex: number) => {
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
  }

  const [removePatientProblem] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          // Alert.success(PATIENT_PROBLEM_DELETED);

          // if (!!patientProblems && (patientProblems.length > 1 || isLast(patientProblems.length, page))) {
          //   await fetchProblems()
          // } else {
          //   dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientProblems?.length || 0) })
          // }
        }
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

      <Box display='flex' alignItems='center'>
        <IconButton size='small' onClick={() => {
          dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
        }}>
          <AddCircleOutline color='secondary' />
        </IconButton>

        <IconButton size='small' onClick={() => handleProblemRemove(index)}>
          <RemoveCircleOutline color='error' />
        </IconButton>
      </Box>
    </Box>
    {
      medications?.length ? medications?.map((medication, subIndex) => {
        const { fullName } = medication
        return (
          <Box px={2}>
            <ul>
              <li className='li-hover'>
                <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography>{fullName}</Typography>
                  <IconButton size='small' onClick={() => handleRemoveMedication(subIndex)}>
                    <CrossIcon />
                  </IconButton>
                </Box>
              </li>
            </ul>
          </Box>
        )
      }) :
        <></>
    }

    {isSubModalOpen &&
      <AddMedication
        isOpen={isSubModalOpen}
        handleModalClose={handleChildModalClose}
        alreadyAddedMedications={medications?.map(medication => medication.medicationId)}
        fetch={() => { }}
        handleAdd={(item: Medications) => handleAddMedication(item)}
      />}
  </>
}

export default AssessmentPlanMedication
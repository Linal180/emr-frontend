import { Box, Button, Card, colors, Typography } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import { Reducer, useReducer } from 'react';
import { useParams } from 'react-router';
import { ASSESSMENT_PLAN } from '../../../../../constants';
import { IcdCodesWithSnowMedCode, useAddPatientProblemMutation, useUpdatePatientProblemSignedMutation } from '../../../../../generated/graphql';
import { AssessmentPlanProblemsProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import Alert from '../../../../common/Alert';
import AppointmentReasonModal from '../AppointmentReason/AppointmentReasonModal';
import AssessmentPlanMedication from './AssessmentPlanMedication';

function AssessmentPlanProblems({ fetchProblems, assessmentProblems: problems, setAssessmentProblems }: AssessmentPlanProblemsProps) {
  const classes = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  // const { control, setValue, watch } = useFormContext<AssessmentProblems>()
  // const { problems } = watch()

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { isOpen, problemIndex } = state

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })

  const [addPatientProblem, { loading: addProblemLoading }] = useAddPatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientProblem: { response, patientProblem } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          const { id } = patientProblem || {}
          const transformedProblems = problems?.map((problem, index) => {
            const { icdCodes, isSigned, problemId, medications } = problem
            let transformedProblemId = ''
            if (index === problemIndex) {
              transformedProblemId = id || ''
            } else {
              transformedProblemId = problemId || ''
            }

            return {
              icdCodes, problemId: transformedProblemId,
              isSigned, medications
            }
          }) || []

          setAssessmentProblems(transformedProblems)
        }
      }
    }
  });

  const [updatePatientProblemSigned] = useUpdatePatientProblemSignedMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientProblemSigned: { response } } = data;

      if (response) {
        // const { status } = response

        // if (status && status === 200) {
        //   const { id } = patientProblem || {}
        //   const transformedProblems = problems?.map((problem, index) => {
        //     const { icdCodes, isSigned, problemId, medications } = problem
        //     let transformedProblemId = ''
        //     if (index === problemIndex) {
        //       transformedProblemId = id || ''
        //     } else {
        //       transformedProblemId = problemId || ''
        //     }

        //     return {
        //       icdCodes, problemId: transformedProblemId,
        //       isSigned, medications
        //     }
        //   }) || []

        //   setAssessmentProblems(transformedProblems)
        // }
      }
    }
  });



  const handleProblemAdd = async (item: IcdCodesWithSnowMedCode) => {
    dispatch({ type: ActionType.SET_PROBLEM_INDEX, problemIndex: problems?.length })
    setAssessmentProblems([...problems, {
      icdCodes: { id: item.id, code: item.code, description: item.description || '', snoMedCodeId: item.snoMedCode?.id || '' },
      problemId: '',
      isSigned: false,
      forOrders: true
    }])

    await addPatientProblem({
      variables: {
        createProblemInput: {
          icdCodeId: item.id,
          patientId,
          appointmentId,
          snowMedCodeId: item.snoMedCode?.id || '',
          forOrders: true,
          isSigned: false
        }
      }
    })
    handleModalClose()
    await fetchProblems()
  }

  const numberOfOrders = problems?.reduce((acc, problem) => {
    if (problem.isSigned) {
      return acc
    }
    return acc += problem.medications?.length || 0
  }, 0)

  const handleAssessment = async () => {
    await Promise.all(
      problems.map(async (problem) => {
        const { problemId } = problem
        return await updatePatientProblemSigned({
          variables: {
            updateProblemSignedInput: {
              id: problemId,
              isSigned: true
            }
          }
        })
      })
    )

    const transformedProblems = problems.map(problem => {
      return {
        ...problem,
        isSigned: true
      }
    })

    setAssessmentProblems(transformedProblems)

    Alert.success('Diagnoses Ordered Successfully')
  }

  return (
    <div>
      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box
            px={2} py={1} display='flex' justifyContent='space-between' alignItems='center'
            flexWrap='wrap' borderBottom={`1px solid ${colors.grey[300]}`}
          >
            <Box display='flex' alignItems='center'>
              <Typography variant='h3'>{ASSESSMENT_PLAN}</Typography>

              <Box ml={1} pb={1} display="flex" alignItems="center" justifyContent="flex-end">
                <Button onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                  <AddCircleOutline color='secondary' />
                  <Box ml={1} />
                  <Typography color="secondary">{'DIAGNOSIS & ORDERS'}</Typography>
                </Button>
              </Box>
            </Box>

            <Box display='flex' alignItems='center'>
              <Box m={1}>
                <Button variant='contained' color='secondary' disabled={addProblemLoading || !numberOfOrders} onClick={handleAssessment}>
                  {'Sign Orders'}
                  <Typography variant="body1" color="inherit">({numberOfOrders})</Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box m={2} />

      {problems?.map((problem, index) => {
        return (
          <>
            <Card>
              <Box px={2} py={3} className={classes.cardBox}>
                <AssessmentPlanMedication
                  key={`${index} ${problem.problemId}`}
                  index={index}
                  problem={problem}
                  assessmentProblems={problems}
                  setAssessmentProblems={setAssessmentProblems}
                />
              </Box>
            </Card>
            <Box m={2} />
          </>
        )
      })}

      {isOpen &&
        <AppointmentReasonModal
          isOpen={isOpen}
          handleModalClose={handleModalClose}
          fetch={() => fetchProblems()}
          alreadyAddedProblems={problems?.map(problem => problem?.icdCodes?.id)}
          title="Add Diagnose"
          handleAdd={(item: IcdCodesWithSnowMedCode) => handleProblemAdd(item)}
        />}
    </div>
  )
}

export default AssessmentPlanProblems
import moment from 'moment';
import { useParams } from 'react-router';
import { FC, Reducer, useReducer } from 'react';
import { AddCircleOutline } from '@material-ui/icons';
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
//components
import Alert from '../../../../common/Alert';
import AssessmentPlanMedication from './AssessmentPlanMedication';
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent';
import AppointmentReasonModal from '../AppointmentReason/AppointmentReasonModal';
//constants, interfaces, reducer, styles
import { ADD_CHIEF_COMPLAINT, ASSESSMENT_PLAN } from '../../../../../constants';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import { AssessmentMedication, AssessmentPlanProblemsProps, ParamsType } from '../../../../../interfacesTypes';
import {
  IcdCodesWithSnowMedCode, useAddPatientProblemMutation, useUpdatePatientProblemSignedMutation
} from '../../../../../generated/graphql';

const AssessmentPlanProblems: FC<AssessmentPlanProblemsProps> = ({
  fetchProblems, assessmentProblems: problems, setAssessmentProblems, shouldDisableEdit, isSigned, notes, setNotes
}): JSX.Element => {
  const classes = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  // const { control, setValue, watch } = useFormContext<AssessmentProblems>()
  // const { problems } = watch()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
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

          Alert.success(ADD_CHIEF_COMPLAINT);
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

      if (response) { }
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
          isSigned: false,
          problemStartDate: moment().format("MM-DD-YYYY")
        }
      }
    })
    handleModalClose()
    await fetchProblems()
  }

  const numberOfOrders = problems?.reduce((acc, problem) => {
    const numberOfMedications = problem.medications?.reduce((acc, medication) => {
      if (medication.isSigned) {
        return acc
      }
      return acc += 1
    }, 0)

    const numberOfTests: number = problem.tests?.reduce((acc, test) => {
      if (test.isSigned) {
        return acc
      }
      return acc += 1
    }, 0) || 0
    return acc += (numberOfTests || 0) + (numberOfMedications || 0)
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
        isSigned: true,
        medications: problem?.medications?.map((medication) => {
          return { ...medication, isSigned: true }
        }) || [] as AssessmentMedication[],
        tests: problem?.tests?.map((test) => {
          return { ...test, isSigned: true }
        }) || [],
      }
    })

    setAssessmentProblems(transformedProblems)
    await fetchProblems()

    Alert.success('Diagnoses Ordered Successfully')
  }

  return (
    <>
      <Card>
        <Box pb={2} className={classes.cardBox} px={2} py={1} display='flex' justifyContent='space-between' alignItems='center'
          flexWrap='wrap' borderBottom={`1px solid ${colors.grey[300]}`}>
          <Box display='flex' flexWrap='wrap' alignItems='center'>
            <Typography variant='h3'>{ASSESSMENT_PLAN}</Typography>

            {!(shouldDisableEdit || isSigned) && <Box ml={1} display="flex" alignItems="center" justifyContent="flex-end">
              <Button onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                <AddCircleOutline color='secondary' />
                <Box ml={1} />
                <Typography color="secondary">{'DIAGNOSIS & ORDERS'}</Typography>
              </Button>
            </Box>}
          </Box>

          <Box display='flex' alignItems='center'>
            <Box m={1}>
              <Button
                color='secondary'
                variant='contained'
                onClick={handleAssessment}
                disabled={addProblemLoading || !numberOfOrders || isSigned}
              >
                {'Sign Orders'}
                <Typography variant="body1" color="inherit">({numberOfOrders})</Typography>
              </Button>
            </Box>
          </Box>
        </Box>

        <Box m={2} />

        {/* {!!problems?.length && <MacroView
          notes={notes || ''}
          itemId=''
          setItemId={() => { }}
          type={TemplateType.ASSESSMENT_PLAN}
          handleNotesUpdate={handleNotesUpdate}
        />} */}
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
                  isSigned={isSigned}
                />
              </Box>
            </Card>
            <Box m={2} />
          </>
        )
      })}

      {!problems?.length && <Box display="flex" justifyContent="center" pb={12} pt={5}>
        <NoDataFoundComponent />
      </Box>}

      {isOpen &&
        <AppointmentReasonModal
          isOpen={isOpen}
          handleModalClose={handleModalClose}
          fetch={() => fetchProblems()}
          alreadyAddedProblems={problems?.map(problem => problem?.icdCodes?.id)}
          title="Add Diagnose"
          handleAdd={(item: IcdCodesWithSnowMedCode) => handleProblemAdd(item)}
          searchPlaceholder="Search..."
        />}
    </>
  )
}

export default AssessmentPlanProblems
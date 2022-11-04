import { Box, Button, Card, colors, IconButton, Typography } from '@material-ui/core'
import { ChevronRight, RemoveCircleOutline } from '@material-ui/icons'
import { Reducer, useCallback, useEffect, useReducer } from 'react'
import { useParams } from 'react-router'
//component block
import Alert from '../../../../common/Alert'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent'
import AppointmentReasonModal from '../AppointmentReason/AppointmentReasonModal'
//constants, interfaces, styles, reducers, graphql
import {
  ADD, APPOINTMENT_REASON_DELETED, CHIEF_COMPLAINT, DELETE_CHIEF_COMPLAINT_DESCRIPTION, NEXT, REACTION_PAGE_LIMIT,
  TO_CHECKOUT
} from '../../../../../constants'
import { PatientProblemsPayload, useFindAllPatientProblemsLazyQuery, useRemovePatientProblemMutation } from '../../../../../generated/graphql'
import { AppointmentReasonProps, ParamsType } from '../../../../../interfacesTypes'
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer'
import { useChartingStyles } from '../../../../../styles/chartingStyles'


function AppointmentReason({ shouldShowAdd, isInTake, handleStep, shouldDisableEdit, shouldShowCheckout, handleStepChange }: AppointmentReasonProps) {
  const classes = useChartingStyles()
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const { isOpen, page, patientProblems, problemDeleteId, openDelete } = state

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })

  const [findAllPatientProblems, { loading, error }] = useFindAllPatientProblemsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_PROBLEMS, patientProblems: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientProblem } = data;

        if (findAllPatientProblem) {
          const { response, patientProblems } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              dispatch({ type: ActionType.SET_PATIENT_PROBLEMS, patientProblems: patientProblems as PatientProblemsPayload['patientProblems'] })
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
          patientProblemInput: { patientId, appointmentId, paginationOptions: { page, limit: REACTION_PAGE_LIMIT } }
        },
      })
    } catch (error) { }
  }, [appointmentId, findAllPatientProblems, page, patientId]);

  useEffect(() => {
    patientId && fetchProblems()
  }, [fetchProblems, page, patientId])

  const [removePatientProblem, { loading: removeProblemLoading }] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_REASON_DELETED);
          dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          fetchProblems()
        }
      }
    }
  });

  const handleDelete = async () => {
    problemDeleteId && await removePatientProblem({
      variables: { removeProblem: { id: problemDeleteId } }
    })
  }

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const singlePatientProblems = patientProblems?.filter((problem, index, self) => index === self.findIndex((t) => (
    t?.ICDCode?.code === problem?.ICDCode?.code
  )))

  return (
    <>
      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{CHIEF_COMPLAINT}</Typography>

            <Box display='flex' alignItems='center'>
              {!shouldDisableEdit && shouldShowAdd && <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}
              >
                {ADD}
              </Button>}

              <Box p={1} />

              {isInTake ? <Button variant='contained' color='secondary' onClick={() => handleStep && handleStep()} size="large">{NEXT}</Button> :
                shouldShowCheckout ? <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleStepChange && handleStepChange(5)}
                  size="large"
                >
                  {TO_CHECKOUT}
                  <ChevronRight />
                </Button> : <></>}
            </Box>
          </Box>

          <Box p={2}>
            {singlePatientProblems?.map((value) => {
              const { id, ICDCode } = value || {}
              return <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Typography variant='inherit'>{ICDCode?.description}</Typography>
                {!shouldDisableEdit && shouldShowAdd && <IconButton onClick={() => id && onDeleteClick(id)}>
                  <RemoveCircleOutline />
                </IconButton>}
              </Box>
            })}
          </Box>

          {((!loading && singlePatientProblems?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Card>

      {isOpen &&
        <AppointmentReasonModal
          isOpen={isOpen}
          handleModalClose={handleModalClose}
          fetch={() => fetchProblems()}
          alreadyAddedProblems={singlePatientProblems?.map((problem => problem?.ICDCode?.id || ''))}
        />}

      <ConfirmationModal
        title={CHIEF_COMPLAINT}
        isOpen={openDelete}
        isLoading={removeProblemLoading}
        description={DELETE_CHIEF_COMPLAINT_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
    </>

  )
}

export default AppointmentReason
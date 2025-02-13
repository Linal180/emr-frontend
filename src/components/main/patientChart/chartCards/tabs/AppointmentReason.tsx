import moment from 'moment'
import { useParams } from 'react-router'
import { Reducer, useCallback, useEffect, useReducer } from 'react'
import { ChevronRight } from '@material-ui/icons'
import { Box, Button, Card, Checkbox, Chip, colors, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
//component block
import Alert from '../../../../common/Alert'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent'
import AppointmentReasonModal from '../AppointmentReason/AppointmentReasonModal'
//constants, interfaces, styles, reducers, graphql
import {
  ADD, APPOINTMENT_CHIEF_COMPLAINT_DELETED, CHIEF_COMPLAINT, DELETE_CHIEF_COMPLAINT_DESCRIPTION, NEXT,
  REACTION_PAGE_LIMIT, TO_CHECKOUT, ADD_CHIEF_COMPLAINT
} from '../../../../../constants'
import {
  AllCptCodePayload, PatientProblemsPayload, ProblemSeverity, ProblemType, useAddPatientProblemMutation,
  useFindAllPatientProblemsLazyQuery, useFindChiefComplaintProblemsLazyQuery, useRemovePatientProblemMutation
} from '../../../../../generated/graphql'
import { useChartingStyles } from '../../../../../styles/chartingStyles'
import { AppointmentReasonProps, ParamsType } from '../../../../../interfacesTypes'
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer'


function AppointmentReason({ shouldShowAdd, isInTake, handleStep, shouldDisableEdit, shouldShowCheckout, handleStepChange }: AppointmentReasonProps) {
  const classes = useChartingStyles()
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const { isOpen, page, patientProblems, problemDeleteId, openDelete, chiefComplaintProblems } = state

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })

  const [findAllChiefComplaintProblems, { loading: chiefComplaintProblemsLoading }] = useFindChiefComplaintProblemsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_PROBLEMS, patientProblems: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findChiefComplaintProblems } = data;

        if (findChiefComplaintProblems) {
          const { response, icdCodes } = findChiefComplaintProblems

          if (response) {
            const { status } = response

            if (icdCodes && status && status === 200) {
              dispatch({ type: ActionType.SET_CHIEF_COMPLAINT_PROBLEMS, chiefComplaintProblems: icdCodes as AllCptCodePayload['cptCodes'] })
            }
          }
        }
      }
    }
  });

  const [findAllPatientProblems, { loading }] = useFindAllPatientProblemsLazyQuery({
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

  const fetchChiefComplaintProblems = useCallback(async () => {
    try {
      await findAllChiefComplaintProblems({
        variables: {
          allIcdCodesInput: {}
        },
      })
    } catch (error) { }
  }, [findAllChiefComplaintProblems]);

  useEffect(() => {
    patientId && fetchProblems()
    fetchChiefComplaintProblems()
  }, [fetchProblems, fetchChiefComplaintProblems, page, patientId])

  const [removePatientProblem, { loading: removeProblemLoading }] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_CHIEF_COMPLAINT_DELETED);
          dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          fetchProblems()
        }
      }
    }
  });

  const [addPatientProblem] = useAddPatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(ADD_CHIEF_COMPLAINT)
          fetchProblems && fetchProblems()
        }
      }
    }
  });

  const handleAddReason = async (icdCodeId: string) => {
    const commonInput = {
      note: '',
      problemSeverity: ProblemSeverity.Acute,
      problemStartDate: moment().format('MM-DD-YYYY'),
      problemType: ProblemType.Active
    }

    const extendedInput = appointmentId ?
      { appointmentId: appointmentId, ...commonInput } : { ...commonInput }

    await addPatientProblem({
      variables: {
        createProblemInput: {
          patientId, icdCodeId, shouldCreateTemplate: true, ...extendedInput,
        }
      }
    })
  }

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

  const singlePatientProblemCodes = [...(singlePatientProblems?.map((problem) => problem?.ICDCode) || []), ...(chiefComplaintProblems || [])].filter((problem, index, self) => index === self.findIndex((t) => (
    t?.code === problem?.code
  )))

  const transformedProblems = singlePatientProblemCodes.map((value) => {
    return {
      value: value,
      isSelected: singlePatientProblems?.some((problem => problem?.ICDCode?.code === value?.code)),
      problemId: singlePatientProblems?.find((problem => problem?.ICDCode?.code === value?.code))?.id
    }
  })

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

          <Box mt={2}>
            {transformedProblems?.map((chiefComplaintProblem) => {
              const { isSelected, value } = chiefComplaintProblem || {}
              const { description, id: icdCodeId } = value || {}
              return (
                <Box m={1} display='inline-flex' flexDirection='row' flexWrap='wrap'>
                  {/* <Chip
                    label={description}
                    clickable={!isSelected}
                    disabled={shouldDisableEdit || isSelected}
                    onClick={() => !isSelected && handleAddReason(icdCodeId || '')}
                    className={classes.problemChip}
                    style={{
                      background: isSelected ? `${BLUE}` : 'white',
                      color: isSelected ? 'white' : `${BLUE}`
                    }}
                  /> */}

                  {/* <Box p={2} /> */}

                  {/* new-code */}

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Box mr={1}>
                          <Checkbox
                            color="primary"
                            checked={!!isSelected}
                            disabled={shouldDisableEdit || isSelected}
                            onClick={() => !isSelected && handleAddReason(icdCodeId || '')}
                          />
                        </Box>
                      }

                      label={<Typography variant="h6">{description}</Typography>}
                    />
                  </FormGroup>
                </Box>
              )
            })}
          </Box>

          <Box m={2} />

          <Box p={2} borderTop={`1px solid ${colors.grey[300]}`}>
            {singlePatientProblems?.map((value) => {
              const { id, ICDCode } = value || {}
              return <>
                {/* <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Typography variant='inherit'>{ICDCode?.description}</Typography>
                {!shouldDisableEdit && shouldShowAdd && <IconButton onClick={() => id && onDeleteClick(id)}>
                  <RemoveCircleOutline />
                </IconButton>}
              </Box> */}

                <Box display='inline-flex' flexWrap="wrap" m={1}>
                  {!shouldDisableEdit && shouldShowAdd ?
                    <Chip label={ICDCode?.description} onDelete={() => id && onDeleteClick(id)} variant="outlined" color='secondary' />
                    :
                    <Chip label={ICDCode?.description} color="secondary" variant="outlined" />
                  }
                </Box>
              </>
            })}
          </Box>

          {((!(loading || chiefComplaintProblemsLoading) && transformedProblems?.length === 0)) && (
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
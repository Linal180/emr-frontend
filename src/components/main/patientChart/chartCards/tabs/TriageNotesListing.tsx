// packages block
import { Box, Button, Card, Grid, Typography } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
// components
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import Alert from "../../../../common/Alert";
import TableLoader from "../../../../common/TableLoader";
//constants, interfaces, utils
import {
  CONFLICT_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, FORBIDDEN_EXCEPTION, NOTES, PAGE_LIMIT, SAVE_TEXT,
  TRIAGE_NOTES, UPDATE_TRIAGE_NOTES, VITAL_LIST_PAGE_LIMIT
} from "../../../../../constants";
import InputController from "../../../../../controller";
import {
  TriageNotesPayload, useAddPatientTriageNoteMutation, useFindAllPatientTriageNotesLazyQuery,
  useUpdatePatientTriageNoteMutation
} from "../../../../../generated/graphql";
import { ChartComponentProps, ParamsType, PatientTriageNotesInputProps } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";

const TriageNoteTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const classes = useChartingStyles()
  const { id, appointmentId } = useParams<ParamsType>()

  const [patientStates, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { page, totalPages, patientTriageNotes, triageNoteId, isTriageNote } = patientStates || {}
  const methods = useForm<PatientTriageNotesInputProps>({ mode: "all" });
  const { handleSubmit, setValue } = methods

  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({
    type: ActionType.SET_PAGE, page: page
  })

  const [getPatientTriageNotes, { loading }] = useFindAllPatientTriageNotesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_TRIAGE_NOTES, patientTriageNotes: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientTriageNotes } = data;

        if (findAllPatientTriageNotes) {
          const { response, triageNotes, pagination } = findAllPatientTriageNotes

          if (response) {
            const { status } = response

            if (triageNotes && status && status === 200) {

              if (appointmentId) {
                const { id, notes } = triageNotes?.[0] || {}

                id && dispatch({ type: ActionType.SET_TRIAGE_NOTE_ID, triageNoteId: id })
                notes && setValue('notes', notes)
              }

              triageNotes?.length && dispatch({
                type: ActionType.SET_PATIENT_TRIAGE_NOTES,
                patientTriageNotes: triageNotes as TriageNotesPayload['triageNotes']
              })
            }
          }

          if (pagination) {
            const { totalPages } = pagination

            typeof totalPages === 'number' && dispatch({
              type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages
            })
          }
        }
      }
    }
  })

  const fetchPatientAllTriageNotes = useCallback(async () => {
    try {
      await getPatientTriageNotes({
        variables: {
          patientTriageNoteInput: {
            patientId: id,
            appointmentId: appointmentId,
            paginationOptions: { page: page, limit: VITAL_LIST_PAGE_LIMIT }
          }
        },
      })
    } catch (error) { }
  }, [appointmentId, getPatientTriageNotes, id, page])

  useEffect(() => {
    id && fetchPatientAllTriageNotes()
  }, [id, fetchPatientAllTriageNotes])

  const [createTriageNotes, { loading: createTriageNotesLoading }] = useAddPatientTriageNoteMutation({
    onError({ message }) {
      Alert.error(message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION ?
        EMAIL_OR_USERNAME_ALREADY_EXISTS : message)
    },

    onCompleted(data) {
      const { addPatientTriageNote } = data || {}
      const { triageNotes, response } = addPatientTriageNote || {}

      if (response) {
        const { status } = response
        const { id } = triageNotes || {}

        if (status && status === 200) {
          id && dispatch({ type: ActionType.SET_TRIAGE_NOTE_ID, triageNoteId: id })
          dispatch({ type: ActionType.SET_IS_TRIAGE_NOTE, isTriageNote: false })
          Alert.success(UPDATE_TRIAGE_NOTES)
        }
      }
    }
  });

  const [updateTriageNotes, { loading: updateTriageNotesLoading }] = useUpdatePatientTriageNoteMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientTriageNote } = data || {}
      const { response, triageNotes } = updatePatientTriageNote || {}

      if (response) {
        const { status } = response
        const { id } = triageNotes || {}

        if (status && status === 200) {
          id && dispatch({ type: ActionType.SET_TRIAGE_NOTE_ID, triageNoteId: id })
          dispatch({ type: ActionType.SET_IS_TRIAGE_NOTE, isTriageNote: false })
          Alert.success(UPDATE_TRIAGE_NOTES)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<PatientTriageNotesInputProps> = async (values) => {
    const { notes } = values

    if (triageNoteId) {
      updateTriageNotes({
        variables: {
          updateTriageNoteInput: {
            id: triageNoteId,
            appointmentId: appointmentId,
            notes,
            patientId: id
          }
        }
      })
    } else {
      createTriageNotes({
        variables: {
          createTriageNoteInput: {
            appointmentId: appointmentId,
            notes,
            patientId: id
          }
        }
      })
    }
  }

  const triageNoteHandler = () => {
    dispatch({ type: ActionType.SET_IS_TRIAGE_NOTE, isTriageNote: true })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            {loading ? (
              <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
            ) : <Box className={classes.cardBox}>
              <FormProvider {...methods}>
                <form>
                  <Box px={2} py={2}>
                    <Typography variant='h3'>{TRIAGE_NOTES}</Typography>
                  </Box>
                </form>
              </FormProvider>

              <Box px={2} pb={2}>
                {appointmentId ?
                  shouldDisableEdit ?
                    <Typography>{patientTriageNotes?.[0]?.notes || ''}</Typography> :
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <InputController
                          multiline
                          fieldType="text"
                          loading={loading}
                          controllerName="notes"
                          placeholder={NOTES}
                          onChange={triageNoteHandler}
                        />

                        <Button
                          type='submit'
                          variant="contained" color="primary"
                          disabled={createTriageNotesLoading || updateTriageNotesLoading || !isTriageNote || shouldDisableEdit}
                        >
                          {SAVE_TEXT}
                        </Button>
                      </form>
                    </FormProvider>
                  :
                  patientTriageNotes?.map(triageNote => {
                    return (<>
                      <li>{triageNote.notes}</li>
                    </>)
                  })
                }

                {!appointmentId && !loading && !patientTriageNotes?.length &&
                  <NoDataFoundComponent />}
              </Box>
            </Box>}
          </Card>
        </Grid>
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  )
}

export default TriageNoteTab;

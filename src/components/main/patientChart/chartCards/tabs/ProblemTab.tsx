import { Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import { ACTIONS, ADD_NEW_TEXT, DASHES, DELETE_PROBLEM_DESCRIPTION, ICD_CODE, LIST_PAGE_LIMIT, NOTES, ONSET_DATE, PATIENT_PROBLEM_DELETED, PROBLEM_TEXT, SEVERITY, TYPE } from "../../../../../constants";
import { IcdCodes, PatientProblemsPayload, useFindAllPatientProblemsLazyQuery, useRemovePatientProblemMutation } from "../../../../../generated/graphql";
import { ParamsType } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GREEN, ORANGE_ONE } from "../../../../../theme";
import { getFormatDateString, renderTh } from "../../../../../utils";
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import AddProblem from "../../problems/modals/AddProblem";
import ProblemModal from "../../problems/modals/ProblemModal";

const ProblemTab = () => {
  const classes = useChartingStyles()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [patientProblems, setPatientProblems] = useState<PatientProblemsPayload['patientProblems']>([])
  const [{ isSubModalOpen, selectedItem, itemId, problemDeleteId }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const { id } = useParams<ParamsType>()

  const handleModalClose = () => {
    setIsOpen(!isOpen)
  }

  const [findAllPatientProblems, { loading, error }] = useFindAllPatientProblemsLazyQuery({
    variables: {
      patientProblemInput: { patientId: id, paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT } }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientProblems([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientProblem } = data;

        if (findAllPatientProblem) {
          const { response, patientProblems } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              setPatientProblems(patientProblems as PatientProblemsPayload['patientProblems'])
            }
          }
        }
      }
    }
  });

  const fetchProblems = useCallback(async () => {
    try {
      await findAllPatientProblems()
    } catch (error) { }
  }, [findAllPatientProblems]);

  useEffect(() => {
    id && fetchProblems()
  }, [fetchProblems, id])

  const handleEditModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleEdit = (id: string, icdCode: IcdCodes) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: icdCode })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const [removePatientProblem, { loading: removeProblemLoading }] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          await fetchProblems()
          Alert.success(PATIENT_PROBLEM_DELETED);
          dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: '' })
          setOpenDelete(false)
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: id })
      setOpenDelete(true)
    }
  };

  const handleDelete = async () => {
    problemDeleteId && await removePatientProblem({
      variables: { removeProblem: { id: problemDeleteId } }
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box className={classes.cardBox}>
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h3'>{PROBLEM_TEXT}</Typography>

                <Button variant='contained' color='primary' onClick={() => setIsOpen(true)}>
                  <AddWhiteIcon />
                  <Box p={0.5} />
                  {ADD_NEW_TEXT}
                </Button>
              </Box>

              {loading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> :
                <Box className={classes.tableBox}>
                  <Table aria-label="customized table">
                    <TableHead>
                    <TableRow>
                    {renderTh(ICD_CODE)}
                    {renderTh(PROBLEM_TEXT)}
                    {renderTh(ONSET_DATE)}
                    {renderTh(TYPE)}
                    {renderTh(NOTES)}
                    {renderTh(SEVERITY)}
                    {renderTh(ACTIONS)}
                  </TableRow>
                    </TableHead>

                    <TableBody>
                      {patientProblems?.map((patientProblem) => {
                        const { problemSeverity, ICDCode, problemType, note, problemStartDate, id } = patientProblem ?? {}
                        return (
                          <TableRow>
                        <TableCell scope="row">
                          <Typography>{ICDCode?.code ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{ICDCode?.description ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{problemStartDate ? getFormatDateString(problemStartDate, 'MM-DD-YYYY'): ''}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box className={classes.activeBox} bgcolor={ORANGE_ONE}>
                            {problemType}
                          </Box>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography className={classes.textOverflow}>{note}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box className={classes.activeBox} bgcolor={GREEN}>
                            {problemSeverity}
                          </Box>
                        </TableCell>
                            <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton onClick={() => id && ICDCode && handleEdit(id, ICDCode)}>
                                  <EditOutlinedIcon />
                                </IconButton>

                                <IconButton onClick={() => id && onDeleteClick(id)}>
                                  <TrashOutlinedSmallIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {((!loading && patientProblems?.length === 0) || error) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataFoundComponent />
                    </Box>
                  )}
                </Box>
              }
            </Box>
          </Card>
        </Grid>

        <ConfirmationModal
          title={PROBLEM_TEXT}
          isOpen={openDelete}
          isLoading={removeProblemLoading}
          description={DELETE_PROBLEM_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => setOpenDelete(open)}
        />

        {isSubModalOpen && <ProblemModal
          item={selectedItem}
          dispatcher={dispatch}
          isEdit
          recordId={itemId}
          fetch={async () => fetchProblems()}
          handleClose={handleEditModalClose}
          isOpen={isSubModalOpen}
        />
        }
      </Grid>
      {isOpen &&
        <AddProblem isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchProblems()} />}
    </>
  )
}

export default ProblemTab;

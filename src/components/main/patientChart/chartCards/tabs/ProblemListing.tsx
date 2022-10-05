// packages block
import {
  Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
// components block
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import TableLoader from "../../../../common/TableLoader";
import AddProblem from "../../problems/modals/AddProblem";
import ProblemModal from "../../problems/modals/ProblemModal";
// constants, utils, interfaces ang graphql block
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import {
  ACTIONS, ADD_NEW_TEXT, COMMENTS, DASHES, DELETE_PROBLEM_DESCRIPTION, EIGHT_PAGE_LIMIT, ICD_CODE, NEXT, ONSET_DATE, PATIENT_PROBLEM_DELETED, PROBLEM_TEXT, STATUS, TYPE
} from "../../../../../constants";
import {
  IcdCodes, PatientProblemsPayload, useFindAllPatientProblemsLazyQuery, useRemovePatientProblemMutation
} from "../../../../../generated/graphql";
import { ParamsType, ProblemTabProps } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { useTableStyles } from "../../../../../styles/tableStyles";
import {
  getFormatDateString, getPageNumber, getProblemSeverityColor, getProblemTypeColor, isLast, renderTh
} from "../../../../../utils";

const ProblemTab: FC<ProblemTabProps> = ({ shouldDisableEdit, handleStep }) => {
  const classes = useChartingStyles();
  const classesTable = useTableStyles()
  const { id } = useParams<ParamsType>()

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const {
    isSubModalOpen, selectedItem, itemId, problemDeleteId, totalPages, page, isOpen,
    openDelete, patientProblems
  } = state || {}

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page: page })

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
          const { response, patientProblems, pagination } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              dispatch({ type: ActionType.SET_PATIENT_PROBLEMS, patientProblems: patientProblems as PatientProblemsPayload['patientProblems'] })
            }
          }

          if (pagination) {
            const { totalPages } = pagination
            typeof totalPages === 'number' && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages })
          }
        }
      }
    }
  });

  const fetchProblems = useCallback(async () => {
    try {
      await findAllPatientProblems({
        variables: {
          patientProblemInput: {
            patientId: id, paginationOptions: { page, limit: EIGHT_PAGE_LIMIT },
            // ...(appointmentId ? { appointmentId } : {})
          }
        },
      })
    } catch (error) { }
  }, [findAllPatientProblems, id, page]);

  useEffect(() => {
    id && fetchProblems()
  }, [fetchProblems, id, page])

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
          Alert.success(PATIENT_PROBLEM_DELETED);
          dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!patientProblems && (patientProblems.length > 1 || isLast(patientProblems.length, page))) {
            await fetchProblems()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientProblems?.length || 0) })
          }
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_PROBLEM_DELETE_ID, problemDeleteId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
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
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant='h3'>{PROBLEM_TEXT}</Typography>

                <Box display='flex' alignItems='center'>
                  {!shouldDisableEdit &&
                    <Button
                      variant='contained' color='primary'
                      startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                      onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                      {ADD_NEW_TEXT}
                    </Button>}

                  <Box p={1} />

                  {handleStep && <Button variant='contained' color='secondary' size="large" onClick={() => handleStep()}>{NEXT}</Button>}
                </Box>
              </Box>

              <Box className={classes.tableBox}>
                <Table aria-label="customized table" className={classesTable.table}>
                  <TableHead>
                    <TableRow>
                      {renderTh(ICD_CODE)}
                      {renderTh(PROBLEM_TEXT)}
                      {renderTh(ONSET_DATE)}
                      {renderTh(STATUS)}
                      {renderTh(COMMENTS)}
                      {renderTh(TYPE)}
                      {!shouldDisableEdit && renderTh(ACTIONS)}
                    </TableRow>
                  </TableHead>

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <TableLoader numberOfRows={EIGHT_PAGE_LIMIT} numberOfColumns={5} />
                      </TableCell>
                    </TableRow>
                  ) : <TableBody>
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
                            <Typography>
                              {problemStartDate ? getFormatDateString(problemStartDate, 'MM-DD-YYYY') : ''}
                            </Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox} bgcolor={getProblemTypeColor(problemType || '')}>
                              {problemType}
                            </Box>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography className={classes.textOverflow}>{note}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox}
                              bgcolor={problemSeverity && getProblemSeverityColor(problemSeverity)}
                            >
                              {problemSeverity}
                            </Box>
                          </TableCell>
                          {
                            !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton size='small' onClick={() => id && ICDCode && handleEdit(id, ICDCode)}>
                                  <EditOutlinedIcon />
                                </IconButton>

                                <IconButton size='small' onClick={() => id && onDeleteClick(id)}>
                                  <TrashOutlinedSmallIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          }
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  }
                </Table>

                {((!loading && patientProblems?.length === 0) || error) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <ConfirmationModal
          title={PROBLEM_TEXT}
          isOpen={openDelete}
          isLoading={removeProblemLoading}
          description={DELETE_PROBLEM_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
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

      {totalPages > 1 && !loading && (
        <Box display="flex" justifyContent="flex-end" p={3}>
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

export default ProblemTab;

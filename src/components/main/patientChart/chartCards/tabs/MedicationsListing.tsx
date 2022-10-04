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
import AddMedication from "../../medications/modals/AddMedication";
import MedicationModal from "../../medications/modals/MedicationModal";
// constants, utils, interfaces ang graphql block
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import {
  ACTIONS, ADD_NEW_TEXT, COMMENTS, DASHES, DELETE_MEDICATION_DESCRIPTION, EIGHT_PAGE_LIMIT, MEDICATIONS_TEXT, MEDICATION_PROBLEM_DELETED, MEDICATION_TEXT, NEXT, SIG, START_DATE, STATUS
} from "../../../../../constants";
import { Medications, PatientMedicationsPayload, useFindAllPatientMedicationsLazyQuery, useRemovePatientMedicationMutation } from "../../../../../generated/graphql";
import { MedicationTabProps, ParamsType } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { getFormatDateString, getPageNumber, getProblemTypeColor, isLast, renderTh } from "../../../../../utils";

const MedicationTab: FC<MedicationTabProps> = ({ shouldDisableEdit, handleStep }) => {
  const classes = useChartingStyles();
  const classesTable = useTableStyles()
  const { id } = useParams<ParamsType>()

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const {
    isSubModalOpen, selectedItem, itemId, medicationDeleteId, totalPages, page, isOpen,
    openDelete, patientMedications
  } = state || {}

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page: page })

  const [findAllPatientMedications, { loading, error }] = useFindAllPatientMedicationsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_MEDICATIONS, patientMedications: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientMedications } = data;

        if (findAllPatientMedications) {
          const { response, patientMedications, pagination } = findAllPatientMedications

          if (response) {
            const { status } = response

            if (patientMedications && status && status === 200) {
              dispatch({ type: ActionType.SET_PATIENT_MEDICATIONS, patientMedications: patientMedications as PatientMedicationsPayload['patientMedications'] })
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

  const fetchMedications = useCallback(async () => {
    try {
      await findAllPatientMedications({
        variables: {
          patientMedicationInput: {
            patientId: id,
            paginationOptions: { page, limit: EIGHT_PAGE_LIMIT },
            // ...(appointmentId ? { appointmentId } : {})
          }
        },
      })
    } catch (error) { }
  }, [findAllPatientMedications, id, page]);

  useEffect(() => {
    id && fetchMedications()
  }, [fetchMedications, id, page])

  const handleEditModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleEdit = (id: string, medication: Medications) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: medication })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const [removePatientMedication, { loading: removeMedicationLoading }] = useRemovePatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(MEDICATION_PROBLEM_DELETED);
          dispatch({ type: ActionType.SET_MEDICATION_DELETE_ID, medicationDeleteId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!patientMedications && (patientMedications.length > 1 || isLast(patientMedications.length, page))) {
            await fetchMedications()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientMedications?.length || 0) })
          }
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_MEDICATION_DELETE_ID, medicationDeleteId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    medicationDeleteId && await removePatientMedication({
      variables: { removePatientMedication: { id: medicationDeleteId } }
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box className={classes.cardBox}>
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant='h3'>{MEDICATIONS_TEXT}</Typography>

                <Box display='flex' alignItems='center'>
                  {!shouldDisableEdit &&
                    <Button
                      variant='contained' color='primary'
                      startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                      onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                      {ADD_NEW_TEXT}
                    </Button>}

                  <Box p={1} />

                  {handleStep && <Button
                    variant='contained'
                    color='secondary'
                    size="large"
                    onClick={()=>handleStep(6)}
                  >
                    {NEXT}
                  </Button>}
                </Box>
              </Box>

              <Box className={classes.tableBox}>
                <Table aria-label="customized table" className={classesTable.table}>
                  <TableHead>
                    <TableRow>
                      {renderTh(MEDICATION_TEXT)}
                      {renderTh(START_DATE)}
                      {renderTh(SIG)}
                      {renderTh(STATUS)}
                      {renderTh(COMMENTS)}
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
                    {patientMedications?.map((patientMedication) => {
                      const { id, medication, note, sig, startDate, status } = patientMedication ?? {}
                      return (
                        <TableRow>
                          <TableCell scope="row">
                            <Typography>{medication?.fullName ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{getFormatDateString(startDate, "MM/DD/YYYY") ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>
                              {sig ?? DASHES}
                            </Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox} bgcolor={getProblemTypeColor(status?.toUpperCase() || '')}>
                              {status}
                            </Box>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography className={classes.textOverflow}>{note}</Typography>
                          </TableCell>

                          {
                            !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton size='small' onClick={() => id && medication && handleEdit(id, medication)}>
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

                {((!loading && patientMedications?.length === 0) || error) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <ConfirmationModal
          title={MEDICATION_TEXT}
          isOpen={openDelete}
          isLoading={removeMedicationLoading}
          description={DELETE_MEDICATION_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
        />

        {isSubModalOpen && <MedicationModal
          item={selectedItem}
          dispatcher={dispatch}
          isEdit
          recordId={itemId}
          fetch={async () => fetchMedications()}
          handleClose={handleEditModalClose}
          isOpen={isSubModalOpen}
        />
        }
      </Grid>

      {isOpen &&
        <AddMedication isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchMedications()} />}

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

export default MedicationTab;

import {
  Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
// components block
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import TableLoader from "../../../../common/TableLoader";
import AddAllergy from "../../allergies/modals/AddAllergy";
import AllergyModal from "../../allergies/modals/AllergyModal";
// constants, utils, styles, interfaces and graphql block
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import {
  ACTIONS, ACTIVE, ADD_NEW_TEXT, ALLERGIES_TEXT, ALLERGY_TEXT, DASHES, DELETE_ALLERGY_DESCRIPTION,
  EIGHT_PAGE_LIMIT, INACTIVE, NEXT, NOTES, ONSET_DATE, PAGE_LIMIT, PATIENT_ALLERGY_DELETED, SEVERITY,
  STATUS
} from "../../../../../constants";
import {
  Allergies, PatientAllergiesPayload, useFindAllPatientAllergiesLazyQuery, useRemovePatientAllergyMutation
} from "../../../../../generated/graphql";
import { AllergyTabProps, ParamsType } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { GREEN, RED, WHITE } from "../../../../../theme";
import {
  formatValue, getFormatDateString, getPageNumber, getSeverityColor, isLast, renderTh
} from "../../../../../utils";

const AllergyTab: FC<AllergyTabProps> = ({ shouldDisableEdit, handleStep }) => {
  const { id } = useParams<ParamsType>()
  const classes = useChartingStyles()
  const classesTable = useTableStyles();

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { isSubModalOpen, selectedItem, itemId, allergyDeleteId, patientAllergies, totalPages, page, isOpen, openDelete } = state || {}

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page: page })

  const [findAllPatientAllergies, { loading, error }] = useFindAllPatientAllergiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_ALLERGIES, patientAllergies: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientAllergies } = data;

        if (findAllPatientAllergies) {
          const { response, patientAllergies, pagination } = findAllPatientAllergies

          if (response) {
            const { status } = response

            if (patientAllergies && status && status === 200) {
              dispatch({ type: ActionType.SET_PATIENT_ALLERGIES, patientAllergies: patientAllergies as PatientAllergiesPayload['patientAllergies'] })
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

  const fetchAllergies = useCallback(async () => {
    try {
      await findAllPatientAllergies({
        variables: {
          patientAllergyInput: {
            patientId: id,
            paginationOptions: { page, limit: EIGHT_PAGE_LIMIT },
            // ...(appointmentId ? { appointmentId } : {})
          }
        },
      })
    } catch (error) { }
  }, [findAllPatientAllergies, id, page]);

  useEffect(() => {
    id && fetchAllergies()
  }, [fetchAllergies, id])

  const handleEditModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleEdit = (id: string, allergy: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: allergy })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const [removePatientAllergy, { loading: removeAllergyLoading }] = useRemovePatientAllergyMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientAllergy: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          Alert.success(PATIENT_ALLERGY_DELETED);
          dispatch({ type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: '' })

          if (!!patientAllergies && (patientAllergies.length > 1 || isLast(patientAllergies?.length, page))) {
            await fetchAllergies()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientAllergies?.length || 0) })
          }
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    allergyDeleteId && await removePatientAllergy({
      variables: { removePatientAllergy: { id: allergyDeleteId } }
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box className={classes.cardBox}>
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant='h3'>{ALLERGIES_TEXT}</Typography>

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
                    onClick={()=>handleStep()}
                  >
                    {NEXT}
                  </Button>}
                </Box>
              </Box>

              <Box className={classes.tableBox}>
                <Table aria-label="customized table" className={classesTable.table}>
                  <TableHead>
                    <TableRow>
                      {renderTh(ALLERGY_TEXT)}
                      {renderTh(ONSET_DATE)}
                      {renderTh(SEVERITY)}
                      {renderTh(NOTES)}
                      {renderTh(STATUS)}
                      {!shouldDisableEdit && renderTh(ACTIONS)}
                    </TableRow>
                  </TableHead>

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
                      </TableCell>
                    </TableRow>
                  ) : <TableBody>
                    {patientAllergies?.map((patientAllergy) => {
                      const {
                        allergySeverity, allergyStartDate, allergy, comments, isActive, id
                      } = patientAllergy ?? {}
                      const ActiveStatus = isActive ? ACTIVE : INACTIVE;
                      const StatusColor = isActive ? GREEN : RED

                      return (
                        <TableRow>
                          <TableCell scope="row">
                            <Typography>{allergy?.name}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>
                              {allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : DASHES}
                            </Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox}
                              bgcolor={allergySeverity && getSeverityColor(allergySeverity)}
                            >
                              {allergySeverity ? formatValue(allergySeverity) : DASHES}
                            </Box>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography className={classes.textOverflow}>{comments}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox} color={WHITE} bgcolor={StatusColor}>
                              {ActiveStatus}
                            </Box>
                          </TableCell>

                          {!shouldDisableEdit && <TableCell scope="row">
                            <Box display='flex' alignItems='center'>
                              <IconButton size='small' onClick={() => id && allergy && handleEdit(id, allergy)}>
                                <EditOutlinedIcon />
                              </IconButton>

                              <IconButton size='small' onClick={() => id && onDeleteClick(id)}>
                                <TrashOutlinedSmallIcon />
                              </IconButton>
                            </Box>
                          </TableCell>}
                        </TableRow>
                      )
                    })}
                  </TableBody>}
                </Table>

                {((!loading && patientAllergies?.length === 0) || error) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <ConfirmationModal
          title={ALLERGIES_TEXT}
          isOpen={openDelete}
          isLoading={removeAllergyLoading}
          description={DELETE_ALLERGY_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
        />

        {isSubModalOpen && <AllergyModal
          item={selectedItem}
          dispatcher={dispatch}
          isEdit
          recordId={itemId}
          fetch={async () => fetchAllergies()}
          handleClose={handleEditModalClose}
          isOpen={isSubModalOpen}
        />
        }
      </Grid>
      {
        isOpen &&
        <AddAllergy isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchAllergies()} />
      }

      {
        totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" p={3}>
            <Pagination
              count={totalPages}
              shape="rounded"
              variant="outlined"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )
      }
    </>
  )
}

export default AllergyTab;

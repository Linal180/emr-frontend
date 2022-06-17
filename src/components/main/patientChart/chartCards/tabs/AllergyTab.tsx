import { Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import { ACTIONS, ADD_NEW_TEXT, ALLERGIES_TEXT, ALLERGY_TEXT, DASHES, DELETE_ALLERGY_DESCRIPTION, LIST_PAGE_LIMIT, NOTES, ONSET_DATE, PATIENT_ALLERGY_DELETED, SEVERITY, STATUS } from "../../../../../constants";
import { Allergies, PatientAllergiesPayload, useFindAllPatientAllergiesLazyQuery, useRemovePatientAllergyMutation } from "../../../../../generated/graphql";
import { ChartComponentProps, ParamsType } from "../../../../../interfacesTypes";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { GREEN } from "../../../../../theme";
import { formatValue, getFormatDateString, getSeverityColor, renderTh } from "../../../../../utils";
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import AddAllergy from "../../allergies/modals/AddAllergy";
import AllergyModal from "../../allergies/modals/AllergyModal";

const AllergyTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const classes = useChartingStyles()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergiesPayload['patientAllergies']>([])
  const [{ isSubModalOpen, selectedItem, itemId, allergyDeleteId }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const { id } = useParams<ParamsType>()

  const handleModalClose = () => {
    setIsOpen(!isOpen)
  }

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const [findAllPatientAllergies, { loading, error }] = useFindAllPatientAllergiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientAllergies([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientAllergies } = data;

        if (findAllPatientAllergies) {
          const { response, patientAllergies, pagination } = findAllPatientAllergies

          if (response) {
            const { status } = response

            if (patientAllergies && status && status === 200) {
              setPatientAllergies(patientAllergies as PatientAllergiesPayload['patientAllergies'])
            }
          }

          if (pagination) {
            const { totalPages } = pagination
            typeof totalPages === 'number' && setTotalPages(totalPages)
          }
        }
      }
    }
  });
  const fetchAllergies = useCallback(async () => {
    try {
      await findAllPatientAllergies({
        variables: {
          patientAllergyInput: { patientId: id, paginationOptions: { page, limit: LIST_PAGE_LIMIT } }
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
          await fetchAllergies()
          Alert.success(PATIENT_ALLERGY_DELETED);
          dispatch({ type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: '' })
          setOpenDelete(false)
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: id })
      setOpenDelete(true)
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
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h3'>{ALLERGIES_TEXT}</Typography>

                {
                  !shouldDisableEdit && <Button variant='contained' color='primary' onClick={() => setIsOpen(true)}>
                    <AddWhiteIcon />
                    <Box p={0.5} />
                    {ADD_NEW_TEXT}
                  </Button>
                }
              </Box>

              {loading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> :
                <Box className={classes.tableBox}>
                  <Table aria-label="customized table">
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

                    <TableBody>
                      {patientAllergies?.map((patientAllergy) => {
                        const { allergySeverity, allergyStartDate, allergy, comments, isActive, id } = patientAllergy ?? {}
                        return (
                          <TableRow>
                            <TableCell scope="row">
                              <Typography>{allergy?.name}</Typography>
                            </TableCell>

                            <TableCell scope="row">
                              <Typography>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : DASHES}</Typography>
                            </TableCell>

                            <TableCell scope="row">
                              <Box className={classes.activeBox} bgcolor={allergySeverity && getSeverityColor(allergySeverity)}>
                                {allergySeverity ? formatValue(allergySeverity) : DASHES}
                              </Box>
                            </TableCell>

                            <TableCell scope="row">
                              <Typography className={classes.textOverflow}>{comments}</Typography>
                            </TableCell>

                            <TableCell scope="row">
                              <Box className={classes.activeBox} bgcolor={GREEN}>
                                {isActive ? 'Active' : 'Deactive'}
                              </Box>
                            </TableCell>

                            {
                              !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton onClick={() => id && allergy && handleEdit(id, allergy)}>
                                  <EditOutlinedIcon />
                                </IconButton>

                                <IconButton onClick={() => id && onDeleteClick(id)}>
                                  <TrashOutlinedSmallIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                            }
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {((!loading && patientAllergies?.length === 0) || error) && (
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
          title={ALLERGIES_TEXT}
          isOpen={openDelete}
          isLoading={removeAllergyLoading}
          description={DELETE_ALLERGY_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => setOpenDelete(open)}
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
      {isOpen &&
        <AddAllergy isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchAllergies()} />}

      {totalPages > 1 && (
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

export default AllergyTab;

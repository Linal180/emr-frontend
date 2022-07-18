import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { Pagination } from "@material-ui/lab";
import {
  Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
  Typography
} from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import TableLoader from "../../../../common/TableLoader";
import AddAllergy from "../../allergies/modals/AddAllergy";
import AllergyModal from "../../allergies/modals/AllergyModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// constants, utils, styles, interfaces and graphql block
import { GREEN, RED, WHITE } from "../../../../../theme";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { ChartComponentProps, ParamsType } from "../../../../../interfacesTypes";
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import {
  formatValue, getFormatDateString, getSeverityColor, renderTh, getPageNumber
} from "../../../../../utils";
import {
  Allergies, PatientAllergiesPayload, useFindAllPatientAllergiesLazyQuery, useRemovePatientAllergyMutation
} from "../../../../../generated/graphql";
import {
  ACTIONS, ACTIVE, ADD_NEW_TEXT, ALLERGIES_TEXT, ALLERGY_TEXT, DASHES, DELETE_ALLERGY_DESCRIPTION,
  EIGHT_PAGE_LIMIT, INACTIVE, NOTES, ONSET_DATE, PAGE_LIMIT, PATIENT_ALLERGY_DELETED, SEVERITY,
  STATUS
} from "../../../../../constants";

const AllergyTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const { id } = useParams<ParamsType>()
  const classes = useChartingStyles()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

  const [patientAllergies, setPatientAllergies] = useState<PatientAllergiesPayload['patientAllergies']>([])
  const [{ isSubModalOpen, selectedItem, itemId, allergyDeleteId }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)

  const handleModalClose = () => setIsOpen(!isOpen);
  const handleChange = (_: ChangeEvent<unknown>, page: number) => setPage(page)

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
          patientAllergyInput: { patientId: id, paginationOptions: { page, limit: EIGHT_PAGE_LIMIT } }
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
          setOpenDelete(false)
          Alert.success(PATIENT_ALLERGY_DELETED);
          dispatch({ type: ActionType.SET_ALLERGY_DELETE_ID, allergyDeleteId: '' })

          if (!!patientAllergies && patientAllergies.length > 1) {
            await fetchAllergies()
          } else {
            setPage(getPageNumber(page, patientAllergies?.length || 0))
          }
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
                              <IconButton onClick={() => id && allergy && handleEdit(id, allergy)}>
                                <EditOutlinedIcon />
                              </IconButton>

                              <IconButton onClick={() => id && onDeleteClick(id)}>
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

import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { Pagination, TabContext, TabList, TabPanel } from "@material-ui/lab";
import {
  Box, Button, Card, colors, FormControl, Grid, IconButton, InputLabel, Tab, Table, TableBody, TableCell, TableHead, TableRow,
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
import { GREEN, GREY_SEVEN, RED, WHITE, WHITE_THREE } from "../../../../../theme";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';
import { useTableStyles } from "../../../../../styles/tableStyles";
import { ChartComponentProps, ParamsType } from "../../../../../interfacesTypes";
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import { Action, ActionType, chartReducer, initialState, State } from "../../../../../reducers/chartReducer";
import {
  formatValue, getFormatDateString, getSeverityColor, renderTh, getPageNumber, isLast
} from "../../../../../utils";
import {
  Allergies, PatientAllergiesPayload, useFindAllPatientAllergiesLazyQuery, useRemovePatientAllergyMutation
} from "../../../../../generated/graphql";
import {
  ACTIONS, ACTIVE, ADD_NEW_TEXT, ALLERGIES_TEXT, DASHES, DELETE_ALLERGY_DESCRIPTION,
  EIGHT_PAGE_LIMIT, FAMILY_HISTORY_TEXT, HISTORY_CHARTING_TABS, INACTIVE, NOTES, ONSET_DATE, PAGE_LIMIT, PATIENT_ALLERGY_DELETED, SEVERITY,
  SOCIAL_HISTORY_TEXT, STATUS, SURGICAL_HISTORY_TEXT, YES_TEXT,
} from "../../../../../constants";
import { Controller, FormProvider, useForm } from "react-hook-form";
import InputController from "../../../../../controller";
import { AntSwitch } from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";

const HistoryTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const { id } = useParams<ParamsType>()
  const classes = useChartingStyles();
  const toggleButtonClass = usePublicAppointmentStyles();
  const classesTable = useTableStyles();

  const [tabValue, setTabValue] = useState("1");

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const { isSubModalOpen, selectedItem, itemId, allergyDeleteId, patientAllergies, totalPages, page, isOpen, openDelete } = state || {}

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });
  const handleChange = (_: ChangeEvent<unknown>, tab: string) => setTabValue(tab)

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

  const methods = useForm({
    mode: "all",
  });

  const { handleSubmit, setValue, control } = methods;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <TabContext value={tabValue}>
            <Box mb={1}>
              <TabList className={classes.tabList}
                orientation='horizontal'
                onChange={handleChange}
                aria-label="communication tabs"
              >
                {HISTORY_CHARTING_TABS.map(item => {
                  const { title, value } = item

                  return <Tab className={classes.tab}
                    key={`${title}-${value}`}
                    label={title}
                    value={value}
                  />
                })}
              </TabList>
            </Box>

            <Card>
              <Box className={classes.cardBox} px={2}>
                <TabPanel value="1">
                  <FormProvider {...methods}>
                    <form>
                      <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
                        <Typography variant='h3'>{'Activities of Daily Living'}</Typography>
                      </Box>

                      <Grid container alignItems="center">
                        <Grid item md={6} sm={12} xs={12}>
                          <Box>
                            <Typography variant="body1" color="initial">Are you able to care for yourself?</Typography>
                          </Box>
                        </Grid>

                        <Grid item md={2} sm={6} xs={12}>
                          <Controller
                            name='phoneEmailPermission'
                            control={control}
                            render={() => (
                              <FormControl fullWidth margin="normal" className={toggleButtonClass.toggleContainer}>
                                <label className="toggle-main">
                                  <Box color={GREY_SEVEN}>{YES_TEXT}</Box>

                                  <AntSwitch
                                    // onChange={(event) => { handleChange(event) }}
                                    name='phoneEmailPermission'
                                  />

                                  <Box color={WHITE}>{'NO_TEXT'}</Box>
                                </label>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid item md={4} sm={6} xs={12}>
                          <Box>
                            <InputController
                              fieldType="text"
                              loading={loading}
                              controllerName="notes"
                              placeholder={NOTES}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </FormProvider>
                </TabPanel>

                <TabPanel value="2">
                  <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h3'>{FAMILY_HISTORY_TEXT}</Typography>

                    {!shouldDisableEdit &&
                      <Button
                        variant='contained' color='primary'
                        startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                        onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                        {ADD_NEW_TEXT}
                      </Button>}
                  </Box>
                </TabPanel>

                <TabPanel value="3">
                  <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h3'>{SURGICAL_HISTORY_TEXT}</Typography>

                    {!shouldDisableEdit &&
                      <Button
                        variant='contained' color='primary'
                        startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                        onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                        {ADD_NEW_TEXT}
                      </Button>}
                  </Box>
                </TabPanel>

                {/* <Box className={classes.tableBox}>
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
                </Box> */}
              </Box>
            </Card>
          </TabContext>
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

      {/* {
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
      } */}
    </>
  )
}

export default HistoryTab;

// packages block
import { FC, ChangeEvent, useEffect, useContext, useCallback, Reducer, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { FormProvider, useForm } from "react-hook-form";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Collapse, Grid, Typography, Button
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import InputController from "../../../../controller";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import DoctorSelector from "../../../common/Selector/DoctorSelector";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from '../../../../assets/svgs';
import { PatientSearchInputProps } from "../../../../interfacesTypes";
import { BLACK_TWO, GREY_FIVE, GREY_NINE, GREY_TEN } from "../../../../theme";
import {
  formatPhone, getFormatDateString, isFacilityAdmin, isOnlyDoctor, isPracticeAdmin, isSuperAdmin,
  checkPermission, isUser, renderTh, getTimestampsForDob
} from "../../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import {
  PatientsPayload, PatientPayload, useRemovePatientMutation, useFetchAllPatientLazyQuery
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, CANT_DELETE_PATIENT, DELETE_PATIENT_DESCRIPTION, PATIENTS_ROUTE, NAME,
  PATIENT, PRN, PatientSearchingTooltipData, ADVANCED_SEARCH, DOB, DATE_OF_SERVICE, LOCATION, PROVIDER,
  US_DATE_FORMAT, RESET, USER_PERMISSIONS, ROOT_ROUTE, PERMISSION_DENIED
} from "../../../../constants";
import history from "../../../../history";

const PatientsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user, currentUser, userPermissions } = useContext(AuthContext)
  const { id: currentUserId } = currentUser || {}
  const { roles, facility } = user || {};

  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const isRegularUser = isUser(roles);

  const isDoctor = isOnlyDoctor(roles);
  const { id: facilityId, practiceId } = facility || {}
  const [open, setOpen] = useState<boolean>(false)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removePatient)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updatePatient)
  const { page, totalPages, searchQuery, openDelete, deletePatientId, patients, doctorId } = state;
  const methods = useForm<PatientSearchInputProps>({ mode: "all" });

  const { watch, setValue } = methods;
  const {
    location: { id: selectedLocationId } = {},
    dob, dos, provider: { id: selectedProviderId } = {}
  } = watch()

  const [fetchAllPatientsQuery, { loading, error }] = useFetchAllPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { fetchAllPatients } = data || {};

      if (fetchAllPatients) {
        const { pagination, patients } = fetchAllPatients
        patients && dispatch({
          type: ActionType.SET_PATIENTS,
          patients: patients as PatientsPayload['patients']
        })

        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      } else {
        dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } :
        isPracticeUser ? { practiceId, facilityId: selectedLocationId, ...pageInputs } :
          isFacAdmin || isRegularUser ? { facilityId, ...pageInputs } : undefined

      patientsInputs && await fetchAllPatientsQuery({
        variables: {
          patientInput: {
            ...patientsInputs, searchString: searchQuery, dob: getFormatDateString(dob, 'MM-DD-YYYY'),
            doctorId: isDoctor ? doctorId : selectedProviderId,
            appointmentDate: getFormatDateString(dos),
            ...(isSuper || isPracticeUser ? { facilityId: selectedLocationId } : {}),
          }
        }
      })
    } catch (error) { }
  }, [
    page, isSuper, isPracticeUser, practiceId, selectedLocationId, isFacAdmin, isRegularUser,
    facilityId, fetchAllPatientsQuery, searchQuery, dob, isDoctor, doctorId, selectedProviderId, dos
  ])

  const [removePatient, { loading: deletePatientLoading }] = useRemovePatientMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_PATIENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removePatient: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          fetchAllPatients();
        }
      }
    }
  });

  useEffect(() => {
    if(!checkPermission(userPermissions, USER_PERMISSIONS.fetchAllPatients)){
      history.push(ROOT_ROUTE)
      Alert.error(PERMISSION_DENIED)
    }
  }, [user, userPermissions]);

  useEffect(() => {
    isDoctor && currentUserId &&
      dispatch({ type: ActionType.SET_DOCTOR_ID, doctorId: currentUserId })
  }, [currentUserId, doctorId, isDoctor])

  useEffect(() => {
    fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    dispatch({ type: ActionType.SET_PAGE, page });
  }

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_PATIENT_ID, deletePatientId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeletePatient = async () => {
    deletePatientId && await removePatient({
      variables: { removePatient: { id: deletePatientId } }
    })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const handleClearField = (fieldName: any) => {
    setValue(fieldName, '')
  }

  const handleReset = () => {
    setValue("dob", '')
    setValue('dos', '')
    setValue("location", { id: '', name: "" })
    setValue('provider', { id: '', name: "" })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Grid container spacing={3}>
          <Grid item md={4} sm={12} xs={12}>
            <Search search={search} info tooltipData={PatientSearchingTooltipData} />
          </Grid>
          <Grid item md={2} sm={12} xs={12}>
            <Box
              onClick={() => setOpen(!open)} className='pointer-cursor'
              border={`1px solid ${GREY_FIVE}`} borderRadius={4}
              color={BLACK_TWO} p={1.35} display='flex' width={186}
            >
              <Typography variant="body1">{ADVANCED_SEARCH}</Typography>
              {open ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </Grid>
        </Grid>

        <Collapse in={open} mountOnEnter unmountOnExit>
          <FormProvider {...methods}>
            <Box p={3} mt={2} bgcolor={GREY_NINE} border={`1px solid ${GREY_TEN}`} borderRadius={4}>
              <Grid container spacing={3}>
                <Grid item md={3} sm={6} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="dob"
                    controllerLabel={DOB}
                    clearable={!!dob}
                    handleClearField={handleClearField}
                    placeholder={US_DATE_FORMAT}
                  />
                </Grid>

                <Grid item md={3} sm={6} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="dos"
                    controllerLabel={DATE_OF_SERVICE}
                    clearable={!!dos}
                    handleClearField={handleClearField}
                    placeholder={US_DATE_FORMAT}
                  />
                </Grid>

                {(isSuper || isPracticeUser) &&
                  <Grid item md={3} sm={12} xs={12}>
                    <FacilitySelector
                      label={LOCATION}
                      name="location"
                      addEmpty
                    />
                  </Grid>
                }

                <Grid item md={3} sm={12} xs={12}>
                  <DoctorSelector
                    label={PROVIDER}
                    name="provider"
                    shouldOmitFacilityId
                    addEmpty
                  />
                </Grid>

                <Grid item md={(isSuper || isPracticeUser) ? 12 : 3} sm={12} xs={12}>
                  <Box display='flex' justifyContent='flex-end' alignItems='center'
                    style={{ marginTop: (isSuper || isPracticeUser) ? 0 : 20 }}
                  >
                    <Button variant="outlined" color="default" onClick={handleReset}>{RESET}</Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </Collapse>

        <Box className="table-overflow" mt={4}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(PRN)}
                {renderTh(NAME)}
                {renderTh(EMAIL)}
                {renderTh(PHONE)}
                {renderTh(DOB)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {(loading) ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                patients?.map((record: PatientPayload['patient']) => {
                  const { id, patientRecord, firstName, lastName, email, dob, contacts } = record || {};

                  const patientContact = contacts && contacts.filter(contact => contact.primaryContact)[0];
                  const { phone } = patientContact || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">
                        <Link to={`${PATIENTS_ROUTE}/${id}/details`}>
                          {patientRecord}
                        </Link>
                      </TableCell>
                      <TableCell scope="row"> {`${firstName} ${lastName}`}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{dob && getTimestampsForDob(dob)}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${PATIENTS_ROUTE}/${id}`} className={canUpdate ? '' : 'disable-icon'}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={`${classes.iconsBackground} ${canDelete ? '' : 'disable-icon'}`}>
                            <Button onClick={() => onDeleteClick(id || '')} disabled={!canDelete}>
                              <TrashNewIcon />
                            </Button>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {((!(loading) && !patients?.length) || (error)) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={PATIENT}
            isOpen={openDelete}
            isLoading={deletePatientLoading}
            description={DELETE_PATIENT_DESCRIPTION}
            handleDelete={handleDeletePatient}
            setOpen={(openDelete: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete })}
          />
        </Box>
      </Box>

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
  );
};

export default PatientsTable;

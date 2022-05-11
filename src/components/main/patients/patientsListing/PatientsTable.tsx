// packages block
import { FC, ChangeEvent, useEffect, useContext, useCallback, Reducer, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Collapse, Grid, Typography, Button } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from '../../../../assets/svgs';
import { formatPhone, getFormatDateString, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderTh } from "../../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import {
  PatientsPayload, PatientPayload, useRemovePatientMutation, useFetchAllPatientLazyQuery
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, CANT_DELETE_PATIENT, DELETE_PATIENT_DESCRIPTION, PATIENTS_ROUTE, NAME, CITY, PATIENT, PRN,
  PatientSearchingTooltipData, ADVANCED_SEARCH, DOB, DATE_OF_SERVICE, LOCATION, PROVIDER, US_DATE_FORMAT, RESET
} from "../../../../constants";
import { BLACK_TWO, GREY_FIVE, GREY_NINE, GREY_TEN } from "../../../../theme";
import { FormProvider, useForm } from "react-hook-form";
import { PatientSearchInputProps } from "../../../../interfacesTypes";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
import DoctorSelector from "../../../common/Selector/DoctorSelector";
import InputController from "../../../../controller";

const PatientsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const { id: facilityId, practiceId } = facility || {}
  const [open, setOpen] = useState<boolean>(false)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deletePatientId, patients } = state;
  const methods = useForm<PatientSearchInputProps>({ mode: "all" });
  const { watch, setValue } = methods;
  const {location : {id : selectedLocationId} = {}, dob, dos, provider: {id:selectedProviderId} = {} } =watch()

  const [fetchAllPatientsQuery,{loading,error}] = useFetchAllPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { fetchAllPatients } = data || {};

      if (fetchAllPatients) {
        const { pagination, patients } = fetchAllPatients
        patients && dispatch({ type: ActionType.SET_PATIENTS, patients: patients as PatientsPayload['patients'] })
        
        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages==='number'  &&  dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } :
        isPracAdmin ? { practiceId, ...pageInputs } :
          isFacAdmin ? { facilityId, ...pageInputs } : undefined

      patientsInputs && await fetchAllPatientsQuery({
        variables: { patientInput: { 
          ...patientsInputs, searchString: searchQuery, dob:getFormatDateString(dob,'MM-DD-YYYY'),
          doctorId:selectedProviderId,
          appointmentDate:getFormatDateString(dos),
        ...( !isFacAdmin ? {facilityId: selectedLocationId}:{}),} }
      })
    } catch (error) { }
  }, [page, isSuper, isPracAdmin, practiceId, isFacAdmin, facilityId, fetchAllPatientsQuery, searchQuery, dob, selectedProviderId, dos, selectedLocationId])

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

  useEffect(() => { }, [user]);
  useEffect(() => {
    fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    dispatch({ type: ActionType.SET_PAGE, page });
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' });
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

  const handleClearField= (fieldName:any) =>{
    setValue(fieldName,'')
  }

  const handleReset=()=>{
    setValue("dob",'')
    setValue('dos','')
    setValue("location", { id:'',name:"" })
    setValue('provider', { id:'',name:"" })
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

                  {(isSuper || isPracAdmin) &&
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
                  {!(isSuper || isPracAdmin) && <Grid item md={5} sm={12} xs={12} />}
                  <Grid item md={(isSuper || isPracAdmin) ? 11 : 6} />
                  <Box px={1}>
                    <Button variant="contained" color="secondary" onClick={handleReset}>{RESET}</Button>
                  </Box>
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
                {renderTh(CITY)}
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
                  const { id, patientRecord, firstName, lastName, email, contacts } = record || {};

                  const patientContact = contacts && contacts.filter(contact => contact.primaryContact)[0];
                  const { phone, city } = patientContact || {};

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
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${PATIENTS_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                            <TrashNewIcon />
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

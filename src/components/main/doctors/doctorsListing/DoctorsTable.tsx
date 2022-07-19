// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import Selector from "../../../common/Selector";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from "../../../../assets/svgs";
import { DoctorSearchInputProps } from "../../../../interfacesTypes";
import { Action, ActionType, doctorReducer, initialState, State } from "../../../../reducers/doctorReducer";
import {
  checkPermission, formatPhone, formatEnumMember, isFacilityAdmin, isPracticeAdmin, isSuperAdmin,
  isUser, renderTh, getPageNumber
} from "../../../../utils";
import {
  AllDoctorPayload, DoctorPayload, Speciality, useFindAllDoctorLazyQuery, useRemoveDoctorMutation
} from "../../../../generated/graphql";
import {
  ACTION, CANT_DELETE_DOCTOR, DELETE_DOCTOR_DESCRIPTION, DOCTOR, DOCTORS_ROUTE, EMAIL, FACILITY,
  MAPPED_SPECIALTIES, NAME, PAGE_LIMIT, PERMISSION_DENIED, PHONE, ROOT_ROUTE,
  SPECIALTY, USER_PERMISSIONS
} from "../../../../constants";

const DoctorsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user, userPermissions } = useContext(AuthContext)
  const { facility, roles } = user || {}

  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);

  const isFacAdmin = isFacilityAdmin(roles);
  const isRegularUser = isUser(roles)
  const methods = useForm<DoctorSearchInputProps>({ mode: "all" });

  const { watch } = methods;
  const { facilityId: selectedFacilityId, speciality } = watch()
  const { id: selectedFacility } = selectedFacilityId || {}
  const { id: selectedSpecialty } = speciality || {}

  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removeDoctor)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updateDoctor)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deleteDoctorId, doctors } = state;

  const [findAllDoctor, { loading, error }] = useFindAllDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_DOCTORS, doctors: [] })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { doctors, pagination } = findAllDoctor

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        doctors && dispatch({ type: ActionType.SET_DOCTORS, doctors: doctors as AllDoctorPayload['doctors'] })
      } else {
        dispatch({ type: ActionType.SET_DOCTORS, doctors: [] })
      }
    }
  });

  const fetchAllDoctors = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const doctorInputs = isSuper ? { ...pageInputs } :
        isPracticeUser ? { practiceId, ...pageInputs } :
          isFacAdmin || isRegularUser ? { facilityId, ...pageInputs } : undefined

      const searchFilterInputs = {
        ...(selectedFacility ? { facilityId: selectedFacility } : {}),
        ...(selectedSpecialty ? { speciality: selectedSpecialty as Speciality } : {}),
      }

      doctorInputs && await findAllDoctor({
        variables: { doctorInput: { ...doctorInputs, searchString: searchQuery, ...searchFilterInputs } }
      })
    } catch (error) { }
  }, [
    facilityId, findAllDoctor, isFacAdmin, isPracticeUser, isRegularUser, isSuper, page, practiceId,
    searchQuery, selectedFacility, selectedSpecialty
  ])

  const [removeDoctor, { loading: deleteDoctorLoading }] = useRemoveDoctorMutation({
    onError() {
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
      Alert.error(CANT_DELETE_DOCTOR)
    },

    onCompleted(data) {
      if (data) {
        const { removeDoctor: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!doctors && doctors.length > 1) {
            fetchAllDoctors()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, doctors?.length || 0) })
          }
        }
      }
    }
  });

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllDoctor)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions])

  useEffect(() => {
    fetchAllDoctors()
  }, [page, searchQuery, practiceId, roles, fetchAllDoctors]);

  useEffect(() => { }, [user]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_DOCTOR_ID, deleteDoctorId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteDoctor = async () => {
    deleteDoctorId &&
      await removeDoctor({
        variables: { removeDoctor: { id: deleteDoctorId } }
      })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Grid container spacing={3}>
          <Grid item md={4} sm={12} xs={12}>
            <Box mt={2}>
              <Search search={search} />
            </Box>
          </Grid>

          <Grid item md={8} sm={12} xs={12}>
            <FormProvider {...methods}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={SPECIALTY}
                    name="speciality"
                    options={MAPPED_SPECIALTIES}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FacilitySelector
                    label={FACILITY}
                    name="facilityId"
                    addEmpty
                  />
                </Grid>
              </Grid>
            </FormProvider>
          </Grid>
        </Grid>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(EMAIL)}
                {renderTh(PHONE)}
                {renderTh(SPECIALTY)}
                {renderTh(FACILITY)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                doctors?.map((doctor: DoctorPayload['doctor']) => {
                  const { id, firstName, lastName, speciality, contacts, facility, email } = doctor || {};
                  const doctorContact = contacts?.find(contact => contact.primaryContact);
                  const { phone } = doctorContact || {};
                  const { name } = facility || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">
                        <Link to={`${DOCTORS_ROUTE}/${id}/details`}>
                          {`${firstName} ${lastName}`}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{speciality ? formatEnumMember(speciality as string) : ''}</TableCell>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${DOCTORS_ROUTE}/${id}`} className={canUpdate ? '' : 'disable-icon'}>
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
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && doctors?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={DOCTOR}
            isOpen={openDelete}
            isLoading={deleteDoctorLoading}
            handleDelete={handleDeleteDoctor}
            description={DELETE_DOCTOR_DESCRIPTION}
            setOpen={(openDelete: boolean) => dispatch({
              type: ActionType.SET_OPEN_DELETE, openDelete
            })}
          />
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default DoctorsTable;

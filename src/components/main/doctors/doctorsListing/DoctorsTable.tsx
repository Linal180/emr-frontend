// packages block
import { FC, useEffect, ChangeEvent, useContext, useReducer, Reducer, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, Button } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { EditNewIcon, LinkIcon, TrashNewIcon } from "../../../../assets/svgs";
import { DetailTooltip, useTableStyles } from "../../../../styles/tableStyles";
import {
  checkPermission,
  formatPhone, formatValue, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, isUser, renderTh
} from "../../../../utils";
import {
  doctorReducer, Action, initialState, State, ActionType
} from "../../../../reducers/doctorReducer";
import {
  appointmentReducer, Action as AppointmentAction, initialState as AppointmentInitialState,
  State as AppointmentState, ActionType as AppointmentActionType
} from "../../../../reducers/appointmentReducer";
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, useRemoveDoctorMutation, DoctorPayload
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, DELETE_DOCTOR_DESCRIPTION, FACILITY, DOCTORS_ROUTE,
  CANT_DELETE_DOCTOR, DOCTOR, NAME, SPECIALTY, PROVIDER_PUBLIC_APPOINTMENT_ROUTE, LINK_COPIED,
  PUBLIC_LINK, USER_PERMISSIONS, PERMISSION_DENIED, ROOT_ROUTE
} from "../../../../constants";
import history from "../../../../history";

const DoctorsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user, userPermissions } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId, practiceId } = facility || {}

  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const isRegularUser = isUser(roles)

  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removeDoctor)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updateDoctor)

  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deleteDoctorId, doctors } = state;
  const [{ copied }, appointmentDispatcher] =
    useReducer<Reducer<AppointmentState, AppointmentAction>>(appointmentReducer, AppointmentInitialState)

  const [findAllDoctor, { loading, error }] = useFindAllDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_DOCTORS, doctors: [] })
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

      doctorInputs && await findAllDoctor({
        variables: { doctorInput: { ...doctorInputs, searchString: searchQuery } }
      })
    } catch (error) { }
  }, [
    facilityId, findAllDoctor, isFacAdmin, isPracticeUser, isRegularUser, isSuper, page,
    practiceId, searchQuery
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
          fetchAllDoctors()
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
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

  const handleClipboard = (id: string) => {
    if (id) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_URL}${PROVIDER_PUBLIC_APPOINTMENT_ROUTE}/${id}`
      )

      appointmentDispatcher({ type: AppointmentActionType.SET_COPIED, copied: true })
    }
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box py={2} mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

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
                    <TableLoader numberOfRows={10} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                doctors?.map((doctor: DoctorPayload['doctor']) => {
                  const { id, firstName, lastName, speciality, contacts, facility, email } = doctor || {};
                  const doctorContact = contacts && contacts[0];
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
                      <TableCell scope="row">{formatValue(speciality as string)}</TableCell>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <DetailTooltip title={copied ? LINK_COPIED : PUBLIC_LINK}>
                            <Box className={classes.iconsBackground} onClick={() => handleClipboard(id || '')}>
                              <LinkIcon />
                            </Box>
                          </DetailTooltip>

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

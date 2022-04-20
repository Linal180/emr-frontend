// packages block
import { ChangeEvent, FC, useEffect, useContext, Reducer, useReducer, useCallback } from "react";
import { Link } from "react-router-dom";
import { InsertLink } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext, ListContext } from "../../../../context";
import { DetailTooltip, useTableStyles } from "../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon, AddNewIcon } from "../../../../assets/svgs";
import { formatPhone, isSuperAdmin, isUserAdmin, renderTh } from "../../../../utils";
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  appointmentReducer, Action as AppointmentAction, initialState as AppointmentInitialState,
  State as AppointmentState, ActionType as AppointmentActionType
} from "../../../../reducers/appointmentReducer";
import {
  FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery, useRemoveFacilityMutation
} from "../../../../generated/graphql";
import {
  CANT_DELETE_FACILITY, DELETE_FACILITY_DESCRIPTION, FACILITY, LINK_COPIED, SERVICES, PRACTICE,
  ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, STATE, FACILITY_SERVICES_ROUTE,
  PUBLIC_LINK, FACILITY_PUBLIC_APPOINTMENT_ROUTE,
} from "../../../../constants";

const FacilityTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { deleteFacilityList } = useContext(ListContext)
  const { facility, roles } = user || {}
  const isSuper = isSuperAdmin(roles);
  const isAdmin = isUserAdmin(roles);
  const { practiceId, id: facilityId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { searchQuery, page, totalPages, openDelete, deleteFacilityId, facilities } = state
  const [{ copied }, appointmentDispatcher] =
    useReducer<Reducer<AppointmentState, AppointmentAction>>(appointmentReducer, AppointmentInitialState)

  const [findAllFacility, { loading, error }] = useFindAllFacilitiesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
    },

    onCompleted(data) {
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { facilities, pagination } = findAllFacility

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        facilities && dispatch({
          type: ActionType.SET_FACILITIES, facilities: facilities as FacilitiesPayload['facilities']
        })
      }
    }
  });

  const fetchAllFacilities = useCallback(async () => {
    try {
      const inputs = { practiceId, facilityName: searchQuery, paginationOptions: { page, limit: PAGE_LIMIT } }
      const payload = !isAdmin ? { ...inputs, singleFacilityId: facilityId } : { ...inputs }

      await findAllFacility({
        variables: { facilityInput: { ...payload } }
      })
    } catch (error) { }
  }, [facilityId, findAllFacility, isAdmin, page, practiceId, searchQuery])

  const [removeFacility, { loading: deleteFacilityLoading }] = useRemoveFacilityMutation({
    onError() {
      Alert.error(CANT_DELETE_FACILITY)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      if (data) {
        const { removeFacility: { response } } = data

        if (response) {
          try {
            const { message } = response
            message && Alert.success(message);
            await fetchAllFacilities();
            deleteFacilityList(deleteFacilityId)
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          } catch (error) { }
        }
      }
    }
  });

  useEffect(() => {
    fetchAllFacilities();
  }, [fetchAllFacilities, page, searchQuery]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_FACILITY_ID, deleteFacilityId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteFacility = async () => {
    if (deleteFacilityId) {
      await removeFacility({
        variables: {
          removeFacility: { id: deleteFacilityId }
        }
      })
    }
  };

  const handleClipboard = (id: string) => {
    if (id) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_URL}${FACILITY_PUBLIC_APPOINTMENT_ROUTE}/${id}`
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
        <Search search={search} />

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {isSuper && renderTh(PRACTICE)}
                {renderTh(CITY)}
                {renderTh(STATE)}
                {renderTh(ZIP)}
                {renderTh(PHONE)}
                {renderTh(EMAIL)}
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
                facilities?.map((facility: FacilityPayload['facility']) => {
                  const { id, name, contacts, practice } = facility || {};
                  const { name: practiceName } = practice || {};
                  const facilityContact = contacts && (contacts.filter(contact => contact.primaryContact)[0])
                  const { email, phone, zipCode, city, state } = facilityContact || {}

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      {isSuper && <TableCell scope="row">{practiceName}</TableCell>}
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">{state}</TableCell>
                      <TableCell scope="row">{zipCode}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <DetailTooltip title={copied ? LINK_COPIED : PUBLIC_LINK}>
                            <Box className={classes.iconsBackground} onClick={() => handleClipboard(id || '')}>
                              <InsertLink />
                            </Box>
                          </DetailTooltip>

                          <DetailTooltip title={SERVICES}>
                            <Link to={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}`}>
                              <Box className={classes.iconsBackground}>
                                <AddNewIcon />
                              </Box>
                            </Link>
                          </DetailTooltip>

                          <Link to={`${FACILITIES_ROUTE}/${id}`}>
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

          {((!loading && facilities?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={FACILITY}
            isOpen={openDelete}
            isLoading={deleteFacilityLoading}
            description={DELETE_FACILITY_DESCRIPTION}
            handleDelete={handleDeleteFacility}
            setOpen={(open: boolean) =>
              dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })
            }
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

export default FacilityTable;

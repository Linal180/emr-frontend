// packages block
import { ChangeEvent, FC, useEffect, useContext, Reducer, useReducer } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { RemoveRedEye, InsertLink } from "@material-ui/icons";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../../../context";
import { formatPhone, isUserAdmin, renderTh } from "../../../../utils";
import { ListContext } from "../../../../context/listContext";
import { DetailTooltip, useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TablesSearchIcon, TrashIcon, ServiceIcon } from "../../../../assets/svgs";
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  appointmentReducer, Action as AppointmentAction, initialState as AppointmentInitialState, State as AppointmentState,
  ActionType as AppointmentActionType
} from "../../../../reducers/appointmentReducer";
import {
  FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery, useRemoveFacilityMutation
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, PUBLIC_APPOINTMENT_ROUTE,
  CODE, STATE, CANT_DELETE_FACILITY, DELETE_FACILITY_DESCRIPTION, FACILITY, LINK_COPIED,
  FACILITY_LOCATIONS_ROUTE, FACILITY_SERVICES_ROUTE, SERVICES, LOCATIONS_TEXT, PUBLIC_LINK,
} from "../../../../constants";

const FacilityTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { fetchAllFacilityList } = useContext(ListContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { searchQuery, page, totalPages, openDelete, deleteFacilityId, facilities } = state
  const [{ copied }, appointmentDispatcher] =
    useReducer<Reducer<AppointmentState, AppointmentAction>>(appointmentReducer, AppointmentInitialState)

  const [findAllFacility, { loading, error }] = useFindAllFacilitiesLazyQuery({
    variables: {
      facilityInput: {
        paginationOptions: {
          page,
          limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
    },

    onCompleted(data) {
      const { findAllFacility } = data || {};

      if (findAllFacility) {
        const { facility, pagination } = findAllFacility

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
          }

          facility && dispatch({
            type: ActionType.SET_FACILITIES, facilities: facility as FacilitiesPayload['facility']
          })
        }
      }
    }
  });

  const [removeFacility, { loading: deleteFacilityLoading }] = useRemoveFacilityMutation({
    onError() {
      Alert.error(CANT_DELETE_FACILITY)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeFacility: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          findAllFacility();
          fetchAllFacilityList();
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllFacility()
    }
  }, [page, findAllFacility, searchQuery]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const handleSearch = () => { }

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
        `${process.env.REACT_APP_URL}${PUBLIC_APPOINTMENT_ROUTE}/${id}`
      )

      appointmentDispatcher({ type: AppointmentActionType.SET_COPIED, copied: true })
    }
  };

  const { roles } = user || {}
  const isAdmin = isUserAdmin(roles)

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className={classes.searchContainer}>
          <TextField
            value={searchQuery}
            className={classes.tablesSearchIcon}
            onChange={({ target: { value } }) =>
              dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: value })
            }
            onKeyPress={({ key }) => key === "Enter" && handleSearch()}
            name="searchQuery"
            variant="outlined"
            placeholder="Search"
            fullWidth
            InputProps={{
              startAdornment:
                <IconButton color="default">
                  <TablesSearchIcon />
                </IconButton>
            }}
          />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(CODE)}
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
                  const { id, name, code, contacts } = facility || {};
                  const facilityContact = contacts && (contacts.filter(contact => contact.primaryContact)[0])
                  const { email, phone, zipCode, city, state } = facilityContact || {}

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{code}</TableCell>
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">{state}</TableCell>
                      <TableCell scope="row">{zipCode}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          {isAdmin &&
                            <DetailTooltip title={copied ? LINK_COPIED : PUBLIC_LINK}>
                              <Box className={classes.iconsBackground} onClick={() => handleClipboard(id || '')}>
                                <InsertLink />
                              </Box>
                            </DetailTooltip>
                          }

                          <DetailTooltip title={SERVICES}>
                            <Link to={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}`}>
                              <Box className={classes.iconsBackground}>
                                <ServiceIcon />
                              </Box>
                            </Link>
                          </DetailTooltip>

                          <DetailTooltip title={LOCATIONS_TEXT}>
                            <Link to={`${FACILITIES_ROUTE}/${id}${FACILITY_LOCATIONS_ROUTE}`}>
                              <Box className={classes.iconsBackground}>
                                <RemoveRedEye />
                              </Box>
                            </Link>
                          </DetailTooltip>

                          <Link to={`${FACILITIES_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditIcon />
                            </Box>
                          </Link>

                          <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                            <TrashIcon />
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
        <Box display="flex" justifyContent="flex-end" pt={2.25}>
          <Pagination
            count={totalPages}
            shape="rounded"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default FacilityTable;

// packages block
import { ChangeEvent, FC, useEffect, useContext, Reducer, useReducer, useCallback } from "react";
import { Link } from "react-router-dom";
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
import {
  formatPhone, getPageNumber, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, isUser, renderTh,
  checkPermission,
} from "../../../../utils";
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  FacilitiesPayload, FacilityPayload, useFindAllFacilitiesLazyQuery, useRemoveFacilityMutation
} from "../../../../generated/graphql";
import {
  CANT_DELETE_FACILITY, DELETE_FACILITY_DESCRIPTION, FACILITY, SERVICES, PRACTICE,
  ACTION, EMAIL, FACILITIES_ROUTE, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, STATE,
  FACILITY_SERVICES_ROUTE, SOMETHING_WENT_WRONG, USER_PERMISSIONS,
} from "../../../../constants";

const FacilityTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user, userPermissions } = useContext(AuthContext)
  const { deleteFacilityList } = useContext(ListContext)

  const { facility, roles } = user || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);

  const isFacAdmin = isFacilityAdmin(roles);
  const isRegUser = isUser(roles)
  const { practiceId, id: facilityId } = facility || {}

  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { searchQuery, page, totalPages, openDelete, deleteFacilityId, facilities } = state
  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removeFacility)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updateFacility)
  const canFetchServices = checkPermission(userPermissions, USER_PERMISSIONS.findAllServices)

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
      } else {
        dispatch({ type: ActionType.SET_FACILITIES, facilities: [] })
      }
    }
  });

  const fetchAllFacilities = useCallback(async () => {
    try {
      const inputs = { facilityName: searchQuery, paginationOptions: { page, limit: PAGE_LIMIT } }
      const payload =
        isSuper ? { ...inputs } : isPracticeUser ? { ...inputs, practiceId } :
          isFacAdmin || isRegUser ? { ...inputs, singleFacilityId: facilityId } : undefined

      payload ? await findAllFacility({
        variables: { facilityInput: { ...payload } }
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [
    facilityId, findAllFacility, isFacAdmin, isPracticeUser, isRegUser, isSuper, page,
    practiceId, searchQuery
  ])

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
            deleteFacilityList(deleteFacilityId)
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

            if (!!facilities && facilities.length > 1) {
              await fetchAllFacilities();
            } else {
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, facilities?.length || 0) })
            }
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

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

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
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
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
                          <DetailTooltip title={SERVICES}>
                            <Link to={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}`}
                              className={canFetchServices ? '' : 'disable-icon'}
                            >
                              <Box className={classes.iconsBackground}>
                                <AddNewIcon />
                              </Box>
                            </Link>
                          </DetailTooltip>

                          <Link to={`${FACILITIES_ROUTE}/${id}`} className={canUpdate ? '' : 'disable-icon'}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box onClick={() => onDeleteClick(id || '')}
                            className={`${classes.iconsBackground} ${canDelete ? '' : 'disable-icon'}`}
                          >
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

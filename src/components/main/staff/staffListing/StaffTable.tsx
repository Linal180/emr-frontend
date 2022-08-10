// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
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
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from '../../../../assets/svgs';
import { staffReducer, Action, initialState, State, ActionType } from "../../../../reducers/staffReducer";
import {
  checkPermission, formatPhone, getPageNumber, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, isUser, renderTh
} from "../../../../utils";
import {
  AllStaffPayload, StaffPayload, useFindAllStaffLazyQuery, useRemoveStaffMutation
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, STAFF_ROUTE, DELETE_STAFF_DESCRIPTION, CANT_DELETE_STAFF,
  STAFF_TEXT, CANT_DELETE_SELF_STAFF, USER_PERMISSIONS
} from "../../../../constants";

const StaffTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user, userPermissions } = useContext(AuthContext);
  const { facility, roles } = user || {};

  const { id: facilityId, practiceId } = facility || {};
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);

  const isFacAdmin = isFacilityAdmin(roles);
  const isRegularUser = isUser(roles);
  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removeStaff)
  const canUpdate = checkPermission(userPermissions, USER_PERMISSIONS.updateStaff)

  const [state, dispatch] = useReducer<Reducer<State, Action>>(staffReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deleteStaffId, allStaff } = state;

  const [findAllStaff, { loading, error }] = useFindAllStaffLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_ALL_STAFF, allStaff: [] })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      const { findAllStaff } = data || {};

      if (findAllStaff) {
        const { allstaff, pagination } = findAllStaff

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }

        dispatch({ type: ActionType.SET_ALL_STAFF, allStaff: allstaff as AllStaffPayload['allstaff'] })
      } else {
        dispatch({ type: ActionType.SET_ALL_STAFF, allStaff: [] })
      }
    }
  });

  const fetchAllStaff = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const staffInputs = isSuper ? { ...pageInputs } :
        isPracticeUser ? { practiceId, ...pageInputs } :
          isFacAdmin || isRegularUser ? { facilityId, ...pageInputs } : undefined

      staffInputs && await findAllStaff({
        variables: {
          staffInput: { ...staffInputs, searchString: searchQuery }
        }
      })
    } catch (error) { }
  }, [page, isSuper, isPracticeUser, practiceId, isFacAdmin, facilityId, findAllStaff, isRegularUser, searchQuery]);

  const [removeStaff, { loading: deleteStaffLoading }] = useRemoveStaffMutation({
    onError() {
      Alert.error(CANT_DELETE_STAFF)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removeStaff: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

            if (!!allStaff && allStaff.length) {
              await fetchAllStaff();
            } else {
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, allStaff?.length || 0) })
            }
          }
        }
      } catch (error) { }
    }
  });

  useEffect(() => { }, [user]);
  useEffect(() => { fetchAllStaff() }, [fetchAllStaff, page, searchQuery]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_STAFF_ID, deleteStaffId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteStaff = async () => {
    const userStaffId = allStaff?.find((staff) => staff?.id === deleteStaffId)?.user?.id ?? ''

    if (user?.id !== userStaffId) {
      deleteStaffId && await removeStaff({
        variables: { removeStaff: { id: deleteStaffId } }
      })
    } else {
      Alert.error(CANT_DELETE_SELF_STAFF)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    }
  };

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(EMAIL)}
                {renderTh(PHONE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={4} />
                  </TableCell>
                </TableRow>
              ) : (
                allStaff?.map((record: StaffPayload['staff']) => {
                  const { id, firstName, lastName, email, phone } = record || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{firstName} {lastName}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${STAFF_ROUTE}/${id}`} className={canUpdate ? '' : 'disable-icon'}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={`${classes.iconsBackground} ${canDelete ? '' : 'disable-icon'}`}
                            onClick={() => onDeleteClick(id || '')}>
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

          {((!loading && allStaff?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={STAFF_TEXT}
            isOpen={openDelete}
            isLoading={deleteStaffLoading}
            description={DELETE_STAFF_DESCRIPTION}
            handleDelete={handleDeleteStaff}
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

export default StaffTable;

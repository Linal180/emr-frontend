// packages block
import { ChangeEvent, useEffect, useCallback, useContext, Reducer, useReducer } from "react";
import { pluck } from "underscore";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, IconButton } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { AuthContext } from "../../../../context";
import { TrashNewIcon } from "../../../../assets/svgs";
import { renderTh } from "../../../../utils";
import { RolesTableProps } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  roleReducer, Action, initialState, State, ActionType
} from "../../../../reducers/roleReducer";
import { RolesPayload, useFindAllRolesLazyQuery, useRemoveRoleMutation } from "../../../../generated/graphql";
import {
  NAME, DESCRIPTION, N_A, ROLES_ROUTE, ACTION, CANT_DELETE_ROLE, ROLE, DELETE_ROLE_DESCRIPTION,
  SYSTEM_ROLES, PAGE_LIMIT
} from "../../../../constants";

const RolesTable = ({ customRole = false }: RolesTableProps) => {
  const { user } = useContext(AuthContext)
  const { roles: currentRole } = user || {}
  const userRoles = pluck(currentRole || [], 'role')
  const isSuperAdmin = userRoles.includes(SYSTEM_ROLES.SuperAdmin)

  const classes = useTableStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(roleReducer, initialState)
  const { page, roles, searchQuery, totalPages, deleteRoleId, openModal } = state

  const [findAllRoles, { loading, error }] = useFindAllRolesLazyQuery({
    variables: {
      roleInput: {
        paginationOptions: { page, limit: PAGE_LIMIT },
        customRole, roleName: searchQuery
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_ROLES, roles: [] })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      if (data) {
        const { getAllRoles } = data;

        if (getAllRoles) {
          const { roles, pagination } = getAllRoles

          if (pagination) {
            const { totalPages } = pagination
            totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
          }

          roles && dispatch({ type: ActionType.SET_ROLES, roles: roles as RolesPayload['roles'] })
        }
      }
    }
  });

  const fetchRoles = useCallback(async () => {
    try {
      await findAllRoles();
    } catch (error) { }
  }, [findAllRoles])

  useEffect(() => {
    fetchRoles()
  }, [page, fetchRoles, searchQuery])

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const [removeRole, { loading: deleteRoleLoading }] = useRemoveRoleMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_ROLE)
      dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: false })
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removeRole: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: false })
            await findAllRoles();
          }
        }
      } catch (error) { }
    }
  });

  const onDelete = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_ROLE_ID, deleteRoleId: id })
      dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })
    }
  };

  const handleDeleteRole = async () => {
    deleteRoleId && await removeRole({
      variables: { removeRole: { id: deleteRoleId } }
    })
  };

  const search = (query: string) =>
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

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
                {renderTh(DESCRIPTION)}
                {customRole && renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={customRole ? PAGE_LIMIT : 5} numberOfColumns={customRole ? 3 : 2} />
                  </TableCell>
                </TableRow>
              ) : (
                roles?.map(role => {
                  const { id, role: roleName, description, customRole } = role || {}

                  return (
                    <TableRow>
                      <TableCell scope="row">
                        <Link to={`${ROLES_ROUTE}/${id}`}>
                          {roleName}
                        </Link>
                      </TableCell>

                      <TableCell scope="row">{description || N_A}</TableCell>
                      {customRole &&
                        <TableCell scope="row">
                          <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                            <IconButton
                              color="primary"
                              disabled={!isSuperAdmin}
                              className={isSuperAdmin ? classes.rolesIconsBackground : classes.rolesIconsBackgroundDisabled}
                              onClick={() => onDelete(id || '')}>
                              <TrashNewIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      }
                    </TableRow>
                  )
                }
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {((!loading && roles?.length === 0) || error) && (
        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      )}

      <ConfirmationModal
        title={ROLE}
        isOpen={openModal}
        isLoading={deleteRoleLoading}
        handleDelete={handleDeleteRole}
        description={DELETE_ROLE_DESCRIPTION}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: open })}
      />

      {totalPages > 1 &&
        <Box display="flex" justifyContent="flex-end" pt={1.5}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      }
    </>
  );
};

export default RolesTable;

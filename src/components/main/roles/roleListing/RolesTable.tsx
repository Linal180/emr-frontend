// packages block
import { ChangeEvent, useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell, IconButton } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constant, utils and styles block
import { TrashNewIcon } from "../../../../assets/svgs";
import { formatRoleName, renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { RolesPayload, useFindAllRolesLazyQuery, useRemoveRoleMutation } from "../../../../generated/graphql";
import { NAME, DESCRIPTION, N_A, ROLES_ROUTE, ACTION, CANT_DELETE_ROLE, ROLE, DELETE_ROLE_DESCRIPTION, SYSTEM_ROLES } from "../../../../constants";
import { RolesTableProps } from "../../../../interfacesTypes";
import { AuthContext } from "../../../../context";
import { pluck } from "underscore";

const RolesTable = ({ customRole = false }: RolesTableProps) => {
  const { user } = useContext(AuthContext)
  const { roles: currentRole } = user || {}
  const userRoles = pluck(currentRole || [], 'role')
  const isSuperAdmin = userRoles.includes(SYSTEM_ROLES.SuperAdmin)
  const classes = useTableStyles()
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [roles, setRoles] = useState<RolesPayload['roles']>([]);
  const [deleteRoleId, setDeleteRoleId] = useState<string>('');

  const [findAllRoles, { loading, error }] = useFindAllRolesLazyQuery({
    variables: {
      roleInput: { paginationOptions: { page, limit: 10 }, customRole }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setRoles([])
    },

    onCompleted(data) {
      if (data) {
        const { getAllRoles } = data;

        if (getAllRoles) {
          const { roles, pagination } = getAllRoles

          if (pagination) {
            const { totalPages } = pagination
            totalPages && setPages(totalPages)
          }

          roles && setRoles(roles as RolesPayload['roles'])
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
  }, [page, fetchRoles])

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  const [removeRole, { loading: deleteRoleLoading }] = useRemoveRoleMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_ROLE)
      setOpenDelete(false)
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removeRole: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            setOpenDelete(false)
            await findAllRoles();
          }
        }
      } catch (error) { }
    }
  });

  const onDelete = (id: string) => {
    if (id) {
      setDeleteRoleId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteRole = async () => {
    deleteRoleId &&
      await removeRole({
        variables: { removeRole: { id: deleteRoleId } }
      })
  };

  return (
    <>
      <Box className={classes.mainTableContainer}>
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
                    <TableLoader numberOfRows={10} numberOfColumns={2} />
                  </TableCell>
                </TableRow>
              ) : (
                roles?.map(role => {
                  const { id, role: roleName, description, customRole } = role || {}

                  return (
                    <TableRow>
                      <TableCell scope="row">
                        <Link to={`${ROLES_ROUTE}/${id}`}>
                          {formatRoleName(roleName || '')}
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
        isOpen={openDelete}
        isLoading={deleteRoleLoading}
        handleDelete={handleDeleteRole}
        description={DELETE_ROLE_DESCRIPTION}
        setOpen={(open: boolean) => setOpenDelete(open)}
      />

      {pages > 1 &&
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={pages}
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

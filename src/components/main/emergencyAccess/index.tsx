// packages block
import {
  Box, Button, Card, colors, Typography, Table, TableBody, TableHead, TableRow, TableCell
} from "@material-ui/core";
// component block
import Search from "../../common/Search";
import PageHeader from "../../common/PageHeader";
// constants, history, styling block
import { isFacilityAdmin, renderTh } from "../../../utils";
import { useTableStyles } from "../../../styles/tableStyles";
import {
  ACCESS_ACTIVATED, ACTION, ACTIVATE_EMERGENCY_ACCESS_MODE, DEACTIVATE_EMERGENCY_ACCESS_MODE, EMERGENCY_ACCESS,
  EMERGENCY_ACCESS_ENABLED, NAME, REVOKE_ACCESS, STATUS, TEMPORARY_EMERGENCY_ACCESS, TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION,
  EMERGENCY_ACCESS_DENIED, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMERGENCY_ACCESS_UPDATE, EMERGENCY_ACCESS_VALUE, EMERGENCY_ACCESS_REVOKE_ROLES,
} from "../../../constants";
import Alert from "../../common/Alert";
import { UpdateRoleInput, useFetchEmergencyAccessUserLazyQuery, User, useUpdateUserRoleMutation } from "../../../generated/graphql";
import { AuthContext } from "../../../context";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";

import UpdateConfirmationModal from "../../common/UpdateConfirmationModal";
import { Pagination } from "@material-ui/lab";
import { RolePayloadInterface } from "../../../interfacesTypes";


const EmergencyAccessComponent = (): JSX.Element => {
  const classes = useTableStyles();
  const { user, userRoles, setUserRoles, setUserPermissions } = useContext(AuthContext);
  const [emergencyAccessUsers, setEmergencyAccessUsers] = useState<User[] | null>(null);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [shoudlFetchEmergencyUser, setShoudlFetchEmergencyUser] = useState(true)
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rolePayload, setRolePayload] = useState<UpdateRoleInput | null>(null)

  const isFacAdmin = isFacilityAdmin(user?.roles);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  const [updateUserRole, { loading: UpdateUserRoleLoading }] =
    useUpdateUserRoleMutation({
      onError({ message }) {
        if (message === FORBIDDEN_EXCEPTION) {
          Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS);
        } else Alert.error(message);
      },

      onCompleted(data) {
        const {
          updateUserRole: { response, user: responseUser },
        } = data;

        if (response) {
          const { status } = response;
          if (status && status === 200) {
            if (responseUser?.id !== user?.id) {
              Alert.success(EMERGENCY_ACCESS_UPDATE);
              setShoudlFetchEmergencyUser(true)
              setRolePayload(null)
              setOpenDelete(false)
              return
            }

            const userRoles =
              responseUser?.roles?.map((role) => role?.role ?? "") || [];

            const transformedUserPermissions = responseUser?.roles?.reduce<string[]>((acc, role) => {
              const { rolePermissions } = role || {};
              const permissions = rolePermissions?.map(rolePermission => rolePermission.permission?.name ?? '') ?? []

              acc.push(...permissions)
              return acc
            }, []) ?? []

            setUserPermissions(transformedUserPermissions)
            setUserRoles(userRoles);
            Alert.success(EMERGENCY_ACCESS_UPDATE);
            setShoudlFetchEmergencyUser(true)
            setOpenDelete(false)
          }
        }
      },
    });

  const [fetchEmergencyAccessUsers] = useFetchEmergencyAccessUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setEmergencyAccessUsers(null)
    },

    onCompleted(data) {
      if (data) {
        const { fetchEmergencyAccessUsers } = data

        if (fetchEmergencyAccessUsers) {
          const { emergencyAccessUsers, pagination } = fetchEmergencyAccessUsers;
          if (emergencyAccessUsers) {

            setEmergencyAccessUsers(emergencyAccessUsers as User[]);
            setShoudlFetchEmergencyUser(false)

            if (pagination) {
              const { totalPages } = pagination
              totalPages && setTotalPages(totalPages)
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    if (shoudlFetchEmergencyUser) {
      if (isFacAdmin) {
        console.log("hello")
        fetchEmergencyAccessUsers({
          variables: {
            emergencyAccessUsersInput: {
              paginationInput: { page, limit: 10 },
              facilityId: user?.facilityId
            }
          }
        })
        return
      }
      fetchEmergencyAccessUsers({
        variables: {
          emergencyAccessUsersInput: {
            paginationInput: { limit: 10, page }
          }
        }
      })
    }
  }, [fetchEmergencyAccessUsers, isFacAdmin, page, shoudlFetchEmergencyUser, user?.facilityId]);

  const handleEmergencyAccessToggle = async () => {
    const transformedUserRoles = userRoles.filter(
      (userRole) => userRole !== EMERGENCY_ACCESS_VALUE
    );

    if (userRoles.includes(EMERGENCY_ACCESS_VALUE)) {
      return await updateUserRole({
        variables: {
          updateUserRoleItemInput: {
            id: user?.id ?? "",
            roles: transformedUserRoles,
          },
        },
      });
    }

    await updateUserRole({
      variables: {
        updateUserRoleItemInput: {
          id: user?.id ?? "",
          roles: [...userRoles, EMERGENCY_ACCESS_VALUE],
        },
      },
    });
  };

  const handleRevokeAccess = async (id: string, roles?: string[]) => {
    const transformedUserRoles = roles?.filter((role) => role !== EMERGENCY_ACCESS_VALUE) ?? []

    return await updateUserRole({
      variables: {
        updateUserRoleItemInput: {
          id: id ?? "",
          roles: transformedUserRoles,
        },
      },
    });
  }

  const transformedEmergencyAccessUser = useMemo(() => {
    return emergencyAccessUsers?.filter((emergencyUser) => emergencyUser?.id !== user?.id) ?? []
  }, [emergencyAccessUsers, user?.id])

  const shoulShowRevokePanel = EMERGENCY_ACCESS_REVOKE_ROLES.some((revokeRole) => userRoles.includes(revokeRole))

  const onRevokeAccessClick = (rolePayloadInput?: RolePayloadInterface) => {
    if (rolePayloadInput) {
      const { id, roles } = rolePayloadInput
      setRolePayload({
        id,
        roles: roles?.map(role => role?.role ?? '') ?? []
      })
    }

    setOpenDelete(true)
  }

  const handleEmergencyAccessRevoke = () => {
    if (rolePayload) {
      return handleRevokeAccess(rolePayload.id, rolePayload.roles)
    }

    return handleEmergencyAccessToggle()
  }

  const search = (query: string) => { }

  return (
    <>
      <PageHeader title={EMERGENCY_ACCESS} />
      {!shoulShowRevokePanel ? <Card>
        <Box p={4}>
          <Typography variant="h4">{TEMPORARY_EMERGENCY_ACCESS}</Typography>

          <Box borderBottom={`1px solid ${colors.grey[300]}`} mt={2} mb={3} />

          <Typography variant="body1">
            {TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION}
          </Typography>
          {!userRoles.includes(EMERGENCY_ACCESS_VALUE) ? (
            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                color="inherit"
                onClick={() => onRevokeAccessClick()}
                disabled={UpdateUserRoleLoading}
              >
                {ACTIVATE_EMERGENCY_ACCESS_MODE}
              </Button>

              <Box display="flex">
                <Typography variant="body1">{STATUS} :</Typography>

                <Typography variant="body1" color="secondary">
                  &nbsp;<strong>{EMERGENCY_ACCESS_DENIED}</strong>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                color="primary"
                disabled={UpdateUserRoleLoading}
                onClick={() => onRevokeAccessClick()}
              >
                {DEACTIVATE_EMERGENCY_ACCESS_MODE}
              </Button>

              <Box display="flex">
                <Typography variant="body1">{STATUS} :</Typography>

                <Typography variant="body1" color="primary">
                  &nbsp;<strong>{EMERGENCY_ACCESS_ENABLED}</strong>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Card> : null
      }


      <Box p={2} />
      {!!transformedEmergencyAccessUser.length && shoulShowRevokePanel ? <Card>
        <Box className={classes.mainTableContainer}>
          <Box py={2} mb={2} maxWidth={450}>
            <Search search={search} />
          </Box>

          <Box className="table-overflow" maxHeight={410}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {renderTh(NAME)}
                  {renderTh(ACCESS_ACTIVATED)}
                  {renderTh(ACTION)}
                </TableRow>
              </TableHead>

              <TableBody>
                {transformedEmergencyAccessUser?.map(
                  ({ email, id, roles }) => (
                    <TableRow key={id}>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Typography variant="body1">{'11/12/2020'}</Typography>
                      </TableCell>
                      <TableCell scope="row">
                        <Button
                          variant="text"
                          color="secondary"
                          className="danger"
                          onClick={() => onRevokeAccessClick({ id, roles })}
                        >
                          {REVOKE_ACCESS}
                        </Button>
                        {/* <Typography variant="body2">{drName}</Typography>
                        <Typography variant="body1">{actionDate}</Typography> */}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
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
      </Card> : null}

      <UpdateConfirmationModal title={EMERGENCY_ACCESS} isOpen={openDelete} isLoading={UpdateUserRoleLoading}
        description={rolePayload ? 'Confirm to revoke access' : 'Confirm to update emergency access'} handleDelete={handleEmergencyAccessRevoke}
        setOpen={(open: boolean) => setOpenDelete(open)} actionText='Update Record' />
    </>
  );
};
export default EmergencyAccessComponent;

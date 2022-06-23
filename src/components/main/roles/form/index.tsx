// packages block
import { useState, FC, useContext, useEffect, SetStateAction, useCallback } from 'react';
import { union, pluck, difference } from 'underscore';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, Button,
} from "@material-ui/core";
// components block
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
import ViewDataLoader from '../../../common/ViewDataLoader';
// constants and types block
import history from '../../../../history';
import { roleSchema } from '../../../../validationSchemas';
import { GeneralFormProps } from '../../../../interfacesTypes';
import { formatPermissionName, isSuperAdmin } from '../../../../utils';
import { AuthContext, ListContext, PermissionContext } from '../../../../context';
import {
  RoleItemInput, useAssignPermissionToRoleMutation, useCreateRoleMutation, useGetRoleLazyQuery,
  useUpdateRoleMutation
} from '../../../../generated/graphql';
import {
  DESCRIPTION, FORBIDDEN_EXCEPTION, MODULES, MODULE_TYPES, PERMISSIONS, PERMISSIONS_SET, ROLES_ROUTE,
  ROLE_DETAILS_TEXT, ROLE_NAME, ROLE_NOT_FOUND, ROLE_UPDATED, SAVE_TEXT, SET_PERMISSIONS, ROLES_TEXT,
  ROLES_ADD_BREAD, ROLES_EDIT_BREAD, ROLES_BREAD, ROLE_ALREADY_EXIST, ROLE_CREATED,
} from "../../../../constants";

const RoleForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { permissions } = useContext(PermissionContext)
  const { addRoleList, updateRoleList } = useContext(ListContext)
  const [ids, setIds] = useState<string[]>([])
  const [modules, setModules] = useState<string[]>([])
  const [custom, setCustom] = useState<boolean>(true)
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const isSuper = isSuperAdmin(roles);

  const methods = useForm<RoleItemInput>({
    mode: "all", resolver: yupResolver(roleSchema)
  });
  const { handleSubmit, reset, setValue } = methods;

  const handleChangeForCheckBox = (id: string) => {
    if (id) {
      if (ids.includes(id)) {
        setIds(ids.filter(permission => permission !== id))
      } else {
        setIds([...ids, id])
      }
    }
  };

  const handleAllIds = (moduleName: string, selectedIds: string[]) => {
    if (modules.includes(moduleName)) {
      setModules(modules.filter(name => name !== moduleName))
      setIds(difference(ids, selectedIds))
    } else {
      setModules([...modules, moduleName])
      setIds(union(ids, selectedIds))
    }
  };

  const [getRole, { loading }] = useGetRoleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { getRole } = data;

        if (getRole) {
          const { role, response } = getRole

          if (response) {
            const { status } = response

            if (role && status && status === 200) {
              const { role: roleName, description, rolePermissions, customRole } = role;

              setCustom(customRole as boolean)
              roleName && setValue('role', roleName)
              description && setValue('description', description)
              let permissionIds: SetStateAction<string[]> = []

              if (rolePermissions && rolePermissions.length > 0) {
                permissionIds = rolePermissions.map(rolePermission => {
                  const { permission } = rolePermission || {}
                  const { id: permissionId } = permission || {}

                  return permissionId ? permissionId : ''
                })
              }

              setIds(permissionIds)
            }
          }
        }
      }
    }
  });

  const [assignPermissionsRoles, { loading: assignPermissionLoading }] =
    useAssignPermissionToRoleMutation({
      onError({ message }) {
        Alert.error(message)
      },

      onCompleted(data) {
        const { assignPermissionToRole: { response } } = data;

        if (response) {
          const { status } = response

          if (status && status === 200) {
            reset()
            Alert.success(PERMISSIONS_SET);
          }
        }
      }
    });

  const [createRole, { loading: createRoleLoading }] = useCreateRoleMutation({
    onError({ message }) {

      Alert.error(message === FORBIDDEN_EXCEPTION ? ROLE_ALREADY_EXIST : message)
    },

    onCompleted(data) {
      const { createRole: { response, role } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          const { id: newRole } = role || {}
          addRoleList(role)
          Alert.success(ROLE_CREATED);
          history.push(`${ROLES_ROUTE}/${newRole}`)
        }
      }
    }
  });

  const [updateRole, { loading: updateRoleLoading }] = useUpdateRoleMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateRole: { response, role } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          updateRoleList(role)
          Alert.success(ROLE_UPDATED)
          history.push(ROLES_ROUTE)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<RoleItemInput> = async ({ role, description }) => {
    if (isEdit) {
      id && await updateRole({
        variables: { updateRoleItemInput: { id, role, description } }
      })
    } else {
      await createRole({
        variables: { roleItemInput: { role, description, customRole: true } }
      })
    }
  }

  const setPermissions = async () => {
    id && await assignPermissionsRoles({
      variables: { rolePermissionItemInput: { roleId: id, permissionsId: ids } }
    })
  }

  const fetchRole = useCallback(async () => {
    id ? await getRole({ variables: { getRole: { id } } })
      : Alert.error(ROLE_NOT_FOUND)
  }, [getRole, id])

  useEffect(() => {
    isEdit && fetchRole()
  }, [fetchRole, isEdit, assignPermissionLoading])

  const isLoading = loading || createRoleLoading || updateRoleLoading || assignPermissionLoading;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex'>
          <BackButton to={`${ROLES_ROUTE}`} />

          <Box ml={2} />

          <PageHeader
            title={ROLES_TEXT}
            path={[ROLES_BREAD, isEdit ? ROLES_EDIT_BREAD : ROLES_ADD_BREAD]}
          />
        </Box>

        <Card>
          <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">{ROLE_DETAILS_TEXT}</Typography>

              {(custom || isSuper) &&
                <Button variant='contained' color='primary' disabled={isLoading} type='submit'>
                  {SAVE_TEXT}
                </Button>
              }
            </Box>

            <Box p={2} />

            {loading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
              <Grid container spacing={3}>
                <Grid item md={6} sm={12}>
                  <InputController
                    fieldType="text"
                    controllerName="role"
                    controllerLabel={ROLE_NAME}
                  />
                </Grid>

                <Grid item md={6} sm={12}>
                  <InputController
                    fieldType="text"
                    controllerName="description"
                    controllerLabel={DESCRIPTION}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Card>

        <Box p={2} />

        {isEdit && MODULES.map((module, index) => {
          if (module !== MODULE_TYPES.Practice) {
            let modulePermissions = [];
            if (module === MODULE_TYPES.Service) {
              modulePermissions = permissions?.filter(permission =>
                permission?.moduleType === MODULE_TYPES.Service
                || permission?.moduleType === MODULE_TYPES.Services) || []
            } else if (module === MODULE_TYPES.Schedule) {
              modulePermissions = permissions?.filter(permission =>
                permission?.moduleType === MODULE_TYPES.Schedule
                || permission?.moduleType === MODULE_TYPES.Schedules) || []
            } else {
              modulePermissions = permissions?.filter(permission => permission?.moduleType === module) || []
            }

            const allIds = modulePermissions && pluck(modulePermissions, 'id');

            return modulePermissions?.length > 0 && (
              <Card>
                <Box p={4}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Grid item md={3} sm={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Box>
                              <Checkbox disabled={!(custom || isSuper)} color="primary" checked={modules.includes(module)}
                                onChange={() => handleAllIds(module, allIds)} />
                            </Box>
                          }

                          label={<Typography variant="h4">{module} {PERMISSIONS}</Typography>}
                        />
                      </FormGroup>
                    </Grid>


                    {index === 0 && (custom || isSuper) &&
                      <Button onClick={setPermissions} variant='contained' color='secondary' disabled={assignPermissionLoading}
                        className='blue-button-new'>{SET_PERMISSIONS}</Button>
                    }
                  </Box>

                  <Box p={2} />

                  {loading ? <ViewDataLoader rows={1} columns={6} hasMedia={false} /> : (
                    <Grid container spacing={0}>
                      {modulePermissions.map(permission => {
                        const { id, name } = permission || {}

                        return (
                          <Grid item md={3} sm={6}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Box>
                                    <Checkbox disabled={!(custom || isSuper)} color="primary" checked={ids.includes(id || '')}
                                      onChange={() => handleChangeForCheckBox(id || '')} />
                                  </Box>
                                }
                                label={formatPermissionName(name || '')}
                              />
                            </FormGroup>
                          </Grid>
                        )
                      })}
                    </Grid>
                  )}
                </Box>
              </Card>
            )
          } else return <></>;
        })}
      </form>
    </FormProvider>
  )
}

export default RoleForm;

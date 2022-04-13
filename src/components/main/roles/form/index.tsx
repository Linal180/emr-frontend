// packages block
import { useState, ChangeEvent, FC, useContext, useEffect, SetStateAction, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, Button, } from "@material-ui/core";
// components block
import InputController from '../../../../controller';
import ViewDataLoader from '../../../common/ViewDataLoader';
// constants and types block
import Alert from '../../../common/Alert';
import history from '../../../../history';
import { PermissionContext } from '../../../../context';
import { formatPermissionName } from '../../../../utils';
import { roleSchema } from '../../../../validationSchemas';
import { GeneralFormProps } from '../../../../interfacesTypes';
import {
  RoleItemInput, useAssignPermissionToRoleMutation, useCreateRoleMutation, useGetRoleLazyQuery,
  useUpdateRoleMutation
} from '../../../../generated/graphql';
import {
  DESCRIPTION, EDIT_ROLE_TEXT, FORBIDDEN_EXCEPTION, MODULES, MODULE_TYPES, PERMISSIONS, PERMISSIONS_SET,
  ROLES_ROUTE, ROLE_ALREADY_EXIST, ROLE_CREATED, ROLE_DETAILS_TEXT, ROLE_NAME, ROLE_NOT_FOUND, ROLE_UPDATED,
  ADD_ROLE_TEXT, SAVE_TEXT, SET_PERMISSIONS,
} from "../../../../constants";

const RoleForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { permissions } = useContext(PermissionContext)
  const [ids, setIds] = useState<string[]>([])
  const [custom, setCustom] = useState<boolean>(true)

  const methods = useForm<RoleItemInput>({
    mode: "all", resolver: yupResolver(roleSchema)
  });
  const { handleSubmit, reset, setValue } = methods;

  const handleChangeForCheckBox = (id: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (id) {
      if (ids.includes(id)) {
        setIds(ids.filter(permission => permission !== id))
      } else {
        setIds([...ids, id])
      }
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

  const [assignPermissionsRoles, { loading: assignPermissionLoading }] = useAssignPermissionToRoleMutation({
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
          history.push(ROLES_ROUTE)
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
      const { updateRole: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(ROLE_UPDATED)
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
  }, [fetchRole, isEdit])

  const isLoading = loading || createRoleLoading || updateRoleLoading || assignPermissionLoading;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box pb={2.25} display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4'>{isEdit ? EDIT_ROLE_TEXT : ADD_ROLE_TEXT}</Typography>

          {custom &&
            <Button variant='contained' color='primary' disabled={isLoading} type='submit'>{SAVE_TEXT}</Button>
          }
        </Box>

        <Box maxHeight="calc(100vh - 280px)" className="overflowY-auto">
          <Card>
            <Box p={4}>
              <Typography variant="h4">{ROLE_DETAILS_TEXT}</Typography>

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
            let modulePermissions = [];

            if (module === MODULE_TYPES.Service) {
              modulePermissions = permissions?.filter(permission =>
                permission?.moduleType === MODULE_TYPES.Service || permission?.moduleType === MODULE_TYPES.Services) || []
            } else if (module === MODULE_TYPES.Schedule) {
              modulePermissions = permissions?.filter(permission =>
                permission?.moduleType === MODULE_TYPES.Schedule || permission?.moduleType === MODULE_TYPES.Schedules) || []
            } else {
              modulePermissions = permissions?.filter(permission => permission?.moduleType === module) || []
            }

            return modulePermissions?.length > 0 && (
              <Card>
                <Box p={4}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{module} {PERMISSIONS}</Typography>
                    {index === 0 && custom &&
                      <Button onClick={setPermissions} variant='contained' color='inherit' disabled={isLoading}
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
                                  <Box className='permissionDenied'>
                                    <Checkbox disabled={!custom} color="primary" checked={ids.includes(id || '')}
                                      onChange={handleChangeForCheckBox(id || '')} />
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
          })}
        </Box>
      </form>
    </FormProvider>
  )
}

export default RoleForm;

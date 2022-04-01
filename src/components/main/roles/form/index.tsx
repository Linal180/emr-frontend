// packages block
import { useState, ChangeEvent, FC, useContext, useEffect, SetStateAction } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, Button, } from "@material-ui/core";
// components block
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
// constants and types block
import history from '../../../../history';
import { PermissionContext } from '../../../../context';
import { formatPermissionName } from '../../../../utils';
import { roleSchema } from '../../../../validationSchemas';
import { GeneralFormProps } from '../../../../interfacesTypes';
import {
  RoleItemInput, useAssignPermissionToRoleMutation, useCreateRoleMutation, useGetRoleLazyQuery, useUpdateRoleMutation
} from '../../../../generated/graphql';
import {
  ADD_ROLE_TEXT,
  DESCRIPTION, EDIT_ROLE_TEXT, MODULES, MODULE_TYPES, PERMISSIONS, PERMISSIONS_SET, ROLES_ROUTE, ROLE_CREATED, ROLE_DETAILS_TEXT, ROLE_NAME, ROLE_NOT_FOUND, ROLE_UPDATED, SAVE_TEXT,
} from "../../../../constants";

const RoleForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { permissions } = useContext(PermissionContext)
  const [ids, setIds] = useState<string[]>([])

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

  const [getRole, { loading, error }] = useGetRoleLazyQuery({
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
              roleName && setValue('role', roleName)
              description && setValue('description', description)
              let permissionIds: SetStateAction<string[]> = []
              if (rolePermissions && rolePermissions.length > 0) {
                permissionIds = rolePermissions.map(permission => {
                  const { id } = permission || {}

                  return id;
                })
              }

              setIds(permissionIds)
            }
          }
        }
      }
    }
  });

  const [assignPermissionsRoles] = useAssignPermissionToRoleMutation({
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

  const assignPermissions = async (roleId: string) => {
    id && assignPermissionsRoles({
      variables: { rolePermissionItemInput: { roleId: id, permissionsId: ids } }
    })
  }

  const [createRole] = useCreateRoleMutation({
    onError({ message }) {
      Alert.error(message)
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

  const [updateRole] = useUpdateRoleMutation({
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
      variables: { rolePermissionItemInput: { roleId: id, permissionsId: ids }}
    })
  }

  useEffect(() => {
    if (isEdit) {
      id ? getRole({ variables: { getRole: { id } } })
        : Alert.error(ROLE_NOT_FOUND)
    }
  }, [getRole, id, isEdit])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box pb={2.25} display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4'>{isEdit ?  EDIT_ROLE_TEXT : ADD_ROLE_TEXT}</Typography>
          <Button variant='contained' color='primary' type='submit'>{SAVE_TEXT}</Button>
        </Box>

        <Box maxHeight="calc(100vh - 280px)" className="overflowY-auto">
          <Card>
            <Box p={4}>
              <Typography variant="h4">{ROLE_DETAILS_TEXT}</Typography>

              <Box p={2} />

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
            if (modulePermissions?.length > 0) {
              return (
                <Card>
                  <Box p={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">{module} {PERMISSIONS}</Typography>
                      {index === 0 &&
                        <Button onClick={setPermissions} variant='contained' color='inherit' className='blue-button-new' >Set Permissions</Button>
                      }
                    </Box>

                    <Box p={2} />

                    <Grid container spacing={0}>
                      {modulePermissions.map(permission => {
                        const { id, name } = permission || {}

                        return (
                          <Grid item md={3} sm={6}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox color="primary" checked={ids.includes(id || '')} onChange={handleChangeForCheckBox(id || '')} />
                                }
                                label={formatPermissionName(name || '')}
                              />
                            </FormGroup>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Card>
              )
            }

            return '';
          })}
        </Box>
      </form>
    </FormProvider>
  )
}

export default RoleForm;

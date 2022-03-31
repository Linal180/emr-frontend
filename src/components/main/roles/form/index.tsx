// packages block
import { useState, ChangeEvent, FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, } from "@material-ui/core";
// components block
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
// constants and types block
import history from '../../../../history';
import { PermissionContext } from '../../../../context';
import { formatPermissionName } from '../../../../utils';
import { roleSchema } from '../../../../validationSchemas';
import { RoleItemInput, useAssignPermissionToRoleMutation, useCreateRoleMutation, useUpdateRoleMutation } from '../../../../generated/graphql';
import { GeneralFormProps } from '../../../../interfacesTypes';
import {
  APPOINTMENT_PERMISSIONS_TEXT, DESCRIPTION, PRACTICE_PERMISSIONS_TEXT, ROLES_ROUTE, ROLE_CREATED, ROLE_DETAILS_TEXT, ROLE_NAME,
} from "../../../../constants";

const RoleForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { practicePermissions } = useContext(PermissionContext)

  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
    seven: false,
    eight: false,
    nine: false,
    ten: false,
    eleven: false,
    twelve: false,
    thirteen: false,
  })
  const methods = useForm<RoleItemInput>({
    mode: "all", resolver: yupResolver(roleSchema)
  });
  const { handleSubmit, reset } = methods;

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

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
          Alert.success(ROLE_CREATED);
          history.push(ROLES_ROUTE)
        }
      }
    }
  });

  const assignPermissions = async (roleId: string) => {
    roleId && assignPermissionsRoles({
      variables: { rolePermissionItemInput: { roleId, permissionsId: [] } }
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
          const { id: roleId } = role || {}
          roleId && assignPermissions(roleId)
        }
      }
    }
  });

  const [updateRole] = useUpdateRoleMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateRole: { response, role } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          const { id: roleId } = role || {}
          roleId && assignPermissions(roleId)
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

  return (
    <>
      <Box maxHeight="calc(100vh - 280px)" className="overflowY-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <Card>
              {practicePermissions && practicePermissions.length > 0 &&
                <Box p={4}>
                  <Typography variant="h4">{PRACTICE_PERMISSIONS_TEXT}</Typography>
                  <Box p={2} />

                  <Grid container spacing={0}>
                    {practicePermissions.map(permission => {
                      const { id, name } = permission || {}

                      return (
                        <Grid item md={3} sm={6}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox(id || '')} />
                              }
                              label={formatPermissionName(name || '')}
                            />
                          </FormGroup>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              }
            </Card>

            <Card>
              <Box p={4}>
                <Typography variant="h4">{APPOINTMENT_PERMISSIONS_TEXT}</Typography>
                <Box p={2} />

                <Grid container spacing={0}>
                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.two} onChange={handleChangeForCheckBox("two")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.three} onChange={handleChangeForCheckBox("three")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.four} onChange={handleChangeForCheckBox("four")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.five} onChange={handleChangeForCheckBox("five")} />
                        }
                        label='Access Scheduling'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.six} onChange={handleChangeForCheckBox("six")} />
                        }
                        label='Access Scheduling'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.seven} onChange={handleChangeForCheckBox("seven")} />
                        }
                        label='Access Scheduling'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.eight} onChange={handleChangeForCheckBox("eight")} />
                        }
                        label='Appointment Provider Selection'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.nine} onChange={handleChangeForCheckBox("nine")} />
                        }
                        label='Appointment Provider Selection'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.ten} onChange={handleChangeForCheckBox("ten")} />
                        }
                        label='Use iPad EHR'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.eleven} onChange={handleChangeForCheckBox("eleven")} />
                        }
                        label='Use iPad EHR'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.twelve} onChange={handleChangeForCheckBox("twelve")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.thirteen} onChange={handleChangeForCheckBox("thirteen")} />
                        }
                        label='Create and Update Patients'
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </form>
        </FormProvider>
      </Box>
    </>
  )
}

export default RoleForm;

// packages block
import { useState, ChangeEvent, FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, } from "@material-ui/core";
// components block
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
// constants and types block
import { roleSchema } from '../../../../validationSchemas';
import { PermissionContext } from '../../../../context';
import { RoleItemInput } from '../../../../generated/graphql';
import { GeneralFormProps } from '../../../../interfacesTypes';
import {
  APPOINTMENT_PERMISSIONS_TEXT, DESCRIPTION, ROLE_DETAILS_TEXT, ROLE_NAME,
} from "../../../../constants";

const RoleForm: FC<GeneralFormProps> = (): JSX.Element => {
  const {
    facilityPermissions, providerPermissions, appointmentPermissions, patientPermissions, permissions,
    practicePermissions, schedulePermissions
  } = useContext(PermissionContext)

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
  const { handleSubmit } = methods;

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const onSubmit: SubmitHandler<RoleItemInput> = ({ role, description }) => { }

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
              <Box p={4}>
                <Typography variant="h4">{APPOINTMENT_PERMISSIONS_TEXT}</Typography>
                <Box p={2} />

                <Grid container spacing={0}>
                  {appointmentPermissions?.map(permission => {
                    const { id, name } = permission || {}

                    return (
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
                    )
                  })}
                </Grid>


              </Box>
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

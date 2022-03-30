// packages block
import { useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// components block
import Search from '../../../common/Search';
import PageHeader from "../../../common/PageHeader";
import InputController from '../../../../controller';
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, } from "@material-ui/core";
// constants block
import {
  ADD_ROLE_TEXT, APPOINTMENT_PERMISSIONS_TEXT, DESCRIPTION, NAME, ROLE_DETAILS_TEXT, SAVE_TEXT,
} from "../../../../constants";

const search = (query: string) => { }

const AddRoleComponent = (): JSX.Element => {
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
  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <>
      <PageHeader
        title={ADD_ROLE_TEXT}
        buttonText={SAVE_TEXT}
      />

      <Search search={search} />

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
                      controllerName="name"
                      controllerLabel={NAME}
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
export default AddRoleComponent;


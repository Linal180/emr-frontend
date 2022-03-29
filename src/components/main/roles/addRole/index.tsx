// packages block
import { useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// components block
import { Box, Card, Grid, Typography, Checkbox, FormControlLabel, FormGroup, } from "@material-ui/core";
// import Selector from '../../common/Selector';
import PageHeader from "../../../common/PageHeader";
import InputController from '../../../../controller';
// constants block
import Search from '../../../common/Search';
import { ADD_ROLE_TEXT, APPOINTMENT_PERMISSIONS_TEXT, DESCRIPTION, NAME, ROLE_DETAILS_TEXT, } from "../../../../constants";

const search = (query: string) => { }

const AddRoleComponent = (): JSX.Element => {
  const [state, setState] = useState({ one: false })
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
      <Box mt={2} mb={3}>
        <PageHeader title={ADD_ROLE_TEXT} />
        <Search search={search} />
      </Box>

      <Box>
        <Card>
          <Box p={4}>
            <Typography variant="h4">{ROLE_DETAILS_TEXT}</Typography>
            
            <Box p={2} />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
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
              </form>
            </FormProvider>
          </Box>
        </Card>

        <Box p={3} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Card>
              <Box p={4}>
                <Typography variant="h4">{APPOINTMENT_PERMISSIONS_TEXT}</Typography>
                <Box p={2} />

                <Grid container spacing={3}>
                  <Grid item md={4} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                        }
                        label={'Create and Update Patients'}
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={4} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                        }
                        label={'Create and Update Patients'}
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={4} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                        }
                        label={'Create and Update Patients'}
                      />
                    </FormGroup>
                  </Grid>
                  
                  <Grid item md={4} sm={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                        }
                        label={'Create and Update Patients'}
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


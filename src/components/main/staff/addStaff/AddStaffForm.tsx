// packages block
import { FC } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddStaffController from "./AddStaffController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import history from "../../../../history";
import { MappedRoleInterface } from "../../../../interfacesTypes";
import { CreateStaffInput, Gender, useCreateStaffMutation, UserRole } from "../../../../generated/graphql";
import { DOB, EMAIL, FIRST_NAME, LAST_NAME, MAPPED_GENDER, MAPPED_ROLES, MOBILE, PASSWORD_LABEL, PHONE, STAFF_BASIC_INFO, STAFF_CREATED, STAFF_ROUTE, USERNAME } from "../../../../constants";

const AddStaffForm: FC = () => {
  const methods = useForm<CreateStaffInput>({ mode: "all" });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  const [createStaff, { loading }] = useCreateStaffMutation({
    onError() {
      return null;
    },

    onCompleted(data) {
      const { createStaff: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(STAFF_CREATED);
          reset()
          history.push(STAFF_ROUTE)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<CreateStaffInput> = async ({ firstName, lastName, username, password, email, phone, mobile, roleType, dob, gender, facilityId }) => {
    await createStaff({
      variables: {
        createStaffInput: {
          firstName, lastName, username, email, password, phone, mobile, roleType, dob, gender, facilityId: "a817ee18-40af-4207-8413-7e6bed8744bc"
        }
      }
    })
  };

  const { email: { message: emailError } = {},
    dob: { message: dobError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    username: { message: usernameError } = {},
    password: { message: passwordError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
  } = errors;


  return (
    <FormProvider {...methods}>
      <CardComponent cardTitle={STAFF_BASIC_INFO}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="text"
                controllerName="firstName"
                control={control}
                error={firstNameError}
                controllerLabel={FIRST_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="text"
                controllerName="lastName"
                control={control}
                error={lastNameError}
                controllerLabel={LAST_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="text"
                controllerName="username"
                control={control}
                error={usernameError}
                controllerLabel={USERNAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="email"
                controllerName="email"
                control={control}
                error={emailError}
                controllerLabel={EMAIL}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="password"
                controllerName="password"
                control={control}
                error={passwordError}
                controllerLabel={PASSWORD_LABEL}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="date"
                controllerName="dob"
                control={control}
                error={dobError}
                controllerLabel={DOB}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="text"
                controllerName="phone"
                control={control}
                error={phoneError}
                controllerLabel={PHONE}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <AddStaffController
                fieldType="text"
                controllerName="mobile"
                control={control}
                error={mobileError}
                controllerLabel={MOBILE}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Controller
                name="roleType"
                defaultValue={UserRole.Staff}
                control={control}
                render={({ field }) => {
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="demo-customized-select-label-role" shrink>Role</InputLabel>
                      <Select
                        labelId="demo-customized-select-label-role"
                        id="demo-customized-select"
                        variant="outlined"
                      >
                        {MAPPED_ROLES.map((role: MappedRoleInterface, index: number) => {
                          const { label, value } = role;

                          return <MenuItem key={index} value={value}>{label}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  )
                }}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Controller
                name="gender"
                defaultValue={Gender.Male}
                control={control}
                render={({ field }) => {
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                      <Select
                        labelId="demo-customized-select-label-gender"
                        id="demo-customized-select-1"
                        variant="outlined"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {MAPPED_GENDER.map((gender) => {
                          const { label, value } = gender || {};

                          return <MenuItem key={value} value={value}>{label}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  )
                }}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" pt={2}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Create User
              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </CardComponent>
    </FormProvider>
  );
};

export default AddStaffForm;

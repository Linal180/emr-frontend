// packages block
import { FC, useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, FormHelperText } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddStaffController from "./AddStaffController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import history from "../../../../history";
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { addStaffSchema } from '../../../../validationSchemas';
import { MappedRoleInterface } from "../../../../interfacesTypes";
import { CreateStaffInput, Gender, useCreateStaffMutation, UserRole } from "../../../../generated/graphql";
import { DOB, EMAIL, FIRST_NAME, LAST_NAME, MAPPED_GENDER, MAPPED_ROLES, MOBILE, PASSWORD_LABEL, PHONE, STAFF_CREATED, CREATE_STAFF, STAFF_ROUTE, FORBIDDEN_EXCEPTION, FACILITY, ACCOUNT_INFO, IDENTIFICATION, PROVIDER, GENDER, EMAIL_OR_USERNAME_ALREADY_EXISTS } from "../../../../constants";

const AddStaffForm: FC = () => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const methods = useForm<CreateStaffInput>({
    mode: "all",
    resolver: yupResolver(addStaffSchema)
  });
  const { reset, handleSubmit, setValue, control, formState: { errors } } = methods;

  const [createStaff, { loading }] = useCreateStaffMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
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

  useEffect(() => {
    setValue("facilityId", facilityList && facilityList[0] && facilityList[0].id ? facilityList[0]?.id : "")
  }, [facilityList, setValue]);

  const onSubmit: SubmitHandler<CreateStaffInput> = async ({ firstName, lastName, username, password, email, phone, mobile, roleType, dob, gender, facilityId }) => {
    if (user) {
      const { id } = user

      await createStaff({
        variables: {
          createStaffInput: {
            firstName, lastName, email, password, phone, mobile, roleType, dob, gender, facilityId, adminId: id, username
          }
        }
      })
    }
  };

  const { email: { message: emailError } = {},
    dob: { message: dobError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    username: { message: usernameError } = {},
    password: { message: passwordError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
    facilityId: { message: facilityError } = {},
    roleType: { message: roleTypeError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box minHeight="calc(100vh - 300px)">
          <Grid container spacing={3}>
            <Grid item md={6}>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <Controller
                      name="facilityId"
                      defaultValue={facilityList && facilityList[0] && facilityList[0].id ? facilityList[0]?.id : ""}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal' error={Boolean(facilityError)}>
                            <InputLabel id="facility" shrink>{FACILITY}</InputLabel>
                            <Select
                              labelId="facility"
                              id="select-facility"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {facilityList?.map((facility) => {
                                const { id, name } = facility || {};

                                return <MenuItem key={id} value={id}>{name}</MenuItem>;
                              })}
                            </Select>
                            <FormHelperText>{facilityError && facilityError}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <Controller
                      name="roleType"
                      defaultValue={UserRole.Staff}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal' error={Boolean(roleTypeError)}>
                            <InputLabel id="role" shrink>Role</InputLabel>
                            <Select
                              labelId="role"
                              id="role-select"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_ROLES.map((role: MappedRoleInterface, index: number) => {
                                const { label, value } = role;

                                return <MenuItem key={index} value={value}>{label}</MenuItem>;
                              })}
                            </Select>

                            <FormHelperText>{roleTypeError}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
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
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="gender"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="gender" shrink>{GENDER}</InputLabel>
                            <Select
                              labelId="gender"
                              id="gender-select"
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

                  <Grid item md={6} sm={12} xs={12}>
                    <AddStaffController
                      fieldType="date"
                      controllerName="dob"
                      control={control}
                      error={dobError}
                      controllerLabel={DOB}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
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
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={ACCOUNT_INFO}>
                <AddStaffController
                  fieldType="email"
                  controllerName="email"
                  control={control}
                  error={emailError}
                  controllerLabel={EMAIL}
                />


                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddStaffController
                      fieldType="text"
                      controllerName="username"
                      control={control}
                      error={usernameError}
                      controllerLabel={PROVIDER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddStaffController
                      fieldType="password"
                      isPassword
                      controllerName="password"
                      control={control}
                      error={passwordError}
                      controllerLabel={PASSWORD_LABEL}
                    />
                  </Grid>
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {CREATE_STAFF}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider >
  );
};

export default AddStaffForm;

// packages block
import { useEffect, FC, useContext } from 'react'
import { useParams } from 'react-router';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, FormHelperText } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import UpdateStaffController from "./UpdateStaffController";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block
import history from "../../../../history";
import { yupResolver } from '@hookform/resolvers/yup';
import { MappedRoleInterface, ParamsType } from "../../../../interfacesTypes";
import { ListContext } from '../../../../context/listContext';
import { updateStaffSchema } from '../../../../validationSchemas';
import { CreateStaffInput, UserRole, Gender, useGetStaffLazyQuery, useUpdateStaffMutation, UpdateStaffInput } from "../../../../generated/graphql";
import { EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, IDENTIFICATION, ACCOUNT_INFO, STAFF_ROUTE, USERNAME, DOB, MAPPED_GENDER, STAFF_UPDATED, UPDATE_STAFF, GENDER, FACILITY, ROLE, MAPPED_ROLES } from "../../../../constants";

const UpdateStaffForm: FC = () => {
  const { id } = useParams<ParamsType>();
  const { facilityList } = useContext(ListContext)
  const methods = useForm<UpdateStaffInput>({
    mode: "all",
    resolver: yupResolver(updateStaffSchema)
  });

  const { reset, setValue, handleSubmit, control, formState: { errors } } = methods;

  const [getStaff, { loading: getStaffLoading }] = useGetStaffLazyQuery({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getStaff: { response, staff } } = data;

      if (response) {
        const { status } = response

        if (staff && status && status === 200) {
          const { firstName, lastName, username, email, phone, mobile, dob, gender, facility } = staff || {}
          const { id: facilityId } = facility || {}

          dob && setValue('dob', dob)
          email && setValue('email', email)
          phone && setValue('phone', phone)
          mobile && setValue('mobile', mobile)
          gender && setValue('gender', gender)
          lastName && setValue('lastName', lastName)
          username && setValue('username', username)
          firstName && setValue('firstName', firstName)
          facilityId && setValue('facilityId', facilityId)
          setValue('roleType', UserRole.Staff)
        }
      }
    }
  });

  const [updateStaff, { loading: updateStaffLoading }] = useUpdateStaffMutation({
    onError() {
      return null
    },

    onCompleted(data) {
      const { updateStaff: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(STAFF_UPDATED);
          reset()
          history.push(STAFF_ROUTE)
        }
      }
    }
  });


  useEffect(() => {
    if (id) {
      getStaff({
        variables: {
          getStaff: {
            id
          }
        }
      })
    } else {
      Alert.error('Staff not found!')
    }
  }, [getStaff, id])

  const onSubmit: SubmitHandler<CreateStaffInput> = async ({ firstName, lastName, username, email, phone, mobile, dob, gender }) => {
    if (id) {
      await updateStaff({
        variables: {
          updateStaffInput: {
            id, firstName, lastName, username, email, phone, mobile, dob, gender
          }
        }
      })
    } else {
      Alert.error('Staff cant be updated')
    }
  };

  const { email: { message: emailError } = {},
    dob: { message: dobError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    username: { message: usernameError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
    roleType: { message: roleError } = {},
    gender: { message: genderError } = {},
    facilityId: { message: facilityError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box minHeight="calc(100vh - 300px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                {getStaffLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <UpdateStaffController
                            fieldType="text"
                            controllerName="firstName"
                            control={control}
                            error={firstNameError}
                            controllerLabel={FIRST_NAME}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <UpdateStaffController
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
                            name="roleType"
                            defaultValue={UserRole.Staff}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth margin='normal' error={Boolean(genderError)}>
                                <InputLabel id="roleType" shrink>{ROLE}</InputLabel>
                                <Select
                                  labelId="roleType"
                                  id="select-role"
                                  variant="outlined"
                                  value={field.value}
                                  onChange={field.onChange}
                                >
                                  {MAPPED_ROLES.map((role: MappedRoleInterface, index: number) => {
                                    const { label, value } = role;

                                    return <MenuItem key={index} value={value}>{label}</MenuItem>;
                                  })}
                                </Select>
                                <FormHelperText>{roleError && roleError}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <Controller
                            name="gender"
                            defaultValue={Gender.Male}
                            control={control}
                            render={({ field }) => {
                              return (
                                <FormControl fullWidth error={Boolean(genderError)} margin='normal'>
                                  <InputLabel id="gender" shrink>{GENDER}</InputLabel>
                                  <Select
                                    labelId="gender"
                                    id="gender-id"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={field.onChange}
                                  >
                                    {MAPPED_GENDER.map((gender) => {
                                      const { label, value } = gender || {};

                                      return <MenuItem key={value} value={value}>{label}</MenuItem>;
                                    })}
                                  </Select>
                                  <FormHelperText>{genderError && genderError}</FormHelperText>
                                </FormControl>
                              )
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <UpdateStaffController
                          fieldType="date"
                          controllerName="dob"
                          control={control}
                          error={dobError}
                          controllerLabel={DOB}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={ACCOUNT_INFO}>
                {getStaffLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <UpdateStaffController
                          fieldType="text"
                          controllerName="username"
                          control={control}
                          error={usernameError}
                          controllerLabel={USERNAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <UpdateStaffController
                          fieldType="email"
                          controllerName="email"
                          control={control}
                          error={emailError}
                          controllerLabel={EMAIL}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>

                      <Grid item md={6} sm={12} xs={12}>
                        <UpdateStaffController
                          fieldType="text"
                          controllerName="phone"
                          control={control}
                          error={phoneError}
                          controllerLabel={PHONE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <UpdateStaffController
                          fieldType="text"
                          controllerName="mobile"
                          control={control}
                          error={mobileError}
                          controllerLabel={MOBILE}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Controller
                        name="facilityId"
                        defaultValue={""}
                        control={control}
                        render={({ field }) => {
                          return (
                            <FormControl fullWidth margin='normal' error={Boolean(facilityError)}>
                              <InputLabel id="facilityId" shrink>{FACILITY}</InputLabel>
                              <Select
                                labelId="facilityId"
                                id="facility-id"
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
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={updateStaffLoading}>
            {UPDATE_STAFF}
            {updateStaffLoading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>

    </FormProvider>
  );
};

export default UpdateStaffForm;
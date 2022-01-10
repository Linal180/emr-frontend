// packages block
import { useEffect, FC, useContext } from 'react'
import { useParams } from 'react-router';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import UpdateStaffController from "./UpdateStaffController";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block
import history from "../../../../history";
import { ParamsType } from "../../../../interfacesTypes";
import { CreateStaffInput, UserRole, Gender, useGetStaffLazyQuery, useUpdateStaffMutation, UpdateStaffInput } from "../../../../generated/graphql";
import { EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, STAFF_BASIC_INFO, STAFF_ROUTE, USERNAME, DOB, MAPPED_GENDER, STAFF_UPDATED, UPDATE_STAFF } from "../../../../constants";
import { ListContext } from '../../../../context/listContext';

const UpdateStaffForm: FC = () => {
  const { id } = useParams<ParamsType>();
  const { facilityList } = useContext(ListContext)
  const methods = useForm<UpdateStaffInput>({ mode: "all" });
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
  } = errors;

  return (
    <FormProvider {...methods}>
      <CardComponent cardTitle={STAFF_BASIC_INFO}>
        {getStaffLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
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

              <Grid item md={6} sm={12} xs={12}>
                <UpdateStaffController
                  fieldType="date"
                  controllerName="dob"
                  control={control}
                  error={dobError}
                  controllerLabel={DOB}
                />
              </Grid>

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

              <Grid item md={6} sm={12} xs={12}>
                <Controller
                  name="facilityId"
                  defaultValue={""}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControl fullWidth margin='normal'>
                        <InputLabel id="demo-customized-select-label-facility" shrink>Facility</InputLabel>
                        <Select
                          labelId="demo-customized-select-label-facility"
                          id="demo-customized-select-f"
                          variant="outlined"
                          onChange={field.onChange}
                        >
                          {facilityList?.map((facility) => {
                            const { id, name } = facility || {};

                            return <MenuItem key={id} value={id}>{name}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Button type="submit" variant="contained" color="primary" disabled={updateStaffLoading}>
                {UPDATE_STAFF}
                {updateStaffLoading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </form>
        )}
      </CardComponent>
    </FormProvider>
  );
};

export default UpdateStaffForm;
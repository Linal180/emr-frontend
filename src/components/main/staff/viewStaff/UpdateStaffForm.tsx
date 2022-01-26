// packages block
import { useEffect, FC, useContext } from 'react'
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import StaffController from '../controller';
import Selector from '../../../common/Selector';
import DatePicker from '../../../common/DatePicker';
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block
import history from "../../../../history";
import { ListContext } from '../../../../context/listContext';
import { getTimestamps, renderFacilities, setRecord } from "../../../../utils";
import { updateStaffSchema } from '../../../../validationSchemas';
import { ParamsType, ExtendedStaffInputProps } from "../../../../interfacesTypes";
import { Gender, useGetStaffLazyQuery, useUpdateStaffMutation } from "../../../../generated/graphql";
import {
  EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, IDENTIFICATION, ACCOUNT_INFO, STAFF_ROUTE,
  DOB, STAFF_UPDATED, UPDATE_STAFF, GENDER, FACILITY, ROLE, PROVIDER, MAPPED_ROLES, MAPPED_GENDER,
  STAFF_NOT_FOUND
} from "../../../../constants";

const UpdateStaffForm: FC = () => {
  const { id } = useParams<ParamsType>();
  const { facilityList } = useContext(ListContext)
  const methods = useForm<ExtendedStaffInputProps>({
    mode: "all",
    resolver: yupResolver(updateStaffSchema)
  });

  const { reset, setValue, handleSubmit, control, formState: { errors } } = methods;

  const [getStaff, { loading: getStaffLoading }] = useGetStaffLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getStaff: { response, staff } } = data;

      if (response) {
        const { status } = response

        if (staff && status && status === 200) {
          const { firstName, lastName, username, email, phone, mobile, dob, gender, facilityId, user, facility } = staff || {}
          const { roles } = user || {}
          const { role } = (roles && roles[0]) || {}
          const { name } = facility || {}

          email && setValue('email', email)
          phone && setValue('phone', phone)
          mobile && setValue('mobile', mobile)
          dob && setValue('dob', dob)
          lastName && setValue('lastName', lastName)
          username && setValue('username', username)
          firstName && setValue('firstName', firstName)
          role && setValue('roleType', setRecord(role, role))
          gender && setValue('gender', setRecord(gender, gender))
          facilityId && setValue('facilityId', setRecord(facilityId, name || ''))
        }
      }
    }
  });

  const [updateStaff, { loading: updateStaffLoading }] = useUpdateStaffMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
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
    } else Alert.error(STAFF_NOT_FOUND)
  }, [getStaff, id])

  const onSubmit: SubmitHandler<ExtendedStaffInputProps> = async ({ firstName, lastName, email, username, phone, mobile, dob, gender, facilityId }) => {
    if (id) {
      const { id: facilityID } = facilityId
      const { id: genderId } = gender

      await updateStaff({
        variables: {
          updateStaffInput: {
            id, firstName, lastName, email, phone, mobile, dob: getTimestamps(dob || ''), gender: genderId as Gender, facilityId: facilityID, username
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
    roleType: { id: roleError } = {},
    gender: { id: genderError } = {},
    facilityId: { id: facilityError } = {},
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
                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <Selector
                          value={{ id: "", name: "" }}
                          label={FACILITY}
                          name="facilityId"
                          error={facilityError?.message || ""}
                          options={renderFacilities(facilityList)}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <Selector
                          value={{ id: "", name: "" }}
                          label={ROLE}
                          name="roleType"
                          error={roleError?.message || ""}
                          options={MAPPED_ROLES}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <StaffController
                          fieldType="text"
                          controllerName="firstName"
                          control={control}
                          error={firstNameError}
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <StaffController
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
                        <Selector
                          value={{ id: "", name: "" }}
                          label={GENDER}
                          name="gender"
                          error={genderError?.message || ""}
                          options={MAPPED_GENDER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="dob" label={DOB} error={dobError || ''} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="phone" error={phoneError} label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="mobile" error={mobileError} label={MOBILE} />
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
                    <StaffController
                      fieldType="email"
                      controllerName="email"
                      control={control}
                      error={emailError}
                      disabled
                      controllerLabel={EMAIL}
                    />

                    <StaffController
                      fieldType="text"
                      controllerName="username"
                      control={control}
                      error={usernameError}
                      controllerLabel={PROVIDER}
                    />
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

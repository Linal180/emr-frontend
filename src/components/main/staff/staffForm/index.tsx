// packages block
import { useEffect, FC, useContext } from 'react';
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
import { AuthContext, ListContext } from '../../../../context';
import { getTimestamps, renderFacilities, setRecord } from "../../../../utils";
import { addStaffSchema, updateStaffSchema } from '../../../../validationSchemas';
import { ExtendedStaffInputProps, StaffFormProps } from "../../../../interfacesTypes";
import {
  Gender, useCreateStaffMutation, useGetStaffLazyQuery, UserRole,
  useUpdateStaffMutation
} from "../../../../generated/graphql";
import {
  EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PHONE, IDENTIFICATION, ACCOUNT_INFO, STAFF_ROUTE,
  DOB, STAFF_UPDATED, UPDATE_STAFF, GENDER, FACILITY, ROLE, PROVIDER, MAPPED_ROLES, MAPPED_GENDER,
  STAFF_NOT_FOUND, CANT_UPDATE_STAFF, CANT_CREATE_STAFF, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FORBIDDEN_EXCEPTION, STAFF_CREATED, PASSWORD_LABEL, CREATE_STAFF, EMPTY_OPTION
} from "../../../../constants";

const StaffForm: FC<StaffFormProps> = ({ isEdit, id }) => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const methods = useForm<ExtendedStaffInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? updateStaffSchema : addStaffSchema)
  });

  const { reset, setValue, handleSubmit, formState: { errors } } = methods;

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
          const {
            firstName, lastName, username, email, phone, mobile, dob, gender,
            facilityId, user, facility
          } = staff || {}
          const { roles } = user || {}
          const { role } = (roles && roles[0]) || {}
          const { name } = facility || {}

          dob && setValue('dob', dob)
          email && setValue('email', email)
          phone && setValue('phone', phone)
          mobile && setValue('mobile', mobile)
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

  const [createStaff, { loading: CreateStaffLoading }] = useCreateStaffMutation({
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
    if (isEdit) {
      if (id) {
        getStaff({
          variables: { getStaff: { id } }
        })
      } else Alert.error(STAFF_NOT_FOUND)
    }
  }, [getStaff, id, isEdit])

  const onSubmit: SubmitHandler<ExtendedStaffInputProps> = async ({
    firstName, lastName, email, username, phone, mobile, dob, gender, password,
    facilityId, roleType
  }) => {
    if (isEdit) {
      if (id) {
        const { id: facilityID } = facilityId
        const { id: genderId } = gender

        await updateStaff({
          variables: {
            updateStaffInput: {
              id, firstName, lastName, email, phone, mobile, dob: getTimestamps(dob || ''),
              gender: genderId as Gender, facilityId: facilityID, username
            }
          }
        })
      } else {
        Alert.error(CANT_UPDATE_STAFF)
      }
    } else {
      if (user) {
        const { id } = user
        const { id: facilityID } = facilityId
        const { id: role } = roleType
        const { id: staffGender } = gender

        await createStaff({
          variables: {
            createStaffInput: {
              firstName, lastName, email, password, phone, mobile, roleType: role as UserRole,
              dob: getTimestamps(dob || ''), gender: staffGender as Gender, facilityId: facilityID,
              adminId: id, username
            }
          }
        })
      } else Alert.error(CANT_CREATE_STAFF)
    }
  };

  const {
    dob: { message: dobError } = {},
    gender: { id: genderError } = {},
    roleType: { id: roleError } = {},
    email: { message: emailError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    facilityId: { id: facilityError } = {},
    username: { message: usernameError } = {},
    lastName: { message: lastNameError } = {},
    password: { message: passwordError } = {},
    firstName: { message: firstNameError } = {},
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
                          isRequired
                          value={EMPTY_OPTION}
                          label={FACILITY}
                          name="facilityId"
                          error={facilityError?.message || ""}
                          options={renderFacilities(facilityList)}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <Selector
                          isRequired
                          label={ROLE}
                          name="roleType"
                          value={EMPTY_OPTION}
                          options={MAPPED_ROLES}
                          error={roleError?.message || ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <StaffController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          error={firstNameError}
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <StaffController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          error={lastNameError}
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="gender"
                          label={GENDER}
                          value={EMPTY_OPTION}
                          error={genderError?.message || ""}
                          options={MAPPED_GENDER}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker isRequired name="dob" label={DOB} error={dobError || ''} />
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
                      isRequired
                      disabled={isEdit}
                      fieldType="email"
                      controllerName="email"
                      error={emailError}
                      controllerLabel={EMAIL}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={isEdit ? 12 : 6} sm={12} xs={12}>
                        <StaffController
                          fieldType="text"
                          controllerName="username"
                          error={usernameError}
                          controllerLabel={PROVIDER}
                        />
                      </Grid>

                      {!isEdit &&
                        <Grid item md={6} sm={12} xs={12}>
                          <StaffController
                            isRequired
                            isPassword
                            fieldType="password"
                            controllerName="password"
                            error={passwordError}
                            controllerLabel={PASSWORD_LABEL}
                          />
                        </Grid>
                      }
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={updateStaffLoading || CreateStaffLoading}
          >
            {isEdit ? UPDATE_STAFF : CREATE_STAFF}

            {(updateStaffLoading || CreateStaffLoading) && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default StaffForm;

// packages block
import { FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import DatePicker from '../../../common/DatePicker';
import AddStaffController from "./AddStaffController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import history from "../../../../history";
import { AuthContext } from '../../../../context';
import { renderFacilities } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { addStaffSchema } from '../../../../validationSchemas';
import { ExtendedStaffInputProps } from "../../../../interfacesTypes";
import { Gender, useCreateStaffMutation, UserRole } from "../../../../generated/graphql";
import { DOB, EMAIL, FIRST_NAME, LAST_NAME, MOBILE, PASSWORD_LABEL, PHONE, STAFF_CREATED, CREATE_STAFF, STAFF_ROUTE, FORBIDDEN_EXCEPTION, FACILITY, ACCOUNT_INFO, IDENTIFICATION, PROVIDER, GENDER, EMAIL_OR_USERNAME_ALREADY_EXISTS, MAPPED_ROLES, MAPPED_GENDER } from "../../../../constants";

const AddStaffForm: FC = () => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const methods = useForm<ExtendedStaffInputProps>({
    mode: "all",
    resolver: yupResolver(addStaffSchema)
  });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

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

  const onSubmit: SubmitHandler<ExtendedStaffInputProps> = async ({ firstName, lastName, username, password, email, phone, mobile, roleType, dob, gender, facilityId }) => {
    if (user) {
      const { id } = user
      const { id: facilityID } = facilityId
      const { id: role } = roleType
      const { id: staffGender } = gender

      await createStaff({
        variables: {
          createStaffInput: {
            firstName, lastName, email, password, phone, mobile, roleType: role as UserRole, dob, gender: staffGender as Gender, facilityId: facilityID, adminId: id, username
          }
        }
      })
    } else Alert.error("Can't create staff")
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
    gender: { message: genderError } = {},
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
                    <Selector
                      value={{ id: "", name: "" }}
                      label={FACILITY}
                      name="facilityId"
                      error={facilityError}
                      options={renderFacilities(facilityList)}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <Selector
                      value={{ id: "", name: "" }}
                      label={FACILITY}
                      name="roleType"
                      error={roleTypeError}
                      options={MAPPED_ROLES}
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
                    <Selector
                      value={{ id: "", name: "" }}
                      label={GENDER}
                      name="gender"
                      error={genderError}
                      options={MAPPED_GENDER}
                    />
                  </Grid>


                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="dob" label={DOB} error={dobError || ''} />
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
    </FormProvider>
  );
};

export default AddStaffForm;

// packages block
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import history from "../../../../history";
import { EMAIL, FIRST_NAME, FORBIDDEN_EXCEPTION, LAST_NAME, MAPPED_ROLES, MOBILE, PASSWORD_LABEL, PHONE, STAFF_ALREADY_EXIST, STAFF_BASIC_INFO, STAFF_CREATED, STAFF_ROUTE, USERNAME } from "../../../../constants";
import { CreateStaffInput, useCreateStaffMutation } from "../../../../generated/graphql";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import AddStaffController from "./AddStaffController";
import { MappedRoleInterface } from "../../../../interfacesTypes";

const StaffForm = () => {
  const methods = useForm<CreateStaffInput>({ mode: "all" });
  const { reset, getValues, clearErrors } = methods;

  const [createStaff, { loading }] = useCreateStaffMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        return Alert.error(STAFF_ALREADY_EXIST)
      }

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

  const { handleSubmit, control, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<CreateStaffInput> = async ({ firstName, lastName, username, email, password, phone, mobile, roleType, adminId, facilityId }) => {
    await createStaff({
      variables: {
        createStaffInput: {
          firstName, lastName, username, email, password, phone, mobile, roleType, adminId, facilityId
        }
      }
    })
  };

  const { email: { message: emailError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    username: { message: usernameError } = {},
    roleType: { message: roleTypeError } = {},
    lastName: { message: lastNameError } = {},
    password: { message: passwordError } = {},
    firstName: { message: firstNameError } = {},
    adminId: { message: adminIdError } = {},
    facilityId: { message: facilityIdError } = {},
  } = errors;


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardComponent cardTitle={STAFF_BASIC_INFO}>
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
                isPassword
                fieldType="password"
                controllerName="password"
                control={control}
                error={passwordError}
                controllerLabel={PASSWORD_LABEL}
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
              <FormControl fullWidth>
                <InputLabel id="demo-customized-select-label" shrink>Role</InputLabel>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  variant="outlined"
                >
                  {MAPPED_ROLES.map((role: MappedRoleInterface, index: number) => {
                    const { label, value } = role;

                    return <MenuItem key={index} value={value}>{label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>

          </Grid>
        </CardComponent>
      </form>
    </FormProvider>
  );
};

export default StaffForm;
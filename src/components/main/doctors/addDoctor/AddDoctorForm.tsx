// packages block
import { FC, useContext } from 'react';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
// components block
import AddDoctorController from "./AddDoctorController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import { ListContext } from '../../../../context/listContext';
import { MappedRoleInterface } from "../../../../interfacesTypes";
import { Gender, UserRole } from "../../../../generated/graphql";
import { DOB, EMAIL, FIRST_NAME, LAST_NAME, MAPPED_GENDER, MAPPED_ROLES, MOBILE, PASSWORD_LABEL, PHONE, ADD_DOCTOR, USERNAME, FACILITY, ACCOUNT_INFO, IDENTIFICATION } from "../../../../constants";

const AddDoctorForm: FC = () => {
  const { facilityList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all"
  });
  const { handleSubmit, control } = methods;

  const onSubmit: any = () => {

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 240px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="gender"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
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

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="gender"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
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

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={IDENTIFICATION}>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="gender"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
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

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="gender"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
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

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={IDENTIFICATION}>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="gender"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
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

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="gender"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
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

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>

              <CardComponent cardTitle={ACCOUNT_INFO}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="username"
                      control={control}
                      controllerLabel={USERNAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="email"
                      controllerName="email"
                      control={control}
                      controllerLabel={EMAIL}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="password"
                      controllerName="password"
                      control={control}
                      controllerLabel={PASSWORD_LABEL}
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
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="phone"
                      control={control}
                      controllerLabel={PHONE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="mobile"
                      control={control}
                      controllerLabel={MOBILE}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={IDENTIFICATION}>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="gender"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
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

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={IDENTIFICATION}>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
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
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
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
                          <FormControl fullWidth margin='normal'>
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

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary">
            {ADD_DOCTOR}
          </Button>
        </Box>

      </form>
    </FormProvider >
  );
};

export default AddDoctorForm;

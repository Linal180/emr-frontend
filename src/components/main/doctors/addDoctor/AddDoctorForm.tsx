// packages block
import { FC, useState } from 'react';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, FormControlLabel, Switch, FormGroup, FormHelperText } from "@material-ui/core";
// components block
import AddDoctorController from "./AddDoctorController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import { MappedRoleInterface } from "../../../../interfacesTypes";
import { Gender, UserRole } from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, MAPPED_GENDER, CITY, STATE, COUNTRY, MAPPED_ROLES, AVAILIBITY_STATUS, ADD_DOCTOR, ADDITIONAL_INFO, BILLING_ADDRESS, SCHEDULE_APPOINTMENTS_TEXT, CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION,
  MIDDLE_INITIAL, PREFIX, SUFFIX, PROVIDER_INITIALS, CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER, TAXONOMY_CODE, DEA_NUMBER, DEA_ACTIVE_DATE, DEA_ERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2, FEDERAL_TAX_ID,
  CHECK_PAYABLE_TO, BANK_ACCOUNT, MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER, MAMMOGRAPHY_CERT_NUMBER, CHAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_SUFF, SPECIALITY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LISENCE_ACTIVE_DATE, LICENSE_TERM_DATE, PRESCRIPTIVE_AUTH_NUMBER,
} from "../../../../constants";
import { useFormStyles } from '../../../../styles/formsStyles';

const AddDoctorForm: FC = () => {
  const classes = useFormStyles()
  const methods = useForm<any>({
    mode: "all"
  });
  const { handleSubmit, control } = methods;
  const [value, setValue] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const handleChange = (event: any) => {
    setValue(
      {
        ...value,
        [event.target.name]: event.target.checked
      }
    )
  };
  const onSubmit: any = () => {

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
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
                      controllerName="middleInitial"
                      control={control}
                      controllerLabel={MIDDLE_INITIAL}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="prefix"
                      control={control}
                      controllerLabel={PREFIX}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="suffix"
                      control={control}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="providerInitials"
                      control={control}
                      controllerLabel={PROVIDER_INITIALS}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="credentials"
                      control={control}
                      controllerLabel={CREDENTIALS}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="specialty"
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

                <Grid item md={12}>
                  <AddDoctorController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="primaryServiceLocation"
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

              <CardComponent cardTitle={ADDITIONAL_INFO}>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="socialSecurityNumber"
                      control={control}
                      controllerLabel={SOCIAL_SECURITY_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="socialSecurityType"
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
                    controllerName="taxonomyCode"
                    control={control}
                    controllerLabel={TAXONOMY_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="DEANumber"
                    control={control}
                    controllerLabel={DEA_NUMBER}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="DEAActiveDate"
                      control={control}
                      controllerLabel={DEA_ACTIVE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="DEATermDate"
                      control={control}
                      controllerLabel={DEA_ERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="languageSpoken"
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

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="email"
                    control={control}
                    controllerLabel={EMAIL}
                  />
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
                      controllerName="fax"
                      control={control}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address2"
                    control={control}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="practiceType"
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
                    controllerName="federalTaxID"
                    control={control}
                    controllerLabel={FEDERAL_TAX_ID}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="checkPayableTo"
                    control={control}
                    controllerLabel={CHECK_PAYABLE_TO}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="bankAccount"
                    control={control}
                    controllerLabel={BANK_ACCOUNT}
                  />
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>

              <CardComponent cardTitle={SCHEDULE_APPOINTMENTS_TEXT}>
                <Box mb={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <FormGroup>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.sunday} onChange={handleChange} name="sunday" color='primary' />}
                          label="Sunday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.monday} onChange={handleChange} name="monday" color='primary' />}
                          label="Monday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.wednesday} onChange={handleChange} name="wednesday" color='primary' />}
                          label="Wednesday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.thursday} onChange={handleChange} name="thursday" color='primary' />}
                          label="Thursday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.friday} onChange={handleChange} name="friday" color='primary' />}
                          label="Friday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.saturday} onChange={handleChange} name="saturday" color='primary' />}
                          label="Saturday"
                        />
                        <FormHelperText className={classes.heplerText}>{AVAILIBITY_STATUS}</FormHelperText>
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Box>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={CONTACT_INFORMATION}>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="email"
                    control={control}
                    controllerLabel={EMAIL}
                  />
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

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="pager"
                      control={control}
                      controllerLabel={PAGER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="fax"
                      control={control}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address2"
                    control={control}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={TAX_ID_DETAILS}>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="taxID"
                      control={control}
                      controllerLabel={TAX_ID}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="NPI"
                      control={control}
                      controllerLabel={NPI}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="UPIN"
                      control={control}
                      controllerLabel={UPIN}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="EMCProviderID"
                      control={control}
                      controllerLabel={EMC_PROVIDER_ID}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="organizationType"
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
                      name="billingFacility"
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
                      controllerName="medicareGRPNumber"
                      control={control}
                      controllerLabel={MEDICARE_GRP_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="medicaidGRPNumber"
                      control={control}
                      controllerLabel={MEDICAID_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="mammographyCertNumber"
                      control={control}
                      controllerLabel={MAMMOGRAPHY_CERT_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="champusGRPNumber"
                      control={control}
                      controllerLabel={CHAMPUS_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="blueShiedNumber"
                      control={control}
                      controllerLabel={BLUE_SHIED_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="taxIDSuff"
                      control={control}
                      controllerLabel={TAX_ID_SUFF}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="specialityLicense"
                      control={control}
                      controllerLabel={SPECIALITY_LICENSE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="anesthesiaLicense"
                      control={control}
                      controllerLabel={ANESTHESIA_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="CTPNumber"
                      control={control}
                      controllerLabel={CTP_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="stateLicense"
                      control={control}
                      controllerLabel={STATE_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lisenceActiveDate"
                      control={control}
                      controllerLabel={LISENCE_ACTIVE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="licenseTermDate"
                      control={control}
                      controllerLabel={LICENSE_TERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="prescriptiveAuthNumber"
                    control={control}
                    controllerLabel={PRESCRIPTIVE_AUTH_NUMBER}
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

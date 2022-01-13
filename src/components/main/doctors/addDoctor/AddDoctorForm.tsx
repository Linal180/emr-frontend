// packages block
import { FC, useState, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, FormControlLabel, Switch, FormGroup, FormHelperText } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddDoctorController from "./AddDoctorController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { doctorSchema } from '../../../../validationSchemas';
import { DoctorInputProps } from "../../../../interfacesTypes";
import { useFormStyles } from '../../../../styles/formsStyles';
import { Speciality, SsnType, useCreateDoctorMutation, UserRole } from "../../../../generated/graphql";
import {
  FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, MAPPED_SSN_TYPES,
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CREATE_DOCTOR, ADDITIONAL_INFO, BILLING_ADDRESS, SCHEDULE_APPOINTMENTS_TEXT, CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION,
  MIDDLE_NAME, PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER, TAXONOMY_CODE, DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2, MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER, MAMMOGRAPHY_CERT_NUMBER, CAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE, PRESCRIPTIVE_AUTH_NUMBER, AVAILABILITY_STATUS, DOCTOR_CREATED, DOCTORS_ROUTE, MAPPED_SPECIALTIES, LANGUAGE_SPOKEN,
} from "../../../../constants";

const AddDoctorForm: FC = () => {
  const { user } = useContext(AuthContext)
  const classes = useFormStyles()
  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });
  const { reset, control, handleSubmit, formState: { errors } } = methods;
  const [value, setValue] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const [createDoctor, { loading }] = useCreateDoctorMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_CREATED);
          reset()
          history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  const handleChange = (event: any) => {
    setValue(
      {
        ...value,
        [event.target.name]: event.target.checked
      }
    )
  };

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const { email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country,
      billingEmail, billingPhone, billingFax, billingAddress, billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId,
      firstName, middleName, lastName, prefix, suffix, password, facilityId, providerIntials,
      degreeCredentials, speciality, dob, ssn, ssnType,
    } = inputs;

    if (user) {
      const { id: userId } = user

      await createDoctor({
        variables: {
          createDoctorInput: {
            createDoctorItemInput: {
              firstName: firstName || "", middleName: middleName || "", lastName: lastName || "", prefix: prefix || "", suffix: suffix || "", email: email || "", password: password || "", facilityId: facilityId || "", providerIntials: providerIntials || "",
              degreeCredentials: degreeCredentials || "", speciality: speciality || Speciality.Gastroenterology, dob: dob || "", ssn: ssn || "", ssnType: ssnType || SsnType.Medicare, roleType: UserRole.Doctor, adminId: userId || "",
            },

            createContactInput: { email: email || "", pager: pager || "", phone: phone || "", mobile: mobile || "", fax: fax || "", address: address || "", address2: address2 || "", zipCode: zipCode || "", city: city || "", state: state || "", country: country || "", facilityId: facilityId || "" },
            createBillingAddressInput: { email: billingEmail || "", phone: billingPhone || "", fax: billingFax || "", address: billingAddress || "", address2: billingAddress2 || "", zipCode: billingZipCode || "", city: billingCity || "", state: billingState || "", country: billingCountry || "", userId: billingUserId || "", facilityId: facilityId || "" }
          }
        }
      })
    } else {
      Alert.error("Failed to create doctor!")
    }
  };

  const {
    dob: { message: dobError } = {},
    ssn: { message: ssnError } = {},
    prefix: { message: prefixError } = {},
    suffix: { message: suffixError } = {},
    ssnType: { message: ssnTypeError } = {},
    lastName: { message: lastNameError } = {},
    // password: { message: passwordError } = {},
    // roleType: { message: roleTypeError } = {},
    firstName: { message: firstNameError } = {},
    // speciality: { message: specialityError } = {},
    facilityId: { message: facilityIdError } = {},
    middleName: { message: middleNameError } = {},
    providerIntials: { message: providerInitialsError } = {},
    degreeCredentials: { message: degreeCredentialsError } = {},
    languagesSpoken: { message: languagesSpokenError } = {},
    taxonomyCode: { message: taxonomyCodeError } = {},
    deaNumber: { message: deaNumberError } = {},
    deaActiveDate: { message: deaActiveDateError } = {},
    deaTermDate: { message: deaTermDateError } = {},
    taxId: { message: taxIdError } = {},
    npi: { message: npiError } = {},
    upin: { message: upinError } = {},
    emcProviderId: { message: emcProviderIdError } = {},
    medicareGrpNumber: { message: medicareGrpNumberError } = {},
    medicaidGrpNumber: { message: medicaidGrpNumberError } = {},
    meammographyCertNumber: { message: meammographyCertNumberError } = {},
    campusGrpNumber: { message: campusGrpNumberError } = {},
    blueShildNumber: { message: blueShieldNumberError } = {},
    taxIdStuff: { message: taxIdStuffError } = {},
  
    specialityLicense: { message: specialtyLicenseError } = {},
    anesthesiaLicense: { message: anesthesiaLicenseError } = {},
    dpsCtpNumber: { message: dpsCtpNumberError } = {},
    stateLicense: { message: stateLicenseError } = {},
    licenseActiveDate: { message: licenseActiveDateError } = {},
    licenseTermDate: { message: licenseTermDateError } = {},
    prescriptiveAuthNumber: { message: prescriptiveAuthNumberError } = {},

    fax: { message: faxError } = {},
    city: { message: cityError } = {},
    state: { message: stateError } = {},
    email: { message: emailError } = {},
    pager: { message: pagerError } = {},
    phone: { message: phoneError } = {},
    mobile: { message: mobileError } = {},
    address: { message: addressError } = {},
    zipCode: { message: zipCodeError } = {},
    country: { message: countryError } = {},
    address2: { message: address2Error } = {},

    billingFax: { message: billingFaxError } = {},
    billingCity: { message: billingCityError } = {},
    billingState: { message: billingStateError } = {},
    billingEmail: { message: billingEmailError } = {},
    billingPager: { message: billingPagerError } = {},
    billingPhone: { message: billingPhoneError } = {},
    billingMobile: { message: billingMobileError } = {},
    billingAddress: { message: billingAddressError } = {},
    billingZipCode: { message: billingZipCodeError } = {},
    billingCountry: { message: billingCountryError } = {},
    billingAddress2: { message: billingAddress2Error } = {},

  } = errors;
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
                      error={firstNameError}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="lastName"
                      error={lastNameError}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="middleName"
                      error={middleNameError}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="prefix"
                      error={prefixError}
                      controllerLabel={PREFIX}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="suffix"
                      error={suffixError}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="providerIntials"
                      error={providerInitialsError}
                      controllerLabel={PROVIDER_INITIALS}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="degreeCredentials"
                      error={degreeCredentialsError}
                      controllerLabel={DEGREE_CREDENTIALS}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="speciality"
                      control={control}
                      defaultValue={Speciality.Gastroenterology}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="specialty" shrink>Gender</InputLabel>
                            <Select
                              labelId="specialty"
                              id="specialty-select"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_SPECIALTIES.map((specialty) => {
                                const { label, value } = specialty || {};

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
                    error={dobError}
                    controllerLabel={DOB}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={ADDITIONAL_INFO}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="ssn"
                      error={ssnError}
                      controllerLabel={SOCIAL_SECURITY_NUMBER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="ssnType"
                      control={control}
                      defaultValue={SsnType.Medicare}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="ssn-type" shrink>SSN Type</InputLabel>
                            <Select
                              labelId="ssn3-type"
                              id="select-ssn-type"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_SSN_TYPES.map((ssnType) => {
                                const { label, value } = ssnType || {};

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
                    error={taxonomyCodeError}
                    controllerLabel={TAXONOMY_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="deaNumber"
                    error={deaNumberError}
                    controllerLabel={DEA_NUMBER}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="deaActiveDate"
                      error={deaActiveDateError}
                      controllerLabel={DEA_ACTIVE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="deaTermDate"
                      error={deaTermDateError}
                      controllerLabel={DEA_TERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="languageSpoken"
                      error={languagesSpokenError}
                      controllerLabel={LANGUAGE_SPOKEN}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="billingEmail"
                    error={billingEmailError}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="billingPhone"
                      error={billingPhoneError}
                      controllerLabel={PHONE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="billingFax"
                      error={billingFaxError}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="billingZipCode"
                    error={billingZipCodeError}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="billingAddress"
                    error={billingAddressError}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="billingAddress2"
                    error={billingAddress2Error}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="billingCity"
                      error={billingCityError}
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="billingState"
                      error={billingStateError}
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="billingCountry"
                      error={billingCountryError}
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
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
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.monday} onChange={handleChange} name="monday" color='primary' />}
                          label="Monday"
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.wednesday} onChange={handleChange} name="wednesday" color='primary' />}
                          label="Wednesday"
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.thursday} onChange={handleChange} name="thursday" color='primary' />}
                          label="Thursday"
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.friday} onChange={handleChange} name="friday" color='primary' />}
                          label="Friday"
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
                        <FormControlLabel
                          className={classes.controlLabel}
                          labelPlacement="start"
                          control={<Switch checked={value.saturday} onChange={handleChange} name="saturday" color='primary' />}
                          label="Saturday"
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>
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
                    error={emailError}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="phone"
                      error={phoneError}
                      controllerLabel={PHONE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="mobile"
                      error={mobileError}
                      controllerLabel={MOBILE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="pager"
                      error={pagerError}
                      controllerLabel={PAGER}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="fax"
                      error={faxError}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="zipCode"
                    error={zipCodeError}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address"
                    error={addressError}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="address2"
                    error={address2Error}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="city"
                      error={cityError}
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="state"
                      error={stateError}
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="country"
                      error={countryError}
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
                      controllerName="taxId"
                      error={taxIdError}
                      controllerLabel={TAX_ID}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="npi"
                      error={npiError}
                      controllerLabel={NPI}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="upin"
                      error={upinError}
                      controllerLabel={UPIN}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="emcProviderId"
                      error={emcProviderIdError}
                      controllerLabel={EMC_PROVIDER_ID}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="medicareGrpNumber"
                      error={medicareGrpNumberError}
                      controllerLabel={MEDICARE_GRP_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="medicaidGrpNumber"
                      error={medicaidGrpNumberError}
                      controllerLabel={MEDICAID_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="meammographyCertNumber"
                      error={meammographyCertNumberError}
                      controllerLabel={MAMMOGRAPHY_CERT_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="campusGprNumber"
                      error={campusGrpNumberError}
                      controllerLabel={CAMPUS_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="blueShildNumber"
                      error={blueShieldNumberError}
                      controllerLabel={BLUE_SHIED_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="taxIdStuff"
                      error={taxIdStuffError}
                      controllerLabel={TAX_ID_STUFF}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="specialityLicense"
                      error={specialtyLicenseError}
                      controllerLabel={SPECIALTY_LICENSE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="anesthesiaLicense"
                      error={anesthesiaLicenseError}
                      controllerLabel={ANESTHESIA_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="dpsCtpNumber"
                      error={dpsCtpNumberError}
                      controllerLabel={CTP_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="stateLicense"
                      error={stateLicenseError}
                      controllerLabel={STATE_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="licenseActiveDate"
                      error={licenseActiveDateError}
                      controllerLabel={LICENSE_ACTIVE_DATE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddDoctorController
                      fieldType="text"
                      controllerName="licenseTermDate"
                      error={licenseTermDateError}
                      controllerLabel={LICENSE_TERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddDoctorController
                    fieldType="text"
                    controllerName="prescriptiveAuthNumber"
                    error={prescriptiveAuthNumberError}
                    controllerLabel={PRESCRIPTIVE_AUTH_NUMBER}
                  />
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {CREATE_DOCTOR}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider >
  );
};

export default AddDoctorForm;

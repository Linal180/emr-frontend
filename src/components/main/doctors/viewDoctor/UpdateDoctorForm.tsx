// packages block
import { FC, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, FormControlLabel, Switch, FormGroup, FormHelperText } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import DoctorController from "../controllers";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { getDate, getTimestamps } from "../../../../utils";
import { AuthContext } from '../../../../context';
import { doctorSchema } from '../../../../validationSchemas';
import { useFormStyles } from '../../../../styles/formsStyles';
import { DoctorInputProps, ParamsType } from "../../../../interfacesTypes";
import { DoctorPayload, Speciality, SsnType, useGetDoctorLazyQuery, UserRole, useUpdateDoctorMutation } from "../../../../generated/graphql";
import {
  MAPPED_SSN_TYPES, FACILITY, FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, UPDATE_DOCTOR,
  SCHEDULE_APPOINTMENTS_TEXT, CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION, MIDDLE_NAME,
  PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER, TAXONOMY_CODE,
  DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2,
  MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  MAMMOGRAPHY_CERT_NUMBER, CAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE,
  PRESCRIPTIVE_AUTH_NUMBER, AVAILABILITY_STATUS, DOCTORS_ROUTE, MAPPED_SPECIALTIES,
  LANGUAGE_SPOKEN, SPECIALTY, SSN_TYPE, DOCTOR_UPDATED, ADDITIONAL_INFO, BILLING_ADDRESS,

} from "../../../../constants";
import { ListContext } from '../../../../context/listContext';

const UpdateDoctorForm: FC = () => {
  const classes = useFormStyles()
  const { id } = useParams<ParamsType>();
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const [doctor, setDoctor] = useState<DoctorPayload['doctor']>()
  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });

  const { reset, control, handleSubmit, setValue, formState: { errors } } = methods;
  const [values, setValues] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const [getDoctor] = useGetDoctorLazyQuery({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getDoctor: { response, doctor } } = data;

      if (response) {
        const { status } = response

        if (doctor && status && status === 200) {
          const { dob, ssn, prefix, suffix, ssnType, lastName, firstName, speciality, middleName, providerIntials,
            degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi,
            upin, emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber,
            blueShildNumber, taxIdStuff, facility, contacts, billingAddress, specialityLicense, anesthesiaLicense,
            dpsCtpNumber, stateLicense, licenseActiveDate, licenseTermDate, prescriptiveAuthNumber,
          } = doctor

          const { id: facilityId } = facility || {}

          dob && setValue('dob', dob)
          ssn && setValue('ssn', ssn)
          prefix && setValue('prefix', prefix)
          suffix && setValue('suffix', suffix)
          ssnType && setValue('ssnType', ssnType)
          lastName && setValue('lastName', lastName)
          firstName && setValue('firstName', firstName)
          speciality && setValue('speciality', speciality)
          middleName && setValue('middleName', middleName)
          providerIntials && setValue('providerIntials', providerIntials)
          degreeCredentials && setValue('degreeCredentials', degreeCredentials)
          languagesSpoken && setValue('languagesSpoken', languagesSpoken)
          taxonomyCode && setValue('taxonomyCode', taxonomyCode)
          deaNumber && setValue('deaNumber', deaNumber)
          deaActiveDate && setValue('deaActiveDate', getDate(deaActiveDate))
          deaTermDate && setValue('deaTermDate', getDate(deaTermDate))
          taxId && setValue('taxId', taxId)
          npi && setValue('npi', npi)
          upin && setValue('upin', upin)
          emcProviderId && setValue('emcProviderId', emcProviderId)
          medicareGrpNumber && setValue('medicareGrpNumber', medicareGrpNumber)
          medicaidGrpNumber && setValue('medicaidGrpNumber', medicaidGrpNumber)
          meammographyCertNumber && setValue('meammographyCertNumber', meammographyCertNumber)
          campusGrpNumber && setValue('campusGrpNumber', campusGrpNumber)
          blueShildNumber && setValue('blueShildNumber', blueShildNumber)
          taxIdStuff && setValue('taxIdStuff', taxIdStuff)
          facilityId && setValue('facilityId', facilityId)
          specialityLicense && setValue('specialityLicense', specialityLicense)
          anesthesiaLicense && setValue('anesthesiaLicense', anesthesiaLicense)
          dpsCtpNumber && setValue('dpsCtpNumber', dpsCtpNumber)
          stateLicense && setValue('stateLicense', stateLicense)
          licenseActiveDate && setValue('licenseActiveDate', getDate(licenseActiveDate))
          licenseTermDate && setValue('licenseTermDate', getDate(licenseTermDate))
          prescriptiveAuthNumber && setValue('prescriptiveAuthNumber', prescriptiveAuthNumber)

          setDoctor(doctor)

          if (contacts) {
            const { email, phone, zipCode, mobile, fax, address, address2, city, state, country } = contacts[0]

            fax && setValue('fax', fax)
            city && setValue('city', city)
            email && setValue('email', email)
            state && setValue('state', state)
            phone && setValue('phone', phone)
            mobile && setValue('mobile', mobile)
            zipCode && setValue('zipCode', zipCode)
            address && setValue('address', address)
            country && setValue('country', country)
            address2 && setValue('address2', address2)
          }

          if (billingAddress) {
            const { email, zipCode, fax, address, address2, phone, city, state, country } = billingAddress[0]

            fax && setValue('billingFax', fax)
            city && setValue('billingCity', city)
            email && setValue('billingEmail', email)
            state && setValue('billingState', state)
            phone && setValue('billingPhone', phone)
            address && setValue('billingAddress', address)
            country && setValue('billingCountry', country)
            zipCode && setValue('billingZipCode', zipCode)
            address2 && setValue('billingAddress2', address2)
          }
        }
      }
    }
  });

  const [updateDoctor, { loading }] = useUpdateDoctorMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_UPDATED);
          reset()
          history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getDoctor({
        variables: {
          getDoctor: {
            id
          }
        }
      })
    } else {
      Alert.error('Doctor not found!')
    }
  }, [getDoctor, id])

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked
    })
  };

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const { email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country,
      billingEmail, billingPhone, billingFax, billingAddress: billingAddress1, billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId,
      dob, ssn, prefix, suffix, ssnType, lastName, firstName, speciality, middleName, providerIntials,
      degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi, upin,
      emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber, blueShildNumber,
      taxIdStuff, facilityId, specialityLicense, anesthesiaLicense, dpsCtpNumber, stateLicense,
      licenseActiveDate, licenseTermDate, prescriptiveAuthNumber, password
    } = inputs;

    const { contacts, billingAddress } = doctor || {}

    if (user && id && contacts && billingAddress) {
      const { id: userId } = user
      const { id: contactId } = contacts[0]
      const { id: billingId } = billingAddress[0]

      await updateDoctor({
        variables: {
          updateDoctorInput: {
            updateDoctorItemInput: {
              id, firstName: firstName || "", middleName: middleName || "", lastName: lastName || "", prefix: prefix || "",
              suffix: suffix || "", email: email || "", password: password || "", facilityId: facilityId || "",
              providerIntials: providerIntials || "", degreeCredentials: degreeCredentials || "",
              speciality: speciality || Speciality.Gastroenterology, dob: dob || "", ssn: ssn || "",
              ssnType: ssnType || SsnType.Medicare, roleType: UserRole.Doctor, adminId: userId || "",
              languagesSpoken: languagesSpoken || "", taxonomyCode: taxonomyCode || "", deaNumber: deaNumber || "",
              deaActiveDate: getTimestamps(deaActiveDate || "") , deaTermDate: getTimestamps(deaTermDate || ""), taxId: taxId || "", npi: npi || "",
              upin: upin || "", emcProviderId: emcProviderId || "", medicareGrpNumber: medicareGrpNumber || "",
              medicaidGrpNumber: medicaidGrpNumber || "", meammographyCertNumber: meammographyCertNumber || "",
              campusGrpNumber: campusGrpNumber || "", blueShildNumber: blueShildNumber || "", taxIdStuff: taxIdStuff || "",
              specialityLicense: specialityLicense || "", anesthesiaLicense: anesthesiaLicense || "", dpsCtpNumber: dpsCtpNumber || "",
              stateLicense: stateLicense || "", licenseActiveDate: getTimestamps(licenseActiveDate || ""), licenseTermDate: getTimestamps(licenseTermDate || ""),
              prescriptiveAuthNumber: prescriptiveAuthNumber || "",
            },

            updateContactInput: { id: contactId, email: email || "", pager: pager || "", phone: phone || "", mobile: mobile || "", fax: fax || "", address: address || "", address2: address2 || "", zipCode: zipCode || "", city: city || "", state: state || "", country: country || "", facilityId: facilityId || "" },
            updateBillingAddressInput: { id: billingId, email: billingEmail || "", phone: billingPhone || "", fax: billingFax || "", address: billingAddress1 || "", address2: billingAddress2 || "", zipCode: billingZipCode || "", city: billingCity || "", state: billingState || "", country: billingCountry || "", userId: billingUserId || "", facilityId: facilityId || "" }
          }
        }
      })
    } else {
      Alert.error("Failed to update doctor!")
    }
  };

  useEffect(() => {
    setValue("facilityId", facilityList && facilityList[0] && facilityList[0].id ? facilityList[0]?.id : "")
  }, [facilityList, setValue]);

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
    speciality: { message: specialtyError } = {},
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
    facilityId: { message: facilityError } = {},
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
    billingPhone: { message: billingPhoneError } = {},
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
                  <Grid item md={6}>
                    <Controller
                      name="facilityId"
                      defaultValue={facilityList && facilityList[0] && facilityList[0].id ? facilityList[0]?.id : ""}
                      control={control}
                      render={({ field }) => (
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
                      )}
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
                            <InputLabel id="specialty" shrink>{SPECIALTY}</InputLabel>
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

                            <FormHelperText>{specialtyError && specialtyError}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="firstName"
                      error={firstNameError}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="lastName"
                      error={lastNameError}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="middleName"
                      error={middleNameError}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="prefix"
                      error={prefixError}
                      controllerLabel={PREFIX}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="suffix"
                      error={suffixError}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="providerIntials"
                      error={providerInitialsError}
                      controllerLabel={PROVIDER_INITIALS}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="degreeCredentials"
                      error={degreeCredentialsError}
                      controllerLabel={DEGREE_CREDENTIALS}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <DoctorController
                      fieldType="date"
                      controllerName="dob"
                      error={dobError}
                      controllerLabel={DOB}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={ADDITIONAL_INFO}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
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
                            <InputLabel id="ssn-type" shrink>{SSN_TYPE}</InputLabel>
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

                            <FormHelperText>{ssnTypeError && ssnTypeError}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="taxonomyCode"
                    error={taxonomyCodeError}
                    controllerLabel={TAXONOMY_CODE}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="date"
                      controllerName="deaActiveDate"
                      error={deaActiveDateError}
                      controllerLabel={DEA_ACTIVE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="date"
                      controllerName="deaTermDate"
                      error={deaTermDateError}
                      controllerLabel={DEA_TERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="languagesSpoken"
                      error={languagesSpokenError}
                      controllerLabel={LANGUAGE_SPOKEN}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="deaNumber"
                      error={deaNumberError}
                      controllerLabel={DEA_NUMBER}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>
                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="billingEmail"
                    error={billingEmailError}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="billingPhone"
                      error={billingPhoneError}
                      controllerLabel={PHONE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="billingFax"
                      error={billingFaxError}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="billingZipCode"
                    error={billingZipCodeError}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="billingAddress"
                    error={billingAddressError}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="billingAddress2"
                    error={billingAddress2Error}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <DoctorController
                      fieldType="text"
                      controllerName="billingCity"
                      error={billingCityError}
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <DoctorController
                      fieldType="text"
                      controllerName="billingState"
                      error={billingStateError}
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <DoctorController
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
                          label="Sunday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.sunday} onChange={handleChange} name="sunday" color='primary' />}
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>

                        <FormControlLabel
                          label="Monday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.monday} onChange={handleChange} name="monday" color='primary' />}
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>

                        <FormControlLabel
                          label="Wednesday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.wednesday} onChange={handleChange} name="wednesday" color='primary' />}
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>

                        <FormControlLabel
                          label="Thursday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.thursday} onChange={handleChange} name="thursday" color='primary' />}
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>

                        <FormControlLabel
                          label="Friday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.friday} onChange={handleChange} name="friday" color='primary' />}
                        />
                        <FormHelperText className={classes.helperText}>{AVAILABILITY_STATUS}</FormHelperText>

                        <FormControlLabel
                          label="Saturday"
                          labelPlacement="start"
                          className={classes.controlLabel}
                          control={<Switch checked={values.saturday} onChange={handleChange} name="saturday" color='primary' />}
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
                  <DoctorController
                    fieldType="text"
                    controllerName="email"
                    error={emailError}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="phone"
                      error={phoneError}
                      controllerLabel={PHONE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="mobile"
                      error={mobileError}
                      controllerLabel={MOBILE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="pager"
                      error={pagerError}
                      controllerLabel={PAGER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="fax"
                      error={faxError}
                      controllerLabel={FAX}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="zipCode"
                    error={zipCodeError}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="address"
                    error={addressError}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
                    fieldType="text"
                    controllerName="address2"
                    error={address2Error}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <DoctorController
                      fieldType="text"
                      controllerName="city"
                      error={cityError}
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <DoctorController
                      fieldType="text"
                      controllerName="state"
                      error={stateError}
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <DoctorController
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
                    <DoctorController
                      fieldType="text"
                      controllerName="taxId"
                      error={taxIdError}
                      controllerLabel={TAX_ID}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="npi"
                      error={npiError}
                      controllerLabel={NPI}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="upin"
                      error={upinError}
                      controllerLabel={UPIN}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="emcProviderId"
                      error={emcProviderIdError}
                      controllerLabel={EMC_PROVIDER_ID}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="medicareGrpNumber"
                      error={medicareGrpNumberError}
                      controllerLabel={MEDICARE_GRP_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="medicaidGrpNumber"
                      error={medicaidGrpNumberError}
                      controllerLabel={MEDICAID_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="meammographyCertNumber"
                      error={meammographyCertNumberError}
                      controllerLabel={MAMMOGRAPHY_CERT_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="campusGrpNumber"
                      error={campusGrpNumberError}
                      controllerLabel={CAMPUS_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="blueShildNumber"
                      error={blueShieldNumberError}
                      controllerLabel={BLUE_SHIED_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="taxIdStuff"
                      error={taxIdStuffError}
                      controllerLabel={TAX_ID_STUFF}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="specialityLicense"
                      error={specialtyLicenseError}
                      controllerLabel={SPECIALTY_LICENSE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="anesthesiaLicense"
                      error={anesthesiaLicenseError}
                      controllerLabel={ANESTHESIA_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="dpsCtpNumber"
                      error={dpsCtpNumberError}
                      controllerLabel={CTP_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="text"
                      controllerName="stateLicense"
                      error={stateLicenseError}
                      controllerLabel={STATE_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="date"
                      controllerName="licenseActiveDate"
                      error={licenseActiveDateError}
                      controllerLabel={LICENSE_ACTIVE_DATE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
                      fieldType="date"
                      controllerName="licenseTermDate"
                      error={licenseTermDateError}
                      controllerLabel={LICENSE_TERM_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <DoctorController
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
            {UPDATE_DOCTOR}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider>
  );
};

export default UpdateDoctorForm;

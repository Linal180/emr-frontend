// packages block
import { FC, useState, useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import DoctorController from "../controllers";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { doctorSchema } from '../../../../validationSchemas';
import { AuthContext, ListContext } from '../../../../context';
import { DoctorInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import { dateValidationMessage, getDate, getTimestamps, renderFacilities, requiredMessage, setRecord } from "../../../../utils";
import {
  DoctorPayload, Speciality, SsnType, useCreateDoctorMutation, useGetDoctorLazyQuery, UserRole,
  useUpdateDoctorMutation
} from "../../../../generated/graphql";
import {
  MAPPED_SSN_TYPES, FACILITY, FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY,
  CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION, MIDDLE_NAME, UPDATE_DOCTOR,
  PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER,
  DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2,
  MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  MAMMOGRAPHY_CERT_NUMBER, CHAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE,
  PRESCRIPTIVE_AUTH_NUMBER, DOCTORS_ROUTE, MAPPED_SPECIALTIES, FORBIDDEN_EXCEPTION, CREATE_DOCTOR,
  LANGUAGE_SPOKEN, SPECIALITY, DOCTOR_UPDATED, ADDITIONAL_INFO, BILLING_ADDRESS, TYPE, DOCTOR_NOT_FOUND,
  FAILED_TO_UPDATED_DOCTOR, FAILED_TO_CREATE_DOCTOR, DOCTOR_CREATED, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  TAXONOMY_CODE,
  EMPTY_OPTION,
  DOCTOR_DOB_VALIDATION_MESSAGE,
} from "../../../../constants";

const DoctorForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const [doctor, setDoctor] = useState<DoctorPayload['doctor']>()
  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;

  const [getDoctor, { loading: GetDoctorLoading }] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

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

          const { id: facilityId, name } = facility || {}

          dob && setValue('dob', dob)
          npi && setValue('npi', npi)
          ssn && setValue('ssn', ssn)
          upin && setValue('upin', upin)
          taxId && setValue('taxId', taxId)
          prefix && setValue('prefix', prefix)
          suffix && setValue('suffix', suffix)
          lastName && setValue('lastName', lastName)
          deaNumber && setValue('deaNumber', deaNumber)
          firstName && setValue('firstName', firstName)
          middleName && setValue('middleName', middleName)
          taxIdStuff && setValue('taxIdStuff', taxIdStuff)
          taxonomyCode && setValue('taxonomyCode', taxonomyCode)
          dpsCtpNumber && setValue('dpsCtpNumber', dpsCtpNumber)
          stateLicense && setValue('stateLicense', stateLicense)
          emcProviderId && setValue('emcProviderId', emcProviderId)
          ssnType && setValue('ssnType', setRecord(ssnType, ssnType))
          deaTermDate && setValue('deaTermDate', getDate(deaTermDate))
          blueShildNumber && setValue('blueShildNumber', blueShildNumber)
          campusGrpNumber && setValue('campusGrpNumber', campusGrpNumber)
          providerIntials && setValue('providerIntials', providerIntials)
          languagesSpoken && setValue('languagesSpoken', languagesSpoken)
          deaActiveDate && setValue('deaActiveDate', getDate(deaActiveDate))
          specialityLicense && setValue('specialityLicense', specialityLicense)
          anesthesiaLicense && setValue('anesthesiaLicense', anesthesiaLicense)
          medicareGrpNumber && setValue('medicareGrpNumber', medicareGrpNumber)
          medicaidGrpNumber && setValue('medicaidGrpNumber', medicaidGrpNumber)
          degreeCredentials && setValue('degreeCredentials', degreeCredentials)
          speciality && setValue('speciality', setRecord(speciality, speciality))
          licenseTermDate && setValue('licenseTermDate', getDate(licenseTermDate))
          facilityId && setValue('facilityId', setRecord(facilityId || '', name || ''))
          licenseActiveDate && setValue('licenseActiveDate', getDate(licenseActiveDate))
          meammographyCertNumber && setValue('meammographyCertNumber', meammographyCertNumber)
          prescriptiveAuthNumber && setValue('prescriptiveAuthNumber', prescriptiveAuthNumber)

          setDoctor(doctor)

          if (contacts) {
            const { email, phone, zipCode, mobile, fax, address, address2, city, state, country, pager } = contacts[0]

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
            pager && setValue('pager', pager)
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

  const [createDoctor, { loading: createDoctorLoading }] = useCreateDoctorMutation({
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

  const [updateDoctor, { loading: updateDoctorLoading }] = useUpdateDoctorMutation({
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
    if (isEdit) {
      if (id) {
        getDoctor({
          variables: {
            getDoctor: { id }
          }
        })
      } else Alert.error(DOCTOR_NOT_FOUND)
    }
  }, [getDoctor, id, isEdit])

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const {
      email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country,
      billingEmail, billingPhone, billingFax, billingAddress: billingAddress1,
      billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId,
      dob, ssn, prefix, suffix, ssnType, lastName,
      firstName, speciality, middleName, providerIntials, degreeCredentials, languagesSpoken,
      taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi, upin, emcProviderId,
      medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber,
      blueShildNumber, taxIdStuff, facilityId, specialityLicense, password, anesthesiaLicense,
      dpsCtpNumber, stateLicense, licenseActiveDate, licenseTermDate, prescriptiveAuthNumber
    } = inputs;

    const { id: userId } = user || {}
    const { id: selectedSsnType } = ssnType;
    const { id: selectedSpecialty } = speciality;
    const { id: selectedFacility } = facilityId;

    if (isEdit) {
      const { contacts, billingAddress } = doctor || {}

      if (id && contacts && billingAddress) {
        const { id: contactId } = contacts[0]
        const { id: billingId } = billingAddress[0]

        await updateDoctor({
          variables: {
            updateDoctorInput: {
              updateDoctorItemInput: {
                id, firstName: firstName || "", middleName: middleName || "", lastName: lastName || "",
                prefix: prefix || "", suffix: suffix || "", email: email || "", password: password || "",
                facilityId: selectedFacility || "", providerIntials: providerIntials || "",
                degreeCredentials: degreeCredentials || "", roleType: UserRole.Doctor,
                adminId: userId || "", ssnType: selectedSsnType as SsnType || SsnType.Medicare,
                speciality: selectedSpecialty as Speciality || Speciality.Gastroenterology,
                dob: getTimestamps(dob || ''), ssn: ssn || "", languagesSpoken: languagesSpoken || "",
                taxonomyCode: taxonomyCode || "", deaNumber: deaNumber || "",
                deaActiveDate: getTimestamps(deaActiveDate || ""), deaTermDate: getTimestamps(deaTermDate || ""),
                taxId: taxId || "", npi: npi || "", upin: upin || "", emcProviderId: emcProviderId || "",
                medicareGrpNumber: medicareGrpNumber || "", medicaidGrpNumber: medicaidGrpNumber || "",
                meammographyCertNumber: meammographyCertNumber || "", campusGrpNumber: campusGrpNumber || "",
                blueShildNumber: blueShildNumber || "", taxIdStuff: taxIdStuff || "",
                specialityLicense: specialityLicense || "", anesthesiaLicense: anesthesiaLicense || "",
                stateLicense: stateLicense || "", licenseActiveDate: getTimestamps(licenseActiveDate || ""),
                licenseTermDate: getTimestamps(licenseTermDate || ""), dpsCtpNumber: dpsCtpNumber || "",
                prescriptiveAuthNumber: prescriptiveAuthNumber || "",
              },

              updateContactInput: {
                id: contactId, email: email || "", pager: pager || "", phone: phone || "",
                mobile: mobile || "", fax: fax || "", address: address || "", address2: address2 || "",
                zipCode: zipCode || "", city: city || "", state: state || "", country: country || "",
                facilityId: selectedFacility || ""
              },

              updateBillingAddressInput: {
                id: billingId, email: billingEmail || "", phone: billingPhone || "",
                fax: billingFax || "", address: billingAddress1 || "", address2: billingAddress2 || "",
                zipCode: billingZipCode || "", city: billingCity || "", state: billingState || "",
                country: billingCountry || "", userId: billingUserId || "", facilityId: selectedFacility || ""
              }
            }
          }
        })
      } else Alert.error(FAILED_TO_UPDATED_DOCTOR)
    } else {
      if (user) {
        const { id: userId } = user

        await createDoctor({
          variables: {
            createDoctorInput: {
              createDoctorItemInput: {
                firstName: firstName || "", middleName: middleName || "", lastName: lastName || "",
                prefix: prefix || "", suffix: suffix || "", email: email || "", password: password || "",
                facilityId: selectedFacility || "", providerIntials: providerIntials || "",
                degreeCredentials: degreeCredentials || "", roleType: UserRole.Doctor, adminId: userId || "",
                ssnType: selectedSsnType as SsnType || SsnType.Medicare, ssn: ssn || "",
                speciality: selectedSpecialty as Speciality || Speciality.Gastroenterology,
                dob: getTimestamps(dob || ''), languagesSpoken: languagesSpoken || "",
                taxonomyCode: taxonomyCode || "", deaNumber: deaNumber || "", taxIdStuff: taxIdStuff || "",
                deaActiveDate: getTimestamps(deaActiveDate || ""), deaTermDate: getTimestamps(deaTermDate || ""),
                taxId: taxId || "", npi: npi || "", upin: upin || "", emcProviderId: emcProviderId || "",
                medicareGrpNumber: medicareGrpNumber || "", medicaidGrpNumber: medicaidGrpNumber || "",
                meammographyCertNumber: meammographyCertNumber || "", campusGrpNumber: campusGrpNumber || "",
                specialityLicense: specialityLicense || "", anesthesiaLicense: anesthesiaLicense || "",
                stateLicense: stateLicense || "", licenseActiveDate: getTimestamps(licenseActiveDate || ""),
                prescriptiveAuthNumber: prescriptiveAuthNumber || "", dpsCtpNumber: dpsCtpNumber || "",
                licenseTermDate: getTimestamps(licenseTermDate || ""), blueShildNumber: blueShildNumber || "",
              },

              createContactInput: {
                email: email || "", pager: pager || "", phone: phone || "", mobile: mobile || "",
                fax: fax || "", address: address || "", address2: address2 || "", zipCode: zipCode || "",
                city: city || "", state: state || "", country: country || "", facilityId: selectedFacility || ""
              },

              createBillingAddressInput: {
                email: billingEmail || "", phone: billingPhone || "", fax: billingFax || "",
                address: billingAddress1 || "", address2: billingAddress2 || "", zipCode: billingZipCode || "",
                city: billingCity || "", state: billingState || "", country: billingCountry || "",
                userId: billingUserId || "", facilityId: selectedFacility || ""
              }
            }
          }
        })
      } else {
        Alert.error(FAILED_TO_CREATE_DOCTOR)
      }
    }
  };

  const {
    dob: { message: dobError } = {},
    ssn: { message: ssnError } = {},
    npi: { message: npiError } = {},
    upin: { message: upinError } = {},
    ssnType: { id: ssnTypeError } = {},
    taxId: { message: taxIdError } = {},
    prefix: { message: prefixError } = {},
    suffix: { message: suffixError } = {},
    facilityId: { id: facilityError } = {},
    speciality: { id: specialtyError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
    deaNumber: { message: deaNumberError } = {},
    taxIdStuff: { message: taxIdStuffError } = {},
    middleName: { message: middleNameError } = {},
    deaTermDate: { message: deaTermDateError } = {},
    dpsCtpNumber: { message: dpsCtpNumberError } = {},
    stateLicense: { message: stateLicenseError } = {},
    taxonomyCode: { message: taxonomyCodeError } = {},
    emcProviderId: { message: emcProviderIdError } = {},
    deaActiveDate: { message: deaActiveDateError } = {},
    licenseTermDate: { message: licenseTermDateError } = {},
    languagesSpoken: { message: languagesSpokenError } = {},
    campusGrpNumber: { message: campusGrpNumberError } = {},
    blueShildNumber: { message: blueShieldNumberError } = {},
    providerIntials: { message: providerInitialsError } = {},
    specialityLicense: { message: specialtyLicenseError } = {},
    medicareGrpNumber: { message: medicareGrpNumberError } = {},
    degreeCredentials: { message: degreeCredentialsError } = {},
    medicaidGrpNumber: { message: medicaidGrpNumberError } = {},
    anesthesiaLicense: { message: anesthesiaLicenseError } = {},
    licenseActiveDate: { message: licenseActiveDateError } = {},
    prescriptiveAuthNumber: { message: prescriptiveAuthNumberError } = {},
    meammographyCertNumber: { message: meammographyCertNumberError } = {},

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
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={FACILITY}
                          name="facilityId"
                          options={renderFacilities(facilityList)}
                          error={facilityError?.message && requiredMessage(FACILITY)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={SPECIALITY}
                          name="speciality"
                          options={MAPPED_SPECIALTIES}
                          error={specialtyError?.message && requiredMessage(SPECIALITY)}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={TYPE}
                          name="ssnType"
                          options={MAPPED_SSN_TYPES}
                          error={ssnTypeError?.message && requiredMessage(TYPE)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DoctorController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          error={firstNameError}
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DoctorController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          error={lastNameError}
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <DatePicker isRequired name="dob" label={DOB}
                          error={(dobError && DOCTOR_DOB_VALIDATION_MESSAGE) || ''}
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
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={ADDITIONAL_INFO}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
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
                        <DoctorController
                          fieldType="text"
                          controllerName="deaNumber"
                          error={deaNumberError}
                          controllerLabel={DEA_NUMBER}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deaActiveDate" label={DEA_ACTIVE_DATE}
                          error={deaActiveDateError || ''}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deaTermDate" label={DEA_TERM_DATE}
                          error={(deaTermDateError && dateValidationMessage(DEA_TERM_DATE, DEA_ACTIVE_DATE)) || ''}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DoctorController
                          fieldType="text"
                          controllerName="taxonomyCode"
                          error={taxonomyCodeError}
                          controllerLabel={TAXONOMY_CODE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DoctorController
                          fieldType="text"
                          controllerName="languagesSpoken"
                          error={languagesSpokenError}
                          controllerLabel={LANGUAGE_SPOKEN}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
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
                        <PhoneField name="billingPhone" error={billingPhoneError} label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="billingFax" error={billingFaxError} label={FAX} />
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
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={CONTACT_INFORMATION}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <DoctorController
                        isRequired
                        fieldType="text"
                        controllerName="email"
                        error={emailError}
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="phone" error={phoneError} label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="mobile" error={mobileError} label={MOBILE} />
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
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={TAX_ID_DETAILS}>
                {GetDoctorLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
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
                          controllerLabel={CHAMPUS_GRP_NUMBER}
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
                        <DatePicker name="licenseActiveDate" label={LICENSE_ACTIVE_DATE}
                          error={licenseActiveDateError || ''}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="licenseTermDate" label={LICENSE_TERM_DATE}
                          error={(licenseTermDateError && dateValidationMessage(LICENSE_TERM_DATE, LICENSE_ACTIVE_DATE)) || ''}
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
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={createDoctorLoading || updateDoctorLoading}
          >
            {isEdit ? UPDATE_DOCTOR : CREATE_DOCTOR}

            {(createDoctorLoading || updateDoctorLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default DoctorForm;

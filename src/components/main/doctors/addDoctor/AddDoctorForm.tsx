// packages block
import { FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import DoctorController from "../controllers";
import Selector from '../../../common/Selector';
import DatePicker from "../../../common/DatePicker";
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { getTimestamps, renderFacilities } from '../../../../utils';
import { doctorSchema } from '../../../../validationSchemas';
import { ListContext } from '../../../../context/listContext';
import { DoctorInputProps } from "../../../../interfacesTypes";
import { Speciality, SsnType, useCreateDoctorMutation, UserRole } from "../../../../generated/graphql";
import {
  FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, MAPPED_SSN_TYPES, FACILITY,
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CREATE_DOCTOR, ADDITIONAL_INFO, BILLING_ADDRESS,
  CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION, MIDDLE_NAME,
  PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER, TAXONOMY_CODE,
  DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS, ADDRESS_2,
  MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  MAMMOGRAPHY_CERT_NUMBER, CAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE,
  PRESCRIPTIVE_AUTH_NUMBER, DOCTOR_CREATED, DOCTORS_ROUTE, MAPPED_SPECIALTIES,
  LANGUAGE_SPOKEN, SPECIALTY, TYPE,
} from "../../../../constants";

const AddDoctorForm: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });
  const { reset, handleSubmit, formState: { errors } } = methods;

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

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const { email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country,
      billingEmail, billingPhone, billingFax, billingAddress, billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId,
      dob, ssn, prefix, suffix, ssnType, lastName, firstName, speciality, middleName, providerIntials,
      degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi, upin,
      emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber, blueShildNumber,
      taxIdStuff, facilityId, specialityLicense, anesthesiaLicense, dpsCtpNumber, stateLicense,
      licenseActiveDate, licenseTermDate, prescriptiveAuthNumber, password
    } = inputs;

    const { id: selectedSsnType } = ssnType;
    const { id: selectedSpecialty } = speciality;
    const { id: selectedFacility } = facilityId;

    if (user) {
      const { id: userId } = user

      await createDoctor({
        variables: {
          createDoctorInput: {
            createDoctorItemInput: {
              firstName: firstName || "", middleName: middleName || "", lastName: lastName || "", prefix: prefix || "",
              suffix: suffix || "", email: email || "", password: password || "", facilityId: selectedFacility || "",
              providerIntials: providerIntials || "", degreeCredentials: degreeCredentials || "",
              speciality: selectedSpecialty as Speciality || Speciality.Gastroenterology, dob: getTimestamps(dob || ''), ssn: ssn || "",
              ssnType: selectedSsnType as SsnType || SsnType.Medicare, roleType: UserRole.Doctor, adminId: userId || "",
              languagesSpoken: languagesSpoken || "", taxonomyCode: taxonomyCode || "", deaNumber: deaNumber || "",
              deaActiveDate: getTimestamps(deaActiveDate || ""), deaTermDate: getTimestamps(deaTermDate || ""),
              taxId: taxId || "", npi: npi || "", upin: upin || "", emcProviderId: emcProviderId || "",
              medicareGrpNumber: medicareGrpNumber || "", medicaidGrpNumber: medicaidGrpNumber || "",
              meammographyCertNumber: meammographyCertNumber || "", campusGrpNumber: campusGrpNumber || "",
              blueShildNumber: blueShildNumber || "", taxIdStuff: taxIdStuff || "",
              specialityLicense: specialityLicense || "", anesthesiaLicense: anesthesiaLicense || "",
              stateLicense: stateLicense || "", licenseActiveDate: getTimestamps(licenseActiveDate || ""),
              licenseTermDate: getTimestamps(licenseTermDate || ""), prescriptiveAuthNumber: prescriptiveAuthNumber || "",
              dpsCtpNumber: dpsCtpNumber || "",
            },

            createContactInput: {
              email: email || "", pager: pager || "", phone: phone || "", mobile: mobile || "",
              fax: fax || "", address: address || "", address2: address2 || "", zipCode: zipCode || "", city: city || "",
              state: state || "", country: country || "", facilityId: selectedFacility || ""
            },

            createBillingAddressInput: {
              email: billingEmail || "", phone: billingPhone || "", fax: billingFax || "",
              address: billingAddress || "", address2: billingAddress2 || "", zipCode: billingZipCode || "",
              city: billingCity || "", state: billingState || "", country: billingCountry || "",
              userId: billingUserId || "", facilityId: selectedFacility || ""
            }
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
    ssnType: { id: ssnTypeError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
    speciality: { id: specialtyError } = {},
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
    facilityId: { id: facilityError } = {},

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
                  <Grid item md={6} sm={12} xs={12}>
                    <Selector
                      value={{ id: "", name: "" }}
                      label={FACILITY}
                      name="facilityId"
                      error={facilityError?.message || ""}
                      options={renderFacilities(facilityList)}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <Selector
                      value={{ id: "", name: "" }}
                      label={SPECIALTY}
                      name="speciality"
                      error={specialtyError?.message || ""}
                      options={MAPPED_SPECIALTIES}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Selector
                      value={{ id: "", name: "" }}
                      label={TYPE}
                      name="ssnType"
                      error={ssnTypeError?.message || ""}
                      options={MAPPED_SSN_TYPES}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DoctorController
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
                      fieldType="text"
                      controllerName="lastName"
                      error={lastNameError}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <DatePicker name="dob" label={DOB} error={dobError || ''} />
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
                    <DatePicker name="deaActiveDate"

                      label={DEA_ACTIVE_DATE} error={deaActiveDateError || ''} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="deaTermDate" label={DEA_TERM_DATE} error={deaTermDateError || ''} />
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
              </CardComponent>
            </Grid>

            <Grid md={6} item>
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
                    <DatePicker name="licenseActiveDate" label={LICENSE_ACTIVE_DATE} error={licenseActiveDateError || ''} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="licenseTermDate" label={LICENSE_TERM_DATE} error={licenseTermDateError || ''} />
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
            {CREATE_DOCTOR}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider>
  );
};

export default AddDoctorForm;

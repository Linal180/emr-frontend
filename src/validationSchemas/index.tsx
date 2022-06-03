// packages block
import * as yup from "yup";
import moment from "moment";
// utils and constants block
import { dateValidation, invalidMessage, requiredMessage, timeValidation, tooLong, tooShort } from "../utils";
import {
  ADDRESS, ALPHABETS_REGEX, CITY, CONFIRM_YOUR_PASSWORD, COUNTRY, EMAIL, MaxLength, MinLength,
  FACILITY, FIRST_NAME, GENDER, INVALID_EMAIL, LAST_NAME, PASSWORDS_MUST_MATCH, PASSWORD_LABEL,
  MOBILE_NUMBER, NAME, NUMBER_REGEX, PASSWORD, DOB_VALIDATION_MESSAGE, FAX, PREFERRED_LANGUAGE,
  PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE_NUMBER, PRACTICE_TYPE, TAXONOMY_CODE_REGEX,
  DURATION, PRICE, ROLE, SERVICE_CODE, STATE, ValidMessage, ZIP_CODE, USUAL_PROVIDER_ID, PATIENT,
  NPI_REGEX, NPI_VALIDATION_MESSAGE, CLIA_REGEX, CLIA_VALIDATION_MESSAGE, RELATIONSHIP, DAY,
  TIME_ZONE_TEXT, PREFERRED_NAME, PROVIDER, SSN_REGEX, SSN_VALIDATION_MESSAGE, ADDRESS_REGEX,
  TAXONOMY_VALIDATION_MESSAGE, TID_VALIDATION_MESSAGE, EIN_REGEX, PREVIOUS_FIRST_NAME, SEX_AT_BIRTH,
  TID_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX, PHONE, MOBILE, ZIP_REGEX,
  MOTHERS_MAIDEN_NAME, PREVIOUS_LAST_NAME, LANGUAGE_SPOKEN, SUFFIX, INDUSTRY, USUAL_OCCUPATION,
  PRIMARY_INSURANCE, SECONDARY_INSURANCE, ISSUE_DATE, REGISTRATION_DATE, START_TIME, END_TIME,
  APPOINTMENT, DECEASED_DATE, EXPIRATION_DATE, PREFERRED_PHARMACY, ZIP_VALIDATION_MESSAGE, UPIN_REGEX,
  UPIN_VALIDATION_MESSAGE, PRACTICE_NAME, PRACTICE, OLD_PASSWORD, ROLE_NAME, STRING_REGEX, MIDDLE_NAME,
  SERVICE_NAME_TEXT, DOB, OTP_CODE, FORM_NAME, ValidOTP, ALLERGY_DATE_VALIDATION_MESSAGE, PAIN_TEXT,
  REACTIONS_VALIDATION_MESSAGE, EIN_VALIDATION_MESSAGE, PULSE_TEXT, RESPIRATORY_RATE_TEXT, WEIGHT_TEXT,
  PAGER, BLOOD_PRESSURE_TEXT, FEVER_TEXT, HEAD_CIRCUMFERENCE, HEIGHT_TEXT, OXYGEN_SATURATION_TEXT, FACILITY_NAME,
  DIAGNOSES_VALIDATION_MESSAGE, TEST_FIELD_VALIDATION_MESSAGE, SPECIMEN_FIELD_VALIDATION_MESSAGE, ACCOUNT_TYPE,
  US_BANK_ACCOUNT_REGEX, BANK_ACCOUNT_VALIDATION_MESSAGE, US_ROUTING_NUMBER_REGEX, ROUTING_NO_VALIDATION_MESSAGE,
  ROUTING_NUMBER, BANK_ACCOUNT, COMPANY_NAME, STREET_ADDRESS, AUTHORITY, SNO_MED_CODE, SEVERITY, SPECIALTY,
  NO_WHITE_SPACE_REGEX, NO_WHITE_SPACE_ALLOWED, MEMBER_ID_CERTIFICATE_NUMBER, INSURANCE_PAYER_NAME, ORDER_OF_BENEFIT,
  PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, COPAY_TYPE, COINSURANCE_PERCENTAGE, REFERRING_PROVIDER,
  OTHER_RELATION, PRIMARY_CARE_PROVIDER, PRICING_PRODUCT_TYPE, NOTES, POLICY_HOLDER_ID_CERTIFICATION_NUMBER, EMPLOYER, ADDRESS_CTD, SSN,
  LEGAL_SEX, AMOUNT,
} from "../constants";

const notRequiredMatches = (message: string, regex: RegExp) => {
  return yup.string()
    .test('', message, value => !value ? !value : regex.test(value))
}

const requiredMatches = (label: string, message: string, regex: RegExp) => {
  return yup.string()
    .test('', requiredMessage(label), value => !!value)
    .test('', message, value => regex.test(value || ''))
}

const notRequiredStringOnly = (label: string) => {
  return yup.string()
    .test('', invalidMessage(label), value => !value ? !value : STRING_REGEX.test(value))
}

const addressValidation = (label: string, isRequired: boolean) => {
  return yup.string()
    .test('', requiredMessage(label), value => isRequired ? !!value : true)
    .test(
      '', invalidMessage(label), value => !value ? !value : ADDRESS_REGEX.test(value)
    )
}

const requiredStringOnly = (label: string, min: number, max: number) => {
  return yup.string()
    .test('', requiredMessage(label), value => !!value)
    .test('', invalidMessage(label), value => value ? STRING_REGEX.test(value) : false)
    .test('', MinLength(label, min), value => value ? value.length >= min : false)
    .test('', MaxLength(label, max), value => value ? value.length <= max : false)
}

const nameSchema = (label: string) => {
  return yup.string().matches(ALPHABETS_REGEX, ValidMessage(label))
    .min(2, MinLength(label, 2)).max(26, MaxLength(label, 26))
    .required(requiredMessage(label))
}

const notRequiredPhone = (label: string) => {
  return yup.string()
    .test('', MinLength(label, 10), value => !value ? !value : !!value && value.length >= 10)
}

const requiredPhone = (label: string) => {
  return yup.string().min(10, MinLength(label, 10))
    .max(15, MaxLength(label, 15)).required(requiredMessage(label))
}

const notRequiredOTP = (label: string, isRequired: boolean) => {
  return yup.string()
    .test('', requiredMessage(label), value => isRequired ? !!value : true)
    .matches(NUMBER_REGEX, ValidOTP())
    .min(6, MinLength(label, 6)).max(6, MaxLength(label, 6))
    .required(requiredMessage(label))
}

const optionalEmailSchema = (isOptional: boolean) => {
  return yup.string().email(INVALID_EMAIL)
    .test('', requiredMessage(EMAIL), value => isOptional ? true : !!value)
}

const otherRelationSchema = (isOtherRelation: boolean) => {
  return yup.string()
    .test('', requiredMessage(OTHER_RELATION), value => isOtherRelation ? !!value : true)
}

const einSchema = { ein: notRequiredMatches(EIN_VALIDATION_MESSAGE, EIN_REGEX) }
const upinSchema = { upin: notRequiredMatches(UPIN_VALIDATION_MESSAGE, UPIN_REGEX) }
const npiSchema = { npi: notRequiredMatches(NPI_VALIDATION_MESSAGE, NPI_REGEX) }
const ssnSchema = { ssn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX) }
const passwordSchema = { password: yup.string().required(requiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)) }
const federalTaxIdSchema = { federalTaxId: notRequiredMatches(TID_VALIDATION_MESSAGE, TID_REGEX) }
const cliaIdNumberSchema = { cliaIdNumber: notRequiredMatches(CLIA_VALIDATION_MESSAGE, CLIA_REGEX) }
const taxonomyCodeSchema = { taxonomyCode: notRequiredMatches(TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX) }
const tamxonomyCodeSchema = { tamxonomyCode: notRequiredMatches(TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX) }
const mammographySchema = {
  mammographyCertificationNumber: notRequiredMatches(MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX)
}

const dobSchema = {
  dob: yup.string().test('', DOB_VALIDATION_MESSAGE,
    value => new Date(value || '') <= new Date() && moment().diff(moment(value), 'years') < 100)
}

// const doctorDobSchema = (label: string) => {
//   return yup.string()
//     .test('', minDobValidMessage(label),
//       value => moment().diff(moment(value), 'years') >= 20)
//     .test('', maxDobValidMessage(label),
//       value => moment().diff(moment(value), 'years') < 100)
// }

const selectorSchema = (label: string) => yup.object().shape({
  name: yup.string().required(),
  id: yup.string().required()
}).test('', requiredMessage(label), ({ id, name }) => !!id && !!name);

const stateSchema = (isRequired: boolean) => {
  return yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }).test('', requiredMessage(STATE), value => isRequired ? !!value : true)
}

const countrySchema = (isRequired: boolean) => {
  return yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }).test('', requiredMessage(COUNTRY), value => isRequired ? !!value : true)
}

const passwordAndRepeatPasswordSchema = {
  password: yup.string().required(requiredMessage(PASSWORD))
    .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),

  repeatPassword: yup.string().oneOf([yup.ref("password"), null], PASSWORDS_MUST_MATCH)
    .required(CONFIRM_YOUR_PASSWORD),
}

const deaDateSchema = {
  deaActiveDate: yup.string().test(value => !value
    ? !value : new Date(value || '') <= new Date()),

  deaTermDate: yup.string().test((value, { parent: { deaActiveDate } }) => !value
    ? !value : dateValidation(value, deaActiveDate))
}

const licenseDateSchema = {
  licenseActiveDate: yup.string().test(value => !value
    ? !value : new Date(value || '') <= new Date()),

  licenseTermDate: yup.string().test((value, { parent: { licenseActiveDate } }) => !value
    ? !value : dateValidation(value, licenseActiveDate))
}

const scheduleTimeSchema = {
  startAt: yup.string().test('', invalidMessage(START_TIME), value => !!value),
  endAt: yup.string().test('', invalidMessage(END_TIME), (value, { parent: { startAt } }) =>
    !value ? !!value : timeValidation(value, startAt))
}

const facilityTimeSchema = {
  startTime: yup.string().test('', invalidMessage(START_TIME), value => !!value),

  endTime: yup.string().test('', invalidMessage(END_TIME), (value, { parent: { startTime } }) =>
    !value ? !!value : timeValidation(value, startTime))
}

const patientRegisterDateSchema = {
  registrationDate: yup.string().test('', invalidMessage(REGISTRATION_DATE), value =>
    !value ? !value : new Date(value || '') <= new Date()),

  deceasedDate: yup.string().test('', invalidMessage(DECEASED_DATE), (value, { parent: { registrationDate } }) =>
    !value ? !value : dateValidation(value, registrationDate))
}

const patientStatementDateSchema = {
  statementNoteDateFrom: yup.string().test('', invalidMessage(ISSUE_DATE), value =>
    !value ? !value : new Date(value || '') <= new Date()),

  statementNoteDateTo: yup.string().test('', invalidMessage(EXPIRATION_DATE), (value, ctx) =>
    !value ? !value : new Date(value || '') >= new Date(ctx.parent.statementNoteDateFrom))
}

const firstLastNameSchema = {
  lastName: nameSchema(LAST_NAME),
  firstName: nameSchema(FIRST_NAME),
};

export const loginValidationSchema = yup.object({
  ...emailSchema,
  ...passwordSchema
});

export const twoFAValidationSchema = yup.object({
  ...passwordSchema
});

export const resetPasswordValidationSchema = yup.object({
  ...passwordAndRepeatPasswordSchema
});

export const forgetPasswordValidationSchema = yup.object({
  ...emailSchema,
});

export const contactSchema = {
  ...emailSchema,
  state: stateSchema(false),
  fax: notRequiredPhone(FAX),
  phone: requiredPhone(MOBILE),
  country: countrySchema(false),
  pager: notRequiredPhone(PAGER),
  mobile: notRequiredPhone(PHONE),
  city: notRequiredStringOnly(CITY),
  address: addressValidation(ADDRESS, false),
  address2: addressValidation(ADDRESS, false),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
};

export const basicContactSchema = {
  basicState: stateSchema(true),
  basicCountry: countrySchema(true),
  basicPhone: requiredPhone(MOBILE_NUMBER),
  basicCity: requiredStringOnly(CITY, 2, 20),
  basicMobile: notRequiredPhone(PHONE_NUMBER),
  basicAddress: addressValidation(ADDRESS, true),
  basicAddress2: addressValidation(ADDRESS, false),
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  basicZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
};

export const basicContactViaAppointmentSchema = {
  basicPhone: requiredPhone(PHONE_NUMBER),
  basicMobile: notRequiredPhone(MOBILE_NUMBER),
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
};

export const billingAddressSchema = {
  billingState: stateSchema(false),
  billingFax: notRequiredPhone(FAX),
  billingCountry: countrySchema(false),
  billingPhone: notRequiredPhone(PHONE),
  billingCity: notRequiredStringOnly(CITY),
  billingEmail: yup.string().email(INVALID_EMAIL),
  billingAddress: addressValidation(ADDRESS, false),
  billingAddress2: addressValidation(ADDRESS, false),
  billingZipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

export const extendedContactSchema = yup.object({
  ...contactSchema,
  facilityId: selectorSchema(FACILITY),
  serviceCode: selectorSchema(SERVICE_CODE),
})

const staffBasicSchema = {
  ...firstLastNameSchema,
  gender: selectorSchema(GENDER),
  mobile: notRequiredPhone(PHONE),
  phone: notRequiredPhone(MOBILE),
  facilityId: selectorSchema(FACILITY),
  dob: yup.string().required(requiredMessage(DOB)),
}

export const createStaffSchema = yup.object({
  ...emailSchema,
  ...staffBasicSchema,
  roleType: selectorSchema(ROLE)
})

export const updateStaffSchema = yup.object({
  ...emailSchema,
  ...staffBasicSchema,
})

const facilityBasicSchema = {
  ...npiSchema,
  ...contactSchema,
  ...mammographySchema,
  ...cliaIdNumberSchema,
  ...federalTaxIdSchema,
  ...tamxonomyCodeSchema,
  ...billingAddressSchema,
  timeZone: selectorSchema(TIME_ZONE_TEXT),
  serviceCode: selectorSchema(SERVICE_CODE),
  practiceType: selectorSchema(PRACTICE_TYPE),
  name: yup.string().required(requiredMessage(PRACTICE_NAME))
}

const facilitySchedulerBasicSchema = {
  ...npiSchema,
  ...contactSchema,
  ...mammographySchema,
  ...cliaIdNumberSchema,
  ...facilityTimeSchema,
  ...federalTaxIdSchema,
  ...tamxonomyCodeSchema,
  ...billingAddressSchema,
  serviceCode: selectorSchema(SERVICE_CODE),
  timeZone: selectorSchema(TIME_ZONE_TEXT),
  name: yup.string().required(requiredMessage(NAME))
}

export const facilitySchedulerSchema = yup.object({
  ...facilitySchedulerBasicSchema
})

export const facilityTimeSchedulerSchema = yup.object({
  ...scheduleTimeSchema
})

export const facilitySchema = yup.object({
  ...facilityBasicSchema
})

export const facilitySchemaWithPractice = yup.object({
  ...facilitySchedulerBasicSchema,
  practice: selectorSchema(PRACTICE),
})

export const basicDoctorSchema = {
  ...ssnSchema,
  ...npiSchema,
  ...upinSchema,
  ...deaDateSchema,
  ...licenseDateSchema,
  ...taxonomyCodeSchema,
  ...firstLastNameSchema,
  taxId: yup.string(),
  prefix: yup.string(),
  deaNumber: yup.string(),
  taxIdStuff: yup.string(),
  dpsCtpNumber: yup.string(),
  stateLicense: yup.string(),
  emcProviderId: yup.string(),
  campusGrpNumber: yup.string(),
  blueShildNumber: yup.string(),
  providerIntials: yup.string(),
  specialityLicense: yup.string(),
  degreeCredentials: yup.string(),
  anesthesiaLicense: yup.string(),
  medicareGrpNumber: yup.string(),
  medicaidGrpNumber: yup.string(),
  prescriptiveAuthNumber: yup.string(),
  meammographyCertNumber: yup.string(),
  facilityId: selectorSchema(FACILITY),
  speciality: selectorSchema(SPECIALTY),
  suffix: notRequiredStringOnly(SUFFIX),
  middleName: notRequiredStringOnly(MIDDLE_NAME),
  dob: yup.string().required(requiredMessage(DOB)),
  languagesSpoken: notRequiredStringOnly(LANGUAGE_SPOKEN),
};

export const doctorSchema = yup.object({
  ...contactSchema,
  ...basicDoctorSchema,
  ...billingAddressSchema,
})

export const facilityServicesSchema = {
  facilityId: selectorSchema(FACILITY),
  name: yup.string().required(requiredMessage(SERVICE_NAME_TEXT)),
  price: yup.string().matches(NUMBER_REGEX, ValidMessage(PRICE)).min(2, MinLength(PRICE, 2))
    .max(5, MaxLength(PRICE, 5)).required(requiredMessage(PRICE)),
  duration: yup.string()
    .test('', requiredMessage(DURATION), value => !!value)
    .test('', invalidMessage(DURATION), value => !(parseInt(value || '') < 0))
    .test('', tooShort(DURATION), value => !(parseInt(value || '') < 5))
    .test('', tooLong(DURATION), value => !(parseInt(value || '') >= 300))
};

export const serviceSchema = yup.object({
  ...facilityServicesSchema,
})

export const PatientSchema = {
  ...ssnSchema,
  ...dobSchema,
  ...firstLastNameSchema,
  ...patientRegisterDateSchema,
  ...patientStatementDateSchema,
  suffix: notRequiredStringOnly(SUFFIX),
  sexAtBirth: selectorSchema(SEX_AT_BIRTH),
  middleName: notRequiredStringOnly(MIDDLE_NAME),
  language: notRequiredStringOnly(LANGUAGE_SPOKEN),
  prefferedName: notRequiredStringOnly(PREFERRED_NAME),
  previouslastName: notRequiredStringOnly(PREVIOUS_LAST_NAME),
  motherMaidenName: notRequiredStringOnly(MOTHERS_MAIDEN_NAME),
  previousFirstName: notRequiredStringOnly(PREVIOUS_FIRST_NAME),
  firstNameUsed: notRequiredStringOnly(PREVIOUS_FIRST_NAME),
};

export const emergencyPatientSchema = {
  emergencyPhone: notRequiredPhone(PHONE),
  emergencyName: notRequiredStringOnly(NAME),
  emergencyMobile: notRequiredPhone(MOBILE_NUMBER),
  employerIndustry: notRequiredStringOnly(INDUSTRY),
  employerUsualOccupation: notRequiredStringOnly(USUAL_OCCUPATION),
};

export const kinPatientSchema = {
  kinPhone: notRequiredPhone(PHONE),
  kinMobile: notRequiredPhone(MOBILE),
  kinName: notRequiredStringOnly(NAME),
  kinRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }),
};

export const guardianPatientSchema = {
  guardianSuffix: yup.string(),
  guardianLastName: yup.string(),
  guardianFirstName: yup.string(),
  guardianMiddleName: yup.string(),
};

export const guarantorPatientSchema = {
  guarantorRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(RELATIONSHIP)),
  guarantorState: stateSchema(true),
  guarantorCountry: countrySchema(false),
  guarantorPhone: requiredPhone(MOBILE_NUMBER),
  guarantorSuffix: notRequiredStringOnly(SUFFIX),
  guarantorAddress: addressValidation(ADDRESS, true),
  guarantorEmployerName: notRequiredStringOnly(NAME),
  guarantorAddress2: addressValidation(ADDRESS, false),
  guarantorMiddleName: notRequiredStringOnly(MIDDLE_NAME),
  guarantorSsn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX),
  guarantorEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  guarantorZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE)
    .required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  guarantorCity: yup.string().matches(STRING_REGEX, ValidMessage(CITY))
    .required(requiredMessage(CITY)).min(2, MinLength(CITY, 2)).max(20, MaxLength(CITY, 20)),
  guarantorLastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME))
    .min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  guarantorFirstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME))
    .min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
};

export const employerPatientSchema = {
  employerPhone: notRequiredPhone(PHONE),
  employerName: notRequiredStringOnly(NAME),
  employerIndustry: notRequiredStringOnly(INDUSTRY),
  employerUsualOccupation: notRequiredStringOnly(USUAL_OCCUPATION),
};

export const extendedPatientSchema = (isOptional: boolean) => yup.object({
  ...PatientSchema,
  ...kinPatientSchema,
  ...basicContactSchema,
  ...guardianPatientSchema,
  ...employerPatientSchema,
  ...emergencyPatientSchema,
  ...guarantorPatientSchema,
  gender: selectorSchema(GENDER),
  facilityId: selectorSchema(FACILITY),
  basicEmail: optionalEmailSchema(isOptional),
  basicPhone: notRequiredPhone(MOBILE_NUMBER),
  usualProviderId: selectorSchema(USUAL_PROVIDER_ID),
})

export const extendedEditPatientSchema = (isOptional: boolean) => yup.object({
  ...PatientSchema,
  ...kinPatientSchema,
  ...basicContactSchema,
  ...employerPatientSchema,
  ...guardianPatientSchema,
  ...emergencyPatientSchema,
  ...guarantorPatientSchema,
  gender: selectorSchema(GENDER),
  basicPhone: notRequiredPhone(MOBILE_NUMBER),
  basicEmail: optionalEmailSchema(isOptional)
})

export const extendedPatientAppointmentSchema = yup.object({
  ...PatientSchema,
  ...basicContactViaAppointmentSchema
})

export const extendedPatientAppointmentWithNonAdminSchema = yup.object({
  ...PatientSchema,
  facilityId: selectorSchema(FACILITY),
  ...basicContactViaAppointmentSchema,
})

export const settingSchema = yup.object({
  facilityId: selectorSchema(FACILITY),
  timeZone: selectorSchema(TIME_ZONE_TEXT)
})

export const appointmentSchema = yup.object({
  serviceId: selectorSchema(APPOINTMENT),
  notes: yup.string(),
  patientId: selectorSchema(PATIENT),
  primaryInsurance: notRequiredStringOnly(PRIMARY_INSURANCE),
  secondaryInsurance: notRequiredStringOnly(SECONDARY_INSURANCE),
})

export const doctorScheduleSchema = yup.object({
  ...scheduleTimeSchema,
  day: selectorSchema(DAY),
  serviceId: selectorSchema(APPOINTMENT),
})

export const externalAppointmentSchema = yup.object({
  ...dobSchema,
  ...emailSchema,
  ...firstLastNameSchema,
  serviceId: selectorSchema(APPOINTMENT),
})

export const externalPatientSchema = yup.object({
  ...ssnSchema,
  state: stateSchema(true),
  country: countrySchema(true),
  phone: notRequiredPhone(PHONE),
  emergencyState: stateSchema(false),
  providerId: selectorSchema(PROVIDER),
  city: requiredStringOnly(CITY, 2, 20),
  emergencyCountry: countrySchema(false),
  emergencyPhone: notRequiredPhone(PHONE),
  address: addressValidation(ADDRESS, true),
  emergencyCity: notRequiredStringOnly(CITY),
  emergencyName: notRequiredStringOnly(NAME),
  address2: addressValidation(ADDRESS, false),
  language: notRequiredStringOnly(PREFERRED_LANGUAGE),
  emergencyAddress: addressValidation(ADDRESS, false),
  emergencyAddress2: addressValidation(ADDRESS, false),
  preferredPharmacy: notRequiredStringOnly(PREFERRED_PHARMACY),
  zipCode: requiredMatches(ZIP_CODE, ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
  emergencyZipCode: requiredMatches(ZIP_CODE, ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
})

const registerUserSchema = {
  userPhone: notRequiredPhone(PHONE),
  userLastName: nameSchema(LAST_NAME),
  userFirstName: nameSchema(FIRST_NAME),
  userEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
}

const practiceFacilitySchema = {
  ...einSchema,
  ...upinSchema,
  state: stateSchema(false),
  fax: notRequiredPhone(FAX),
  country: countrySchema(false),
  phone: notRequiredPhone(PHONE),
  city: notRequiredStringOnly(CITY),
  address2: addressValidation(ADDRESS, false),
  name: yup.string().required(requiredMessage(PRACTICE_NAME)),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

export const createPracticeSchema = yup.object({
  ...registerUserSchema,
  ...practiceFacilitySchema,
  address: addressValidation(ADDRESS, true),
  facilityName: yup.string().required(requiredMessage(FACILITY_NAME)),
})

export const updatePracticeSchema = yup.object({
  ...practiceFacilitySchema
})

export const updatePasswordSchema = yup.object({
  ...passwordAndRepeatPasswordSchema,
  oldPassword: yup.string().required(requiredMessage(OLD_PASSWORD)),
})

export const roleSchema = yup.object({
  role: yup.string().required(requiredMessage(ROLE_NAME))
})

export const createFormBuilderSchemaWithFacility = yup.object({
  type: selectorSchema(''),
  facilityId: selectorSchema(FACILITY),
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
});

export const createFormBuilderSchema = yup.object({
  type: selectorSchema(''),
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
});

export const facilityScheduleSchema = yup.object({
  ...scheduleTimeSchema,
  day: selectorSchema(DAY),
})

const otpBasicSchema = {
  otpCode: notRequiredOTP(OTP_CODE, true),
}

export const otpSchema = yup.object({
  ...otpBasicSchema,
})

export const createPatientAllergySchema = (onset: string) => yup.object({
  allergyStartDate: yup.string().test('', ALLERGY_DATE_VALIDATION_MESSAGE,
    value => !!onset || new Date(value || '') <= new Date()
  ),
  severityId: selectorSchema(SEVERITY),
  reactionIds: yup.array().of(
    yup.object().shape({
      label: yup.string(),
      value: yup.string()
    })
  ).test('', REACTIONS_VALIDATION_MESSAGE, (value: any) => !!value && value.length > 0)
})

export const patientProblemSchema = yup.object({
  snowMedCodeId: selectorSchema(SNO_MED_CODE),
  problemStartDate: yup.string().test('', ALLERGY_DATE_VALIDATION_MESSAGE,
    value => new Date(value || '') <= new Date()),
})

export const patientVitalSchema = yup.object({
  pulseRate: yup.string().test('', invalidMessage(PULSE_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 5) return true
      return false
    }
  }),

  diastolicBloodPressure: yup.string().test('', invalidMessage(BLOOD_PRESSURE_TEXT), function (value) {
    if (!value && !!this.parent.systolicBloodPressure) return false
    else if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length < 3) return true
      return false
    }
  }),

  systolicBloodPressure: yup.string().test('', invalidMessage(BLOOD_PRESSURE_TEXT), function (val) {
    if (!val && !!this.parent.diastolicBloodPressure) return false
    else if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 400) return true
      return false
    }
  }),

  respiratoryRate: yup.string().test('', invalidMessage(RESPIRATORY_RATE_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 50) return true
      return false
    }
  }),

  oxygenSaturation: yup.string().test('', invalidMessage(OXYGEN_SATURATION_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value <= 100) return true
      return false
    }
  }),

  PatientHeight: yup.string().test('', invalidMessage(HEIGHT_TEXT), function (val) {
    if (!val && !!this.parent.PatientWeight) return false
    else if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 500) return true
      return false
    }
  }),

  PatientWeight: yup.string().test('', invalidMessage(WEIGHT_TEXT), function (val) {
    if (!val && !!this.parent.PatientHeight) return false
    else if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 10000) return true
      return false
    }
  }),

  PainRange: yup.string().test('', invalidMessage(PAIN_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value >= 0 && value <= 10) return true
      return false
    }
  }),

  patientHeadCircumference: yup.string().test('', invalidMessage(HEAD_CIRCUMFERENCE), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 300) return true
      return false
    }
  }),

  patientTemperature: yup.string().test('', invalidMessage(FEVER_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 150) return true
      return false
    }
  }),
})

export const patientVitalUpdateSchema = yup.object({
  pulseRate: yup.string().test('', invalidMessage(PULSE_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 5) return true
      return false
    }
  }),

  diastolicBloodPressure: yup.string().test('', invalidMessage(BLOOD_PRESSURE_TEXT), function (value) {
    if (!value && !!this.parent.systolicBloodPressure) return false
    else if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length < 3) return true
      return false
    }
  }),

  systolicBloodPressure: yup.string().test('', invalidMessage(BLOOD_PRESSURE_TEXT), function (val) {
    if (!val && !!this.parent.diastolicBloodPressure) return false
    else if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 400) return true
      return false
    }
  }),

  respiratoryRate: yup.string().test('', invalidMessage(RESPIRATORY_RATE_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 50) return true
      return false
    }
  }),

  oxygenSaturation: yup.string().test('', invalidMessage(OXYGEN_SATURATION_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value <= 100) return true
      return false
    }
  }),

  PatientHeight: yup.string().test('', invalidMessage(HEIGHT_TEXT), function (val) {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 500) return true
      return false
    }
  }),

  PatientWeight: yup.string().test('', invalidMessage(WEIGHT_TEXT), function (val) {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 10000) return true
      return false
    }
  }),

  PainRange: yup.string().test('', invalidMessage(PAIN_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value >= 0 && value <= 10) return true
      return false
    }
  }),

  patientHeadCircumference: yup.string().test('', invalidMessage(HEAD_CIRCUMFERENCE), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 300) return true
      return false
    }
  }),

  patientTemperature: yup.string().test('', invalidMessage(FEVER_TEXT), val => {
    if (!val) return true
    else {
      const value = parseFloat(val)
      if (value && value < 0) return false
      if (value && value > 0 && value < 150) return true
      return false
    }
  }),
})

export const attachmentNameUpdateSchema = yup.object({
  attachmentName: yup.string()
    .test('', invalidMessage('Attachment name'), value => !!value)
    .test('', NO_WHITE_SPACE_ALLOWED, value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
})

export const createLabOrdersSchema = yup.object({
  labTestStatus: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', 'required', ({ id }) => !!id),
  diagnosesIds: yup.array().of(
    yup.object().shape({
      label: yup.string().required(),
      value: yup.string().required()
    })
  ).test('', DIAGNOSES_VALIDATION_MESSAGE, (value) => !!value && value.length > 0),
  testField: yup.array().of(
    yup.object().shape({
      test: yup.object().shape({
        name: yup.string().required(),
        id: yup.string().required()
      }).test('', TEST_FIELD_VALIDATION_MESSAGE, ({ id }) => !!id),
      specimenTypeField: yup.array().of(
        yup.object().shape({
          specimenType: yup.object().shape({
            name: yup.string().required(),
            id: yup.string().required()
          }).test('', SPECIMEN_FIELD_VALIDATION_MESSAGE, ({ id }) => !!id)
        })
      )
    })
  )
})

export const createInsuranceSchema = yup.object({
  insuranceId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(INSURANCE_PAYER_NAME), ({ id }) => !!id),
  orderOfBenefit: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(ORDER_OF_BENEFIT), ({ id }) => !!id),
  patientRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(PATIENT_RELATIONSHIP_TO_POLICY_HOLDER), ({ id }) => !!id),
  certificationNumber: yup.string().required(requiredMessage(MEMBER_ID_CERTIFICATE_NUMBER)),
  policyNumber: yup.string().required(requiredMessage(POLICY_GROUP_NUMBER)),
  issueDate: yup.string().required(requiredMessage(ISSUE_DATE)),
  expirationDate: yup.string().required(requiredMessage(EXPIRATION_DATE)),
  copayFields: yup.array().of(
    yup.object().shape({
      copayType: yup.object().shape({
        name: yup.string().required(),
        id: yup.string().required()
      }).test('', requiredMessage(COPAY_TYPE), ({ id }) => !!id),
      amount: yup.string().required(requiredMessage(AMOUNT))
    })
  ),
  coInsurancePercentage: yup.string().required(requiredMessage(COINSURANCE_PERCENTAGE)),
  referringProvider: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(REFERRING_PROVIDER), ({ id }) => !!id),
  primaryCareProvider: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(PRIMARY_CARE_PROVIDER), ({ id }) => !!id),
  pricingProductType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(PRICING_PRODUCT_TYPE), ({ id }) => !!id),
  notes: yup.string().required(requiredMessage(NOTES)),
  policyHolderId: yup.string().required(requiredMessage(POLICY_HOLDER_ID_CERTIFICATION_NUMBER)),
  employer: yup.string().required(requiredMessage(EMPLOYER)),
  suffix: yup.string().required(requiredMessage(SUFFIX)),
  firstName: yup.string().required(requiredMessage(FIRST_NAME)),
  middleName: yup.string(),
  lastName: yup.string().required(requiredMessage(LAST_NAME)),
  zipCode: yup.string().required(requiredMessage(ZIP_CODE)),
  address: yup.string().required(requiredMessage(ADDRESS)),
  addressCTD: yup.string().required(requiredMessage(ADDRESS_CTD)),
  city: yup.string().required(requiredMessage(CITY)),
  state: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(STATE), ({ id }) => !!id),
  ssn: yup.string().required(requiredMessage(SSN)),
  sex: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(LEGAL_SEX), ({ id }) => !!id),
  ...dobSchema
})

const achPaymentSchema = {
  accountNumber: yup.string().required(requiredMessage(BANK_ACCOUNT)).matches(US_BANK_ACCOUNT_REGEX, BANK_ACCOUNT_VALIDATION_MESSAGE),
  routingNumber: yup.string().required(requiredMessage(ROUTING_NUMBER)).matches(US_ROUTING_NUMBER_REGEX, ROUTING_NO_VALIDATION_MESSAGE),
  accountType: yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
  }).test('', requiredMessage(ACCOUNT_TYPE), ({ id }) => !!id), //savings or checking
  streetAddress: yup.string().required(requiredMessage(STREET_ADDRESS)),
  locality: yup.string(),
  region: yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
  }).test('', requiredMessage(STATE), ({ id }) => !!id),
  postalCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  authority: yup.bool().oneOf([true], requiredMessage(AUTHORITY))
}

export const personalAchSchema = yup.object({
  firstName: yup.string().required(requiredMessage(FIRST_NAME)),
  lastName: yup.string().required(requiredMessage(LAST_NAME)),
  ...achPaymentSchema,
})

export const businessAchSchema = yup.object({
  businessName: yup.string().required(requiredMessage(COMPANY_NAME)),
  ...achPaymentSchema,
})

export const basicPatientDoctorSchema = {
  ...ssnSchema,
  ...npiSchema,
  ...upinSchema,
  ...deaDateSchema,
  ...licenseDateSchema,
  ...taxonomyCodeSchema,
  ...firstLastNameSchema,
  taxId: yup.string(),
  prefix: yup.string(),
  deaNumber: yup.string(),
  taxIdStuff: yup.string(),
  dpsCtpNumber: yup.string(),
  stateLicense: yup.string(),
  emcProviderId: yup.string(),
  campusGrpNumber: yup.string(),
  blueShildNumber: yup.string(),
  providerIntials: yup.string(),
  specialityLicense: yup.string(),
  degreeCredentials: yup.string(),
  anesthesiaLicense: yup.string(),
  medicareGrpNumber: yup.string(),
  medicaidGrpNumber: yup.string(),
  prescriptiveAuthNumber: yup.string(),
  meammographyCertNumber: yup.string(),
  speciality: selectorSchema(SPECIALTY),
  suffix: notRequiredStringOnly(SUFFIX),
  middleName: notRequiredStringOnly(MIDDLE_NAME),
  languagesSpoken: notRequiredStringOnly(LANGUAGE_SPOKEN),
};

export const updatePatientProviderSchema = (isOtherRelation: boolean) => yup.object({
  providerId: selectorSchema(PROVIDER),
  phone: notRequiredPhone(PHONE),
  speciality: selectorSchema(SPECIALTY),
  otherRelation: otherRelationSchema(isOtherRelation),
  ...firstLastNameSchema,
  ...emailSchema,
})

export const updatePatientProviderRelationSchema = (isOtherRelation: boolean) => yup.object({
  phone: notRequiredPhone(PHONE),
  speciality: selectorSchema(SPECIALTY),
  otherRelation: otherRelationSchema(isOtherRelation),
  ...firstLastNameSchema,
  ...emailSchema,
})
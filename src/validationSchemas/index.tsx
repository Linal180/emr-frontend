// packages block
import moment from "moment";
import * as yup from "yup";
// utils and constants block
import { SelectorOption } from "../interfacesTypes";
import {
  checkNpi, dateValidation, invalidMessage, requiredMessage, timeValidation, tooLong, tooShort
} from "../utils";
import {
  STRING_REGEX, ADDRESS_REGEX, MinLength, MaxLength, ALPHABETS_REGEX, ValidMessage, NUMBER_REGEX,
  OTHER_RELATION, EIN_VALIDATION_MESSAGE, EIN_REGEX, UPIN_VALIDATION_MESSAGE, UPIN_REGEX,
  SSN_VALIDATION_MESSAGE, SSN_REGEX, PASSWORD_LABEL, TID_VALIDATION_MESSAGE, TID_REGEX,
  TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE, ValidOTP,
  DOB_VALIDATION_MESSAGE, STATE, COUNTRY, PASSWORD, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE,
  CONFIRM_YOUR_PASSWORD, START_TIME, END_TIME, REGISTRATION_DATE, DECEASED_DATE, ISSUE_DATE,
  FIRST_NAME, FAX, PHONE, PAGER, CITY, ADDRESS, ZIP_VALIDATION_MESSAGE, ZIP_REGEX, MOBILE_NUMBER,
  SERVICE_CODE, GENDER, MOBILE, DOB, ROLE, TIME_ZONE_TEXT, PRACTICE_NAME, NAME, EXPIRATION_DATE,
  NO_WHITE_SPACE_REGEX, PRACTICE, SPECIALTY, SUFFIX, MIDDLE_NAME, LANGUAGE_SPOKEN, SERVICE_NAME_TEXT,
  SEX_AT_BIRTH, PREFERRED_NAME, PREVIOUS_LAST_NAME, MOTHERS_MAIDEN_NAME, PREVIOUS_FIRST_NAME,
  APPOINTMENT, PATIENT, PRIMARY_INSURANCE, SECONDARY_INSURANCE, PROVIDER, PREFERRED_LANGUAGE,
  OLD_PASSWORD, ROLE_NAME, FORM_TYPE, FORM_NAME, OTP_CODE, DATE_VALIDATION_MESSAGE, PULSE_TEXT,
  RESPIRATORY_RATE_TEXT, OXYGEN_SATURATION_TEXT, HEIGHT_TEXT, WEIGHT_TEXT, PAIN_TEXT, HEAD_CIRCUMFERENCE,
  NO_WHITE_SPACE_ALLOWED, TEST_FIELD_VALIDATION_MESSAGE, PHONE_NUMBER, TESTS_FIELD_VALIDATION_MESSAGE, NPI,
  INSURANCE_PAYER_NAME, ORDER_OF_BENEFIT, PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, SYSTEM_ROLES,
  COPAY_TYPE, REFERRING_PROVIDER, ITEM_MODULE, INVALID_END_TIME, CLAIM_STATUS, ATTACHMENT_NAME,
  POLICY_HOLDER_ID_CERTIFICATION_NUMBER, EMPLOYER, LEGAL_SEX, BANK_ACCOUNT, US_BANK_ACCOUNT_REGEX,
  ROUTING_NUMBER, US_ROUTING_NUMBER_REGEX, ROUTING_NO_VALIDATION_MESSAGE, ACCOUNT_TYPE, STREET_ADDRESS,
  DOCUMENT_TYPE, DATE, DOCUMENT_NAME, PRIMARY_PROVIDER, DESCRIPTION, TAX_ID, ICD_CODE,
  INVALID_EMAIL, EMAIL, CLIA_VALIDATION_MESSAGE, CLIA_REGEX, TAXONOMY_CODE, NPI_MESSAGE,
  LAST_NAME, MAMMOGRAPHY_CERT_NUMBER_REGEX, PASSWORDS_MUST_MATCH, ZIP_CODE, FACILITY,
  DURATION, USUAL_OCCUPATION, RELATIONSHIP, PREFERRED_PHARMACY, FACILITY_NAME, CONTACT_NUMBER, TITLE,
  SPECIMEN_FIELD_VALIDATION_MESSAGE, TEMPERATURE_TEXT, BLOOD_PRESSURE_TEXT, POLICY_GROUP_NUMBER,
  AUTHORITY, COMPANY_NAME, USUAL_PROVIDER_ID, BANK_ACCOUNT_VALIDATION_MESSAGE, INDUSTRY,
  CPT_CODE_PROCEDURE_CODE, SERVICE_FEE_CHARGE, AMOUNT, NO_SPACE_REGEX, INVALID_LICENSE_DATE_ERROR_MESSAGE,
  DESCRIPTION_INVALID_MESSAGE, NO_WHITE_SPACING_ERROR_MESSAGE, NO_WHITE_SPACING_AT_BOTH_ENDS_ERROR_MESSAGE,
  NO_SPACE_AT_BOTH_ENDS_REGEX, NO_SPECIAL_CHAR_ERROR_MESSAGE, NO_SPECIAL_CHAR_REGEX, NO_NUMBER_ERROR_MESSAGE,
  INVALID_DEA_DATE_ERROR_MESSAGE, INVALID_EXPIRATION_DATE_ERROR_MESSAGE, 
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

const generalNameSchema = (
  isRequired: boolean, label: string, allowNumber: boolean, allowSpecial: boolean
) => (
  yup.string()
    .test('', requiredMessage(label), value => isRequired ? !!value : true)
    .test('', NO_WHITE_SPACING_AT_BOTH_ENDS_ERROR_MESSAGE,
      value => value ? NO_SPACE_AT_BOTH_ENDS_REGEX.test(value) : false)
    .test('', NO_SPECIAL_CHAR_ERROR_MESSAGE,
      value => allowSpecial ? true : value ? NO_SPECIAL_CHAR_REGEX.test(value) : false)
    .test('', NO_NUMBER_ERROR_MESSAGE,
      value => allowNumber ? true : value ? STRING_REGEX.test(value) : false)
    .min(3, MinLength(SERVICE_NAME_TEXT, 3)).max(50, MaxLength(SERVICE_NAME_TEXT, 50))
)

const nameSchema = (label: string) => {
  return yup.string().matches(ALPHABETS_REGEX, ValidMessage(label))
    .min(2, MinLength(label, 2)).max(26, MaxLength(label, 26))
    .required(requiredMessage(label))
}

export const notRequiredPhone = (label: string) => {
  return yup.string()
    .test('', MinLength(label, 10), value => !value ? !value : !!value && value.length >= 10)
}

export const requiredPhone = (label: string) => {
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

const documentNameSchema = (label: string, isRequired: boolean) => {
  return yup.string()
    .test('', requiredMessage(label), value => isRequired ? !!value : true)
    .min(6, MinLength(label, 6)).max(30, MaxLength(label, 30))
    .test('', NO_WHITE_SPACING_ERROR_MESSAGE, value => value ? NO_SPACE_REGEX.test(value) : false)
}

const optionalEmailSchema = (isOptional: boolean) => {
  return yup.string().email(INVALID_EMAIL)
    .test('', requiredMessage(EMAIL), value => isOptional ? true : !!value)
}

const otherRelationSchema = (isOtherRelation: boolean) => yup.string()
  .test('', requiredMessage(OTHER_RELATION), value => isOtherRelation ? !!value : true)

const nameValidationSchema = (label: string, required: boolean) => yup.string()
  .test('', requiredMessage(label), value => required ? !!value && ALPHABETS_REGEX.test(value) : true)
  .test('', invalidMessage(label), value => !!value ? ALPHABETS_REGEX.test(value) : !!!value)

const einSchema = { ein: notRequiredMatches(EIN_VALIDATION_MESSAGE, EIN_REGEX) }
const upinSchema = { upin: notRequiredMatches(UPIN_VALIDATION_MESSAGE, UPIN_REGEX) }
const npiSchema = (isRequired: boolean = false) => {
  return {
    npi: yup.string()
      .test('', requiredMessage(NPI), value => isRequired ? !!value : true)
      .test('', NPI_MESSAGE, value => !!value ? checkNpi(value) : true)
  }
}

const ssnSchema = { ssn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX) }
const passwordSchema = { password: yup.string().required(requiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)) }
const federalTaxIdSchema = { federalTaxId: notRequiredMatches(TID_VALIDATION_MESSAGE, TID_REGEX) }
const cliaIdNumberSchema = { cliaIdNumber: notRequiredMatches(CLIA_VALIDATION_MESSAGE, CLIA_REGEX) }
const taxonomyCodeSchema = { taxonomyCode: notRequiredMatches(TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX) }
const mammographySchema = {
  mammographyCertificationNumber: notRequiredMatches(MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX)
}

const dobSchema = {
  dob: yup.string().test('', DOB_VALIDATION_MESSAGE,
    value => new Date(value || '') <= new Date() && moment().diff(moment(value), 'years') < 123)
}

// const doctorDobSchema = (label: string) => {
//   return yup.string()
//     .test('', minDobValidMessage(label),
//       value => moment().diff(moment(value), 'years') >= 20)
//     .test('', maxDobValidMessage(label),
//       value => moment().diff(moment(value), 'years') < 100)
// }

export const selectorSchema = (label: string, isRequired: boolean = true) => yup.object().shape({
  name: yup.string(),
  id: yup.string()
}).test('', requiredMessage(label), ({ id, name }) => isRequired ? !!id && !!name : true);

const tableSelectorSchema = (label: string, isRequired: boolean = true) => yup.object().shape({
  codeId: yup.string(),
  code: yup.string()
}).test('', requiredMessage(label), ({ codeId, code }) => isRequired ? !!codeId && !!code : true);

const multiOptionSchema = (label: string, isRequired: boolean = true) => yup.object().shape({
  label: yup.string().required(),
  value: yup.string().required()
}).test('', requiredMessage(label), (multiValue) =>
  isRequired ? !!multiValue?.value && !!multiValue?.label : true
).nullable();

const stateSchema = (isRequired: boolean) => {
  return yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }).test('', requiredMessage(STATE), value => isRequired ? !!value : true)
}

const citySchema = (required: boolean = false) => yup.string()
  .test('', requiredMessage(CITY), value => required ? !!value && STRING_REGEX.test(value) : true)
  .test('', invalidMessage(CITY), value => !!value ? STRING_REGEX.test(value) : !!!value)

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

  deaTermDate: yup.string().test('', INVALID_DEA_DATE_ERROR_MESSAGE,
    (value, { parent: { deaActiveDate } }) => !value
      ? !value : dateValidation(value, deaActiveDate))
}

const licenseDateSchema = {
  licenseActiveDate: yup.string().test(value => !value
    ? !value : new Date(value || '') <= new Date()),

  licenseTermDate: yup.string().test('', INVALID_LICENSE_DATE_ERROR_MESSAGE,
    (value, { parent: { licenseActiveDate } }) => !value
      ? !value : dateValidation(value, licenseActiveDate))
}

const scheduleTimeSchema = {
  startAt: yup.string().test('', invalidMessage(START_TIME), value => !!value),
  endAt: yup.string().test('', invalidMessage(END_TIME), (value, { parent: { startAt } }) =>
    !value ? !!value : timeValidation(value, startAt))
}

const facilityTimeSchema = {
  startTime: yup.string().test('', invalidMessage(START_TIME), value => !!value),
  endTime: yup.string().test('', INVALID_END_TIME, (value, { parent: { startTime } }) =>
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

const contactSchema = {
  ...emailSchema,
  state: stateSchema(false),
  fax: notRequiredPhone(FAX),
  phone: notRequiredPhone(PHONE),
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
  basicPhone: notRequiredPhone(MOBILE_NUMBER),
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
  billingPhone: notRequiredPhone(PHONE),
  billingCity: notRequiredStringOnly(CITY),
  billingEmail: yup.string().email(INVALID_EMAIL),
  billingAddress: addressValidation(ADDRESS, false),
  billingAddress2: addressValidation(ADDRESS, false),
  billingZipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

const staffBasicSchema = {
  ...firstLastNameSchema,
  gender: selectorSchema(GENDER),
  mobile: notRequiredPhone(PHONE),
  phone: notRequiredPhone(MOBILE),
  dob: yup.string().required(requiredMessage(DOB)),
}

export const staffSchema = (isEdit: boolean, isSuper: boolean, isPractice: boolean) => yup.object({
  ...emailSchema,
  ...staffBasicSchema,
  roleType: selectorSchema(ROLE, !isEdit),
  facilityId: selectorSchema(FACILITY, false).when('roleType', {
    is: ({ id }: SelectorOption) =>
      id !== SYSTEM_ROLES.PracticeAdmin ? (isSuper || isPractice) : false,
    then: selectorSchema(FACILITY, true),
    otherwise: selectorSchema(FACILITY, false)
  }),

  practiceId: selectorSchema(PRACTICE, false).when('roleType', {
    is: ({ id }: SelectorOption) => id === SYSTEM_ROLES.PracticeAdmin ? isSuper : false,
    then: selectorSchema(PRACTICE, true),
    otherwise: selectorSchema(PRACTICE, false)
  }),
})

export const facilitySchema = (practiceRequired: boolean) => yup.object({
  ...npiSchema(),
  ...contactSchema,
  ...mammographySchema,
  ...cliaIdNumberSchema,
  ...facilityTimeSchema,
  ...federalTaxIdSchema,
  tamxonomyCode: selectorSchema(TAXONOMY_CODE, false),
  ...billingAddressSchema,
  timeZone: selectorSchema(TIME_ZONE_TEXT),
  serviceCode: selectorSchema(SERVICE_CODE),
  practice: selectorSchema(PRACTICE, practiceRequired),
  name: yup.string()
    .required(requiredMessage(NAME))
    .test('', invalidMessage(NAME), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
})

export const basicDoctorSchema = {
  ...ssnSchema,
  ...upinSchema,
  ...npiSchema(),
  ...deaDateSchema,
  ...licenseDateSchema,
  ...firstLastNameSchema,
  taxonomyCode: selectorSchema(TAXONOMY_CODE, false),
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
  name: generalNameSchema(true, SERVICE_NAME_TEXT, true, false),
  // price: yup.string()
  //   .test('', requiredMessage(PRICE), value => !!value)
  //   .test('', invalidMessage(PRICE), value => parseInt(value || '') > 0)
  //   .matches(NUMBER_REGEX, ValidMessage(PRICE)),
  duration: yup.string()
    .test('', requiredMessage(DURATION), value => !!value)
    .test('', requiredMessage(DURATION), value => parseInt(value || '') > 0)
    .matches(NUMBER_REGEX, ValidMessage(DURATION))
    .test('', invalidMessage(DURATION), value => !(parseInt(value || '') < 0))
    .test('', tooShort(DURATION), value => !(parseInt(value || '') < 5))
    .test('', tooLong(DURATION), value => !(parseInt(value || '') >= 300))
};

export const serviceSchema = yup.object({
  ...facilityServicesSchema,
})

const PatientSchema = {
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
    name: yup.string(),
    id: yup.string()
  }),
};

export const guardianPatientSchema = {
  guardianSuffix: yup.string(),
  guardianLastName: nameValidationSchema(LAST_NAME, false),
  guardianFirstName: nameValidationSchema(FIRST_NAME, false),
  guardianMiddleName: notRequiredStringOnly(MIDDLE_NAME),
};

export const guarantorPatientSchema = {
  guarantorCity: citySchema(),
  guarantorState: stateSchema(false),
  guarantorSuffix: notRequiredStringOnly(SUFFIX),
  guarantorPhone: notRequiredPhone(MOBILE_NUMBER),
  guarantorEmail: yup.string().email(INVALID_EMAIL),
  guarantorEmployerName: notRequiredStringOnly(NAME),
  guarantorAddress: addressValidation(ADDRESS, false),
  guarantorAddress2: addressValidation(ADDRESS, false),
  guarantorMiddleName: notRequiredStringOnly(MIDDLE_NAME),
  guarantorLastName: nameValidationSchema(LAST_NAME, false),
  guarantorRelationship: selectorSchema(RELATIONSHIP, false),
  guarantorFirstName: nameValidationSchema(FIRST_NAME, false),
  guarantorSsn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX),
  guarantorZipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
};

export const employerPatientSchema = {
  employerPhone: notRequiredPhone(PHONE),
  employerName: notRequiredStringOnly(NAME),
  employerIndustry: notRequiredStringOnly(INDUSTRY),
  employerUsualOccupation: notRequiredStringOnly(USUAL_OCCUPATION),
};

export const extendedPatientSchema = (
  isOptional: boolean, isDoctor: boolean, isSuperAdminOrPracticeAdmin: boolean
) => yup.object({
  ...ssnSchema,
  ...dobSchema,
  ...kinPatientSchema,
  ...firstLastNameSchema,
  ...employerPatientSchema,
  ...guardianPatientSchema,
  ...emergencyPatientSchema,
  ...guarantorPatientSchema,
  middleName: nameSchema(MIDDLE_NAME),
  basicEmail: optionalEmailSchema(isOptional),
  basicMobile: notRequiredPhone(PHONE_NUMBER),
  basicPhone: notRequiredPhone(MOBILE_NUMBER),
  basicZipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
  ...(isSuperAdminOrPracticeAdmin ? { facilityId: selectorSchema(FACILITY) } : {}),
  ...(isDoctor ? {} : { usualProviderId: selectorSchema(USUAL_PROVIDER_ID) }),
})

export const extendedPatientAppointmentSchema = yup.object({
  ...PatientSchema,
  ...basicContactViaAppointmentSchema
})

export const extendedPatientAppointmentWithNonAdminSchema = yup.object({
  ...PatientSchema,
  facilityId: selectorSchema(FACILITY),
  usualProviderId: selectorSchema(USUAL_PROVIDER_ID),
  ...basicContactViaAppointmentSchema,
})

export const settingSchema = yup.object({
  facilityId: selectorSchema(FACILITY),
  timeZone: selectorSchema(TIME_ZONE_TEXT)
})

export const appointmentSchema = (adminUser: boolean) => yup.object({
  facilityId: selectorSchema(FACILITY, adminUser),
  serviceId: multiOptionSchema(APPOINTMENT),
  notes: yup.string(),
  patientId: selectorSchema(PATIENT),
  primaryInsurance: notRequiredStringOnly(PRIMARY_INSURANCE),
  secondaryInsurance: notRequiredStringOnly(SECONDARY_INSURANCE),
})

export const scheduleSchema = (isDoctor: boolean, shouldHaveRecursion: boolean) => yup.object({
  ...scheduleTimeSchema,
  recurringEndDate: !shouldHaveRecursion ? yup.string().required(requiredMessage(DATE)) : yup.string().optional(),
  serviceId: yup.array().of(
    multiOptionSchema(APPOINTMENT)
  ).test('', requiredMessage(APPOINTMENT), (value: any) => isDoctor ? !!value && value.length > 0 : true)
})

export const providerAppointmentSchema = (onlyDoctor: boolean) => yup.object({
  serviceId: multiOptionSchema(APPOINTMENT),
  notes: yup.string(),
  patientId: selectorSchema(PATIENT),
  primaryInsurance: notRequiredStringOnly(PRIMARY_INSURANCE),
  secondaryInsurance: notRequiredStringOnly(SECONDARY_INSURANCE),
  providerId: selectorSchema(PROVIDER, onlyDoctor === false)
})

export const doctorScheduleSchema = yup.object({
  ...scheduleTimeSchema,
  serviceId: yup.array().of(
    multiOptionSchema(APPOINTMENT)
  ).test('', requiredMessage(APPOINTMENT), (value: any) => !!value && value.length > 0),
})

export const externalAppointmentSchema = yup.object({
  ...dobSchema,
  ...emailSchema,
  ...firstLastNameSchema,
  serviceId: multiOptionSchema(APPOINTMENT)
})

export const externalSignatureAppointmentSchema = yup.object({
  ...dobSchema,
  ...emailSchema,
  ...firstLastNameSchema,
  serviceId: multiOptionSchema(APPOINTMENT),
  signature: yup.mixed().required()
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
  phone: notRequiredPhone(PHONE),
  city: notRequiredStringOnly(CITY),
  address2: addressValidation(ADDRESS, false),
  name: generalNameSchema(true, PRACTICE_NAME, true, false),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

export const createPracticeSchema = yup.object({
  ...npiSchema(true),
  ...registerUserSchema,
  ...practiceFacilitySchema,
  address: addressValidation(ADDRESS, true),
  taxonomyCodeId: selectorSchema(TAXONOMY_CODE, false),
  facilityName: generalNameSchema(true, FACILITY_NAME, true, false),
  taxId: requiredMatches(TAX_ID, TID_VALIDATION_MESSAGE, TID_REGEX),
})

export const updatePracticeSchema = yup.object({
  ...npiSchema(true),
  ...practiceFacilitySchema,
  taxonomyCodeId: selectorSchema(TAXONOMY_CODE, false),
  taxId: requiredMatches(TAX_ID, TID_VALIDATION_MESSAGE, TID_REGEX),
})

export const updatePasswordSchema = yup.object({
  ...passwordAndRepeatPasswordSchema,
  oldPassword: yup.string().required(requiredMessage(OLD_PASSWORD)),
})

export const roleSchema = yup.object({
  role: yup.string()
    .required(requiredMessage(ROLE_NAME))
    .test('', invalidMessage(ROLE_NAME), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false),
  description: yup.string()
    .required(requiredMessage(DESCRIPTION))
    .test('', DESCRIPTION_INVALID_MESSAGE, value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
})

export const createFormBuilderSchemaWithFacility = yup.object({
  type: selectorSchema(FORM_TYPE),
  isPractice: yup.boolean(),
  facilityId: yup.object().shape({ name: yup.string(), id: yup.string() })
    .test('', requiredMessage(FACILITY), ({ id, name }, { parent: { isPractice } }) => {
      return isPractice ? isPractice : id && name
    }),
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
});

export const createFormBuilderSchema = yup.object({
  type: selectorSchema(FORM_TYPE),
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
});

const otpBasicSchema = {
  otpCode: notRequiredOTP(OTP_CODE, true),
}

export const otpSchema = yup.object({
  ...otpBasicSchema,
})

export const createPatientAllergySchema = (onset: string) => yup.object({
  allergyStartDate: yup.string().nullable().test('', DATE_VALIDATION_MESSAGE,
    value => !!onset || new Date(value || '') <= new Date()
  ),
})

export const patientProblemSchema = yup.object({
  // snowMedCodeId: selectorSchema(SNO_MED_CODE),
  problemStartDate: yup.string().test('', DATE_VALIDATION_MESSAGE,
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

  patientTemperature: yup.string().test('', invalidMessage(TEMPERATURE_TEXT), val => {
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

  patientTemperature: yup.string().test('', invalidMessage(TEMPERATURE_TEXT), val => {
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
  testFieldValues: yup.array().of(
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
      ),
      diagnosesIds: yup.array().of(
        yup.object().shape({
          label: yup.string().required(),
          value: yup.string().required()
        })
      ),
      // .test('', DIAGNOSES_VALIDATION_MESSAGE, (value) => !!value && value.length > 0),
    })
  ).test('', TESTS_FIELD_VALIDATION_MESSAGE, (value) => !!value && value.length > 0),
  primaryProviderId: selectorSchema(PRIMARY_PROVIDER),
  referringProviderId: selectorSchema(REFERRING_PROVIDER),
})

const issueAndExpireSchema = {
  issueDate: yup.string().test('', invalidMessage(ISSUE_DATE), value =>
    !value ? !value : new Date(value || '') <= new Date()),

  expirationDate: yup.string().test('', invalidMessage(EXPIRATION_DATE), (value, { parent: { issueDate } }) =>
    !value ? !value : dateValidation(value, issueDate))
}

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
  certificationNumber: yup.string(),
  policyNumber: yup.string().required(requiredMessage(POLICY_GROUP_NUMBER)),
  copayFields: yup.array().of(
    yup.object().shape({
      copayType: yup.object().shape({
        name: yup.string(),
        id: yup.string()
      }),
      amount: yup.string()
    })
  ),
  coInsurancePercentage: yup.string(),
  referringProvider: yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }),
  primaryCareProvider: yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }),
  pricingProductType: yup.object().shape({
    name: yup.string(),
    id: yup.string()
  }),
  notes: yup.string(),
  policyHolderId: yup.string().required(requiredMessage(POLICY_HOLDER_ID_CERTIFICATION_NUMBER)),
  employer: yup.string().required(requiredMessage(EMPLOYER)),
  suffix: yup.string().required(requiredMessage(SUFFIX)),
  firstName: yup.string().required(requiredMessage(FIRST_NAME)),
  middleName: yup.string(),
  lastName: yup.string().required(requiredMessage(LAST_NAME)),
  address: yup.string().required(requiredMessage(ADDRESS)),
  addressCTD: yup.string(),
  city: yup.string().required(requiredMessage(CITY)),
  state: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(STATE), ({ id }) => !!id),
  sex: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(LEGAL_SEX), ({ id }) => !!id),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
  ...dobSchema,
  ...issueAndExpireSchema,
  ...ssnSchema,
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
  ...upinSchema,
  ...npiSchema(),
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
  otherRelation: otherRelationSchema(isOtherRelation),
})

export const updatePatientProviderRelationSchema = (isOtherRelation: boolean) => yup.object({
  otherRelation: otherRelationSchema(isOtherRelation),
})
export const createCopaySchema = yup.object({
  copayType: selectorSchema(COPAY_TYPE),
  amount: yup.string()
  .test('', requiredMessage(AMOUNT), value => !!value)
  .test('', invalidMessage(AMOUNT), value => parseInt(value || '') > 0)
  .matches(NUMBER_REGEX, ValidMessage(AMOUNT)),
})

export const createBillingSchema = yup.object({
  // billingStatus: selectorSchema(BILLING_STATUS),
  // paymentType: selectorSchema(PATIENT_PAYMENT_TYPE),
  amount: yup.string(),
  [ITEM_MODULE.icdCodes]: yup.array().of(
    tableSelectorSchema(ITEM_MODULE.icdCodes)
  ).test('', requiredMessage(ICD_CODE), (value: any) => !!value && value.length > 0),
  [ITEM_MODULE.cptFeeSchedule]: yup.array().of(
    tableSelectorSchema(ITEM_MODULE.cptCode)
  ).test('', requiredMessage(ITEM_MODULE.cptCode), (value: any) => !!value && value.length > 0),
})

export const addDocumentSchema = yup.object({
  comments: yup.string(),
  // provider: selectorSchema(PROVIDER),
  documentType: selectorSchema(DOCUMENT_TYPE),
  date: yup.string().required(requiredMessage(DATE)),
  attachmentName: documentNameSchema(DOCUMENT_NAME, true),
})

export const addLabProviderDetailsSchema = yup.object({
  comments: yup.string(),
  primaryProviderId: selectorSchema(PRIMARY_PROVIDER),
  referringProviderId: selectorSchema(REFERRING_PROVIDER),
})

export const createAgreementSchema = yup.object({
  title: yup.string()
    .required(requiredMessage(TITLE))
    .test('', invalidMessage(TITLE), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
})

export const profileSchema = yup.object({
  phone: notRequiredPhone(CONTACT_NUMBER),
})


export const labOrdersResultAttachmentSchema = yup.object({
  attachmentName: yup.string()
    .required(requiredMessage(ATTACHMENT_NAME))
    .test('', invalidMessage(ATTACHMENT_NAME), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
})

export const createClaimStatusSchema = yup.object({
  statusName: yup.string().required(requiredMessage(CLAIM_STATUS))
    .min(3, MinLength(CLAIM_STATUS, 3)).max(26, MaxLength(CLAIM_STATUS, 26)),
})


export const feeScheduleSchema = yup.object({
  practiceId: selectorSchema(PRACTICE),
  name: yup.string().required(requiredMessage(NAME))
    .min(3, MinLength(NAME, 3)).max(26, MaxLength(NAME, 26)),

  expiryDate: yup.string().test('', INVALID_EXPIRATION_DATE_ERROR_MESSAGE,
    (value, { parent: { effectiveDate } }) => !value
      ? !value : dateValidation(value, effectiveDate))
})

export const cptFeeScheduleSchema = yup.object({
  description: yup.string(),
  shortDescription: yup.string(),
  code: selectorSchema(CPT_CODE_PROCEDURE_CODE),
  serviceFee: yup.string().required(requiredMessage(SERVICE_FEE_CHARGE)),
})

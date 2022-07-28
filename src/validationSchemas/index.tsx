// packages block
import moment from "moment";
import * as yup from "yup";
// utils and constants block
import {
  ACCOUNT_TYPE, ADDRESS, ADDRESS_REGEX, ALPHABETS_REGEX, AMOUNT, APPOINTMENT, ATTACHMENT_NAME, AUTHORITY, BANK_ACCOUNT,
  BANK_ACCOUNT_VALIDATION_MESSAGE, BLOOD_PRESSURE_TEXT, CITY, CLAIM_STATUS, CLIA_REGEX, CLIA_VALIDATION_MESSAGE, COMPANY_NAME,
  CONFIRM_YOUR_PASSWORD, CONTACT_NUMBER, COPAY_TYPE, COUNTRY, CPT_CODE_PROCEDURE_CODE, DATE, DATE_VALIDATION_MESSAGE, DECEASED_DATE,
  DESCRIPTION, DIAGNOSES_VALIDATION_MESSAGE, DOB, DOB_VALIDATION_MESSAGE, DOCUMENT_NAME, DOCUMENT_TYPE, DURATION, EIN_REGEX,
  EIN_VALIDATION_MESSAGE, EMAIL, EMPLOYER, END_TIME, EXPIRATION_DATE, FACILITY, FACILITY_NAME, FAX, FIRST_NAME, FORM_NAME,
  FORM_TYPE, GENDER, HEAD_CIRCUMFERENCE, HEIGHT_TEXT, ICD_CODE, INDUSTRY, INSURANCE_PAYER_NAME, INVALID_EMAIL, INVALID_END_TIME,
  ISSUE_DATE, ITEM_MODULE, LANGUAGE_SPOKEN, LAST_NAME, LEGAL_SEX, MAMMOGRAPHY_CERT_NUMBER_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE,
  MaxLength, MIDDLE_NAME, MinLength, MOBILE, MOBILE_NUMBER, MOTHERS_MAIDEN_NAME, NAME, NO_WHITE_SPACE_ALLOWED, NO_WHITE_SPACE_REGEX,
  NPI_MESSAGE, NUMBER_REGEX, OLD_PASSWORD, ORDER_OF_BENEFIT, OTHER_RELATION, OTP_CODE, OXYGEN_SATURATION_TEXT, PAGER, PAIN_TEXT, PASSWORD,
  PASSWORDS_MUST_MATCH, PASSWORD_LABEL, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PATIENT, PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, PHONE,
  PHONE_NUMBER, POLICY_GROUP_NUMBER, POLICY_HOLDER_ID_CERTIFICATION_NUMBER, PRACTICE, PRACTICE_NAME, PREFERRED_LANGUAGE, PREFERRED_NAME,
  PREFERRED_PHARMACY, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME, PRIMARY_INSURANCE, PRIMARY_PROVIDER, PROVIDER, PULSE_TEXT, REFERRING_PROVIDER,
  REGISTRATION_DATE, RELATIONSHIP, RESPIRATORY_RATE_TEXT, ROLE, ROLE_NAME, ROUTING_NO_VALIDATION_MESSAGE, ROUTING_NUMBER, SECONDARY_INSURANCE,
  SERVICE_CODE, SERVICE_FEE_CHARGE, SERVICE_NAME_TEXT, SEX_AT_BIRTH, SPECIALTY, SPECIMEN_FIELD_VALIDATION_MESSAGE, SSN_REGEX, SSN_VALIDATION_MESSAGE,
  START_TIME, STATE, STREET_ADDRESS, STRING_REGEX, SUFFIX, SYSTEM_ROLES, TAXONOMY_CODE, TAXONOMY_CODE_REGEX, TAXONOMY_VALIDATION_MESSAGE, TAX_ID, TEMPERATURE_TEXT,
  TEST_FIELD_VALIDATION_MESSAGE, TID_REGEX, TID_VALIDATION_MESSAGE, TIME_ZONE_TEXT, TITLE, UPIN_REGEX, UPIN_VALIDATION_MESSAGE, USUAL_OCCUPATION,
  USUAL_PROVIDER_ID, US_BANK_ACCOUNT_REGEX, US_ROUTING_NUMBER_REGEX, ValidMessage, ValidOTP, WEIGHT_TEXT, ZIP_CODE, ZIP_REGEX, ZIP_VALIDATION_MESSAGE
} from "../constants";
import { SelectorOption } from "../interfacesTypes";
import { checkNpi, dateValidation, invalidMessage, requiredMessage, timeValidation, tooLong, tooShort } from "../utils";

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
const npiSchema = {
  npi: yup.string().required()
    .test('', NPI_MESSAGE, value => value ? checkNpi(value) : false)
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
}).test('', requiredMessage(label), (multiValue) => isRequired ? !!multiValue?.value && !!multiValue?.label : true).nullable();

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

export const contactSchema = {
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
  ...npiSchema,
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
  ...npiSchema,
  ...upinSchema,
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
  name: yup.string()
    .required(requiredMessage(SERVICE_NAME_TEXT))
    .min(2, MinLength(SERVICE_NAME_TEXT, 3)).max(26, MaxLength(SERVICE_NAME_TEXT, 50)),
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
    name: yup.string(),
    id: yup.string()
  }),
};

export const guardianPatientSchema = {
  guardianSuffix: yup.string(),
  guardianLastName: yup.string(),
  guardianFirstName: yup.string(),
  guardianMiddleName: yup.string(),
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
  basicEmail: optionalEmailSchema(isOptional),
  basicMobile: notRequiredPhone(PHONE_NUMBER),
  basicPhone: notRequiredPhone(MOBILE_NUMBER),
  ...(isSuperAdminOrPracticeAdmin ? { facilityId: selectorSchema(FACILITY) } : {}),
  ...(isDoctor ? {} : { usualProviderId: selectorSchema(USUAL_PROVIDER_ID) }),
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
  name: nameSchema(PRACTICE_NAME),
  city: notRequiredStringOnly(CITY),
  address2: addressValidation(ADDRESS, false),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

export const createPracticeSchema = yup.object({
  ...registerUserSchema,
  ...practiceFacilitySchema,
  facilityName: nameSchema(FACILITY_NAME),
  address: addressValidation(ADDRESS, true),
  ...npiSchema,
  taxId: requiredMatches(TAX_ID, TID_VALIDATION_MESSAGE, TID_REGEX),
  taxonomyCodeId: selectorSchema(TAXONOMY_CODE, false),
})

export const updatePracticeSchema = yup.object({
  ...practiceFacilitySchema,
  ...npiSchema,
  taxId: yup.string().required(),
  taxonomyCodeId: selectorSchema(TAXONOMY_CODE, false),
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
    .test('', invalidMessage(DESCRIPTION), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false)
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
  otherRelation: otherRelationSchema(isOtherRelation),
})

export const updatePatientProviderRelationSchema = (isOtherRelation: boolean) => yup.object({
  otherRelation: otherRelationSchema(isOtherRelation),
})
export const createCopaySchema = yup.object({
  copayType: selectorSchema(COPAY_TYPE),
  amount: yup.number().typeError(requiredMessage(AMOUNT))
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
  attachmentName: yup.string()
    .required(requiredMessage(DOCUMENT_NAME))
    .test('', invalidMessage(DOCUMENT_NAME), value => value ? NO_WHITE_SPACE_REGEX.test(value) : false),
  comments: yup.string(),
  // provider: selectorSchema(PROVIDER),
  documentType: selectorSchema(DOCUMENT_TYPE),
  date: yup.string().required(requiredMessage(DATE)),
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
  statusName: yup.string()
    .required(requiredMessage(CLAIM_STATUS))
})


export const feeScheduleSchema = yup.object({
  practiceId: selectorSchema(PRACTICE),
  name: yup.string().required(requiredMessage(NAME)),
})

export const cptFeeScheduleSchema = yup.object({
  description: yup.string(),
  shortDescription: yup.string(),
  code: selectorSchema(CPT_CODE_PROCEDURE_CODE),
  serviceFee: yup.string().required(requiredMessage(SERVICE_FEE_CHARGE)),
})

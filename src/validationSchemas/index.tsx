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
  PRIMARY_INSURANCE, SECONDARY_INSURANCE, ISSUE_DATE, REGISTRATION_DATE, START_TIME, END_TIME, UPIN_REGEX,
  APPOINTMENT, DECEASED_DATE, EXPIRATION_DATE, PREFERRED_PHARMACY, ZIP_VALIDATION_MESSAGE, EIN_VALIDATION_MESSAGE,
  UPIN_VALIDATION_MESSAGE, PRACTICE_NAME, PRACTICE, OLD_PASSWORD, ROLE_NAME, STRING_REGEX, MIDDLE_NAME,
  SERVICE_NAME_TEXT, DOB, OTP_CODE, FORM_NAME, ValidOTP, ALLERGY_DATE_VALIDATION_MESSAGE, REACTIONS_VALIDATION_MESSAGE,
  PAGER, BLOOD_PRESSURE_TEXT, FEVER_TEXT, HEAD_CIRCUMFERENCE, HEIGHT_TEXT, OXYGEN_SATURATION_TEXT, PAIN_TEXT, PULSE_TEXT, RESPIRATORY_RATE_TEXT, WEIGHT_TEXT
} from "../constants";

const notRequiredMatches = (message: string, regex: RegExp) => {
  return yup.string()
    .test(
      '', message, value => {
        if (!value) {
          return true
        }

        return regex.test(value)
      })
}

const requiredMatches = (label: string, message: string, regex: RegExp) => {
  return yup.string()
    .test('', requiredMessage(label), value => !!value)
    .test(
      '', message, value => regex.test(value || ''))
}

const notRequiredStringOnly = (label: string) => {
  return yup.string()
    .test(
      '', invalidMessage(label), value => {
        if (!value) {
          return true
        }

        return STRING_REGEX.test(value)
      })
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
    .test(
      '', MinLength(label, 10), value => {
        if (!value) {
          return true
        }

        return !!value && value.length >= 10
      })
}

const notRequiredOTP = (label: string, isRequired: boolean) => {
  return yup.string()
    .test('', requiredMessage(label), value => isRequired ? !!value : true)
    .matches(NUMBER_REGEX, ValidOTP())
    .min(6, MinLength(label, 6)).max(6, MaxLength(label, 6))
    .required(requiredMessage(label))
}

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

const roleTypeSchema = {
  roleType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(ROLE), ({ id }) => !!id
  )
}

const patientIdSchema = {
  patientId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(PATIENT), (patient) => !!patient?.id
  ).nullable()
}

const serviceCodeSchema = {
  serviceCode: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(SERVICE_CODE))
}

const practiceTypeSchema = {
  practiceType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(PRACTICE_TYPE))
}

const timeZoneSchema = {
  timeZone: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(TIME_ZONE_TEXT))
}

const genderSchema = {
  gender: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(GENDER), ({ id }) => !!id
  )
}

const usualProviderSchema = {
  usualProviderId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(USUAL_PROVIDER_ID), ({ id }) => !!id
  )
}

const practiceIdSchema = {
  practice: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(PRACTICE), ({ id }) => !!id
  )
}

const providerIdSchema = () => {
  return yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(PROVIDER), ({ id, name }) => !!id && !!name
  )
}

const facilityIdSchema = {
  facilityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(FACILITY), ({ id }) => !!id
  )
}

const specialtySchema = {
  speciality: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }),
}

const serviceIdSchema = {
  serviceId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(APPOINTMENT), ({ id }) => !!id
  )
}

const passwordAndRepeatPasswordSchema = {
  password: yup.string().required(requiredMessage(PASSWORD))
    .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),

  repeatPassword: yup.string().oneOf([yup.ref("password"), null], PASSWORDS_MUST_MATCH)
    .required(CONFIRM_YOUR_PASSWORD),
}

const deaDateSchema = {
  deaActiveDate: yup.string().test(value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),

  deaTermDate: yup.string().test((value, { parent: { deaActiveDate } }) => {
    if (!value) return true

    return dateValidation(value, deaActiveDate)
  })
}

const licenseDateSchema = {
  licenseActiveDate: yup.string().test(value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),

  licenseTermDate: yup.string().test((value, { parent: { licenseActiveDate } }) => {
    if (!value) return true

    return dateValidation(value, licenseActiveDate)
  })
}

const scheduleTimeSchema = {
  startAt: yup.string().test('', invalidMessage(START_TIME), value => !!value),

  endAt: yup.string().test('', invalidMessage(END_TIME), (value, { parent: { startAt } }) => {
    if (!value) return false

    return timeValidation(value, startAt)
  })
}

const facilityTimeSchema = {
  startTime: yup.string().test('', invalidMessage(START_TIME), value => !!value),

  endTime: yup.string().test('', invalidMessage(END_TIME), (value, { parent: { startTime } }) => {
    if (!value) return false

    return timeValidation(value, startTime)
  })
}

const patientRegisterDateSchema = {
  registrationDate: yup.string().test('', invalidMessage(REGISTRATION_DATE), value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),

  deceasedDate: yup.string().test('', invalidMessage(DECEASED_DATE), (value, { parent: { registrationDate } }) => {
    if (!value) return true

    return dateValidation(value, registrationDate)
  })
}

const patientStatementDateSchema = {
  statementNoteDateFrom: yup.string().test('', invalidMessage(ISSUE_DATE), value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),

  statementNoteDateTo: yup.string().test('', invalidMessage(EXPIRATION_DATE), (value, ctx) => {
    if (!value) return true

    return new Date(value || '') >= new Date(ctx.parent.statementNoteDateFrom)
  })
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
  country: countrySchema(false),
  phone: notRequiredPhone(PHONE),
  pager: notRequiredPhone(PAGER),
  mobile: notRequiredPhone(MOBILE),
  city: notRequiredStringOnly(CITY),
  address: addressValidation(ADDRESS, false),
  address2: addressValidation(ADDRESS, false),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
};

export const basicContactSchema = {
  basicState: stateSchema(true),
  basicCountry: countrySchema(true),
  basicCity: requiredStringOnly(CITY, 2, 20),
  basicMobile: notRequiredPhone(MOBILE_NUMBER),
  basicAddress: addressValidation(ADDRESS, true),
  basicAddress2: addressValidation(ADDRESS, false),
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  basicZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  basicPhone: yup.string().min(10, MinLength(PHONE_NUMBER, 10)).max(15, MaxLength(PHONE_NUMBER, 15))
    .required(requiredMessage(PHONE_NUMBER)),
};

export const basicContactViaAppointmentSchema = {
  basicMobile: notRequiredPhone(MOBILE_NUMBER),
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  basicPhone: yup.string().min(10, MinLength(PHONE_NUMBER, 10)).max(15, MaxLength(PHONE_NUMBER, 15))
    .required(requiredMessage(PHONE_NUMBER)),
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
  ...facilityIdSchema,
  ...serviceCodeSchema
})

const staffBasicSchema = {
  ...genderSchema,
  ...facilityIdSchema,
  ...firstLastNameSchema,
  phone: notRequiredPhone(PHONE),
  mobile: notRequiredPhone(MOBILE),
  dob: yup.string().required(requiredMessage(DOB)),
}

export const createStaffSchema = yup.object({
  ...emailSchema,
  ...roleTypeSchema,
  ...staffBasicSchema,
  // providerIds: providerIdSchema(),
})

export const updateStaffSchema = yup.object({
  ...emailSchema,
  ...staffBasicSchema,
})

const facilityBasicSchema = {
  ...npiSchema,
  ...contactSchema,
  ...timeZoneSchema,
  ...serviceCodeSchema,
  ...mammographySchema,
  ...cliaIdNumberSchema,
  ...practiceTypeSchema,
  ...federalTaxIdSchema,
  ...tamxonomyCodeSchema,
  ...billingAddressSchema,
  name: yup.string().required(requiredMessage(PRACTICE_NAME))
}

const facilitySchedulerBasicSchema = {
  ...npiSchema,
  ...contactSchema,
  ...timeZoneSchema,
  ...serviceCodeSchema,
  ...mammographySchema,
  ...cliaIdNumberSchema,
  ...federalTaxIdSchema,
  ...tamxonomyCodeSchema,
  ...billingAddressSchema,
  ...facilityTimeSchema,
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
  ...practiceIdSchema,
  ...facilitySchedulerBasicSchema,
})

export const basicDoctorSchema = {
  ...ssnSchema,
  ...npiSchema,
  ...upinSchema,
  ...deaDateSchema,
  ...specialtySchema,
  ...facilityIdSchema,
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
  ...facilityIdSchema,
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
  sexAtBirth: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(SEX_AT_BIRTH)),
  suffix: notRequiredStringOnly(SUFFIX),
  middleName: notRequiredStringOnly(MIDDLE_NAME),
  language: notRequiredStringOnly(LANGUAGE_SPOKEN),
  prefferedName: notRequiredStringOnly(PREFERRED_NAME),
  previouslastName: notRequiredStringOnly(PREVIOUS_LAST_NAME),
  motherMaidenName: notRequiredStringOnly(MOTHERS_MAIDEN_NAME),
  previousFirstName: notRequiredStringOnly(PREVIOUS_FIRST_NAME),
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
  guarantorSuffix: notRequiredStringOnly(SUFFIX),
  guarantorAddress: addressValidation(ADDRESS, true),
  guarantorEmployerName: notRequiredStringOnly(NAME),
  guarantorAddress2: addressValidation(ADDRESS, false),
  guarantorMiddleName: notRequiredStringOnly(MIDDLE_NAME),
  guarantorSsn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX),
  guarantorEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  guarantorPhone: yup.string().min(10, MinLength(PHONE_NUMBER, 10))
    .max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  guarantorZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE)
    .required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  guarantorCity: yup.string().matches(STRING_REGEX, ValidMessage(ADDRESS))
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

export const extendedPatientSchema = yup.object({
  ...genderSchema,
  ...PatientSchema,
  ...facilityIdSchema,
  ...kinPatientSchema,
  ...basicContactSchema,
  ...usualProviderSchema,
  ...employerPatientSchema,
  ...guardianPatientSchema,
  ...emergencyPatientSchema,
  ...guarantorPatientSchema,
})

export const extendedEditPatientSchema = yup.object({
  ...genderSchema,
  ...PatientSchema,
  ...kinPatientSchema,
  ...basicContactSchema,
  ...employerPatientSchema,
  ...guardianPatientSchema,
  ...emergencyPatientSchema,
  ...guarantorPatientSchema,
})

export const extendedPatientAppointmentSchema = yup.object({
  ...PatientSchema,
  ...basicContactViaAppointmentSchema,
})

export const settingSchema = yup.object({
  ...facilityIdSchema,
  ...timeZoneSchema
})

export const appointmentSchema = yup.object({
  ...patientIdSchema,
  ...serviceIdSchema,
  notes: yup.string(),
  primaryInsurance: notRequiredStringOnly(PRIMARY_INSURANCE),
  secondaryInsurance: notRequiredStringOnly(SECONDARY_INSURANCE),
})

export const doctorScheduleSchema = yup.object({
  ...serviceIdSchema,
  ...scheduleTimeSchema,
  day: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(DAY), ({ id }) => !!id),
})

export const externalAppointmentSchema = yup.object({
  ...dobSchema,
  ...emailSchema,
  ...serviceIdSchema,
  ...firstLastNameSchema,
})

export const externalPatientSchema = yup.object({
  ...ssnSchema,
  state: stateSchema(true),
  country: countrySchema(true),
  phone: notRequiredPhone(PHONE),
  providerId: providerIdSchema(),
  emergencyState: stateSchema(false),
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
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
}

export const createPracticeSchema = yup.object({
  ...registerUserSchema,
  ...practiceFacilitySchema,
  address: addressValidation(ADDRESS, true),
  name: yup.string().required(requiredMessage(PRACTICE_NAME)),
  facilityName: yup.string().required(requiredMessage(NAME)),
})

export const updatePracticeSchema = yup.object({
  ...practiceFacilitySchema
})

export const updatePasswordSchema = yup.object({
  ...passwordAndRepeatPasswordSchema,
  oldPassword: yup.string().required(requiredMessage(OLD_PASSWORD))
    .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
})

export const roleSchema = yup.object({
  role: yup.string().required(requiredMessage(ROLE_NAME))
})

export const createFormBuilderSchemaWithFacility = yup.object({
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
  type: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', 'required', ({ id }) => !!id),
  facilityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', 'required', ({ id }) => !!id),
});

export const createFormBuilderSchema = yup.object({
  name: yup.string().min(3, MinLength(FORM_NAME, 3))
    .max(250, MaxLength(FORM_NAME, 250)).required(),
  type: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', 'required', ({ id }) => !!id),
});

export const facilityScheduleSchema = yup.object({
  ...scheduleTimeSchema,
  day: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', requiredMessage(DAY), ({ id }) => !!id),
})

const otpBasicSchema = {
  otpCode: notRequiredOTP(OTP_CODE, true),
}

export const otpSchema = yup.object({
  ...otpBasicSchema,
})

export const createPatientAllergySchema = (onset: string) => yup.object({
  allergyStartDate: yup.string().test('', ALLERGY_DATE_VALIDATION_MESSAGE,
    value => !!onset || new Date(value || '') <= new Date()),
  severityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test('', 'required', ({ id }) => !!id),
  reactionIds: yup.array().of(
    yup.object().shape({
      label: yup.string(),
      value: yup.string()
    })
  ).test('', REACTIONS_VALIDATION_MESSAGE, (value: any) => value && value.length > 0)
})

export const patientProblemSchema = yup.object({
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
  bloodPressure: yup.string().test('', invalidMessage(BLOOD_PRESSURE_TEXT), value => {
    if (!value) return true
    else {
      if (value && value.match(/^\d[0-9]{1,1}\/\d[0-9]{1,2}$/)) return true
      return false
    }
  }),
  respiratoryRate: yup.string().test('', invalidMessage(RESPIRATORY_RATE_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 4) return true
      return false
    }
  }),
  oxygenSaturation: yup.string().test('', invalidMessage(OXYGEN_SATURATION_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 4) return true
      return false
    }
  }),
  PatientHeight: yup.string().test('', invalidMessage(HEIGHT_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 6) return true
      return false
    }
  }),
  PatientWeight: yup.string().test('', invalidMessage(WEIGHT_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 5) return true
      return false
    }
  }),
  PainRange: yup.string().test('', invalidMessage(PAIN_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 3) return true
      return false
    }
  }),
  patientHeadCircumference: yup.string().test('', invalidMessage(HEAD_CIRCUMFERENCE), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 5) return true
      return false
    }
  }),
  patientTemperature: yup.string().test('', invalidMessage(FEVER_TEXT), value => {
    if (!value) return true
    else {
      if (value && (value.includes('-') || value === '0')) return false
      if (value && value.length > 0 && value.length < 4) return true
      return false
    }
  }),
})
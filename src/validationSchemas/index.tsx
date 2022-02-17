// packages block
import * as yup from "yup";
import moment from "moment";
// utils and constants block
import { dateValidation, invalidMessage, requiredMessage, timeValidation } from "../utils";
import {
  ADDRESS, ALPHABETS_REGEX, CITY, CONFIRM_YOUR_PASSWORD, COUNTRY, EMAIL, MaxLength, MinLength,
  FACILITY, FIRST_NAME, GENDER, INVALID_EMAIL, LAST_NAME, PASSWORDS_MUST_MATCH, PASSWORD_LABEL,
  MOBILE_NUMBER, NAME, NUMBER_REGEX, PASSWORD, DOB_VALIDATION_MESSAGE, APPOINTMENT_TYPE,
  PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE_NUMBER, PRACTICE_TYPE,
  DURATION, PRICE, ROLE, SERVICE_CODE, STATE, ValidMessage, ZIP_CODE, USUAL_PROVIDER_ID,
  NPI_REGEX, NPI_VALIDATION_MESSAGE, CLIA_REGEX, CLIA_VALIDATION_MESSAGE,
  REVENUE_CODE_REGEX, REVENUE_CODE_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX,
  TAXONOMY_VALIDATION_MESSAGE, TIME_ZONE_TEXT, RELATIONSHIP, TID_VALIDATION_MESSAGE,
  TID_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX,
  FACILITY_CODE_VALIDATION_MESSAGE, FACILITY_CODE_REGEX, CODE, SSN_REGEX, SSN_VALIDATION_MESSAGE,
  ZIP_REGEX, ZIP_VALIDATION_MESSAGE, SEX_AT_BIRTH, PATIENT, PROVIDER, SERVICE, DAY, LOCATION,
  STRING_REGEX, MIDDLE_NAME, PREFERRED_NAME, PREVIOUS_FIRST_NAME,
  MOTHERS_MAIDEN_NAME, PREVIOUS_LAST_NAME, LANGUAGE_SPOKEN, SUFFIX, INDUSTRY, USUAL_OCCUPATION,
  PRIMARY_INSURANCE, SECONDARY_INSURANCE, INSURANCE_PLAN_TYPE, FAX, PHONE, MOBILE,
  MAX_DOCTOR_DOB_VALIDATION_MESSAGE, MIN_DOCTOR_DOB_VALIDATION_MESSAGE, ISSUE_DATE, REGISTRATION_DATE, DECEASED_DATE, EXPIRATION_DATE,
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

const requiredStringOnly = (label: string, min: number, max: number) => {
  return yup.string()
    .test('', requiredMessage(label), value => !!value)
    .test('', invalidMessage(label), value => value ? STRING_REGEX.test(value) : false)
    .test('', MinLength(label, min), value => value ? value.length >= min : false)
    .test('', MaxLength(label, max), value => value ? value.length <= max : false)
}

const notRequiredPhone = (label: string) => {
  return yup.string()
    .test(
      '', MinLength(label, 11), value => {
        if (!value) {
          return true
        }

        return !!value && value.length >= 11
      })
}

const npiSchema = { npi: notRequiredMatches(NPI_VALIDATION_MESSAGE, NPI_REGEX) }
const ssnSchema = { ssn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX) }
const passwordSchema = { password: yup.string().required(requiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)) }
const federalTaxIdSchema = { federalTaxId: notRequiredMatches(TID_VALIDATION_MESSAGE, TID_REGEX) }
const cliaIdNumberSchema = { cliaIdNumber: notRequiredMatches(CLIA_VALIDATION_MESSAGE, CLIA_REGEX) }
const taxonomyCodeSchema = { taxonomyCode: notRequiredMatches(TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX) }
const revenueCodeSchema = { revenueCode: notRequiredMatches(REVENUE_CODE_VALIDATION_MESSAGE, REVENUE_CODE_REGEX) }
const tamxonomyCodeSchema = { tamxonomyCode: notRequiredMatches(TAXONOMY_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX) }
const mammographySchema = {
  mammographyCertificationNumber: notRequiredMatches(MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX)
}

const facilityCodeSchema = {
  code: yup.string().matches(FACILITY_CODE_REGEX, FACILITY_CODE_VALIDATION_MESSAGE)
    .required(requiredMessage(CODE))
}

const dobSchema = {
  dob: yup.string().test('', DOB_VALIDATION_MESSAGE,
    value => new Date(value || '') <= new Date() && moment().diff(moment(value), 'years') < 100)
}

const doctorDobSchema = {
  dob: yup.string()
    .test('', MIN_DOCTOR_DOB_VALIDATION_MESSAGE,
      value => moment().diff(moment(value), 'years') >= 20)
    .test('', MAX_DOCTOR_DOB_VALIDATION_MESSAGE,
      value => moment().diff(moment(value), 'years') < 100)
}

const roleTypeSchema = {
  roleType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(ROLE))
}

const patientIdSchema = {
  patientId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(PATIENT))
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
  }).required(requiredMessage(GENDER))
}

const usualProviderSchema = {
  usualProviderId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(USUAL_PROVIDER_ID), ({ id }) => !!id
  )
}

const providerIdSchema = {
  providerId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(PROVIDER))
}

const facilityIdSchema = {
  facilityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).test(
    '', requiredMessage(FACILITY), ({ id }) => !!id
  )
}

const ssnTypeSchema = {
  ssnType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }),
};

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
  }).required(requiredMessage(SERVICE)),
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
  startAt: yup.string().test(value => !!value),

  endAt: yup.string().test((value, { parent: { startAt } }) => {
    if (!value) return false

    return timeValidation(value, startAt)
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
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME))
    .min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26))
    .required(requiredMessage(LAST_NAME)),

  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME))
    .min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26))
    .required(requiredMessage(FIRST_NAME)),
};

export const loginValidationSchema = yup.object({
  ...emailSchema,
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
  fax: notRequiredPhone(FAX),
  city: notRequiredStringOnly(CITY),
  state: notRequiredStringOnly(STATE),
  address: notRequiredStringOnly(ADDRESS),
  country: notRequiredStringOnly(COUNTRY),
  address2: notRequiredStringOnly(ADDRESS),
  zipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
  phone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)),
};

export const basicContactSchema = {
  basicMobile: notRequiredPhone(MOBILE_NUMBER),
  basicCity: requiredStringOnly(CITY, 2, 20),
  basicState: requiredStringOnly(STATE, 2, 15),
  basicAddress2: notRequiredStringOnly(ADDRESS),
  basicCountry: requiredStringOnly(COUNTRY, 2, 20),
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  basicZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  basicAddress: yup.string().required(requiredMessage(ADDRESS)).min(4, MinLength(ADDRESS, 4))
    .max(30, MaxLength(ADDRESS, 30)),
  basicPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15))
    .required(requiredMessage(PHONE_NUMBER)),
};

export const billingAddressSchema = {
  billingFax: notRequiredPhone(FAX),
  billingCity: notRequiredStringOnly(CITY),
  billingState: notRequiredStringOnly(STATE),
  billingCountry: notRequiredStringOnly(COUNTRY),
  billingAddress: notRequiredStringOnly(ADDRESS),
  billingAddress2: notRequiredStringOnly(ADDRESS),
  billingEmail: yup.string().email(INVALID_EMAIL),
  billingZipCode: notRequiredMatches(ZIP_VALIDATION_MESSAGE, ZIP_REGEX),
  billingPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)),
}

export const extendedContactSchema = yup.object({
  ...contactSchema,
  ...facilityIdSchema,
  ...serviceCodeSchema
})

const staffBasicSchema = {
  ...dobSchema,
  ...genderSchema,
  ...roleTypeSchema,
  ...facilityIdSchema,
  ...firstLastNameSchema,
  username: yup.string(),
  mobile: yup.string().min(11, MinLength(MOBILE_NUMBER, 11)).max(15, MaxLength(MOBILE_NUMBER, 15)),
  phone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)),
}

export const addStaffSchema = yup.object({
  ...emailSchema,
  ...passwordSchema,
  ...staffBasicSchema,
})

export const updateStaffSchema = yup.object({
  ...emailSchema,
  ...staffBasicSchema,
})

export const facilitySchema = yup.object({
  ...npiSchema,
  ...contactSchema,
  ...timeZoneSchema,
  ...revenueCodeSchema,
  ...serviceCodeSchema,
  ...mammographySchema,
  ...facilityCodeSchema,
  ...cliaIdNumberSchema,
  ...practiceTypeSchema,
  ...federalTaxIdSchema,
  ...tamxonomyCodeSchema,
  ...billingAddressSchema,
  name: yup.string().required(requiredMessage(NAME)),
  insurancePlanType: notRequiredStringOnly(INSURANCE_PLAN_TYPE),
})

export const basicDoctorSchema = {
  ...ssnSchema,
  ...npiSchema,
  ...deaDateSchema,
  ...ssnTypeSchema,
  ...doctorDobSchema,
  ...specialtySchema,
  ...facilityIdSchema,
  ...licenseDateSchema,
  ...taxonomyCodeSchema,
  ...firstLastNameSchema,
  upin: yup.string(),
  taxId: yup.string(),
  prefix: yup.string(),
  suffix: notRequiredStringOnly(SUFFIX),
  deaNumber: yup.string(),
  dpsCtpNumber: yup.string(),
  taxIdStuff: yup.string(),
  stateLicense: yup.string(),
  emcProviderId: yup.string(),
  languagesSpoken: notRequiredStringOnly(LANGUAGE_SPOKEN),
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
  middleName: notRequiredStringOnly(MIDDLE_NAME),
};

export const doctorSchema = yup.object({
  ...basicDoctorSchema,
  ...contactSchema,
  ...billingAddressSchema,
})

export const facilityServicesSchema = {
  ...facilityIdSchema,
  name: yup.string().required(requiredMessage(NAME)),
  price: yup.string().matches(NUMBER_REGEX, ValidMessage(PRICE)).min(2, MinLength(PRICE, 2))
    .max(5, MaxLength(PRICE, 5)).required(requiredMessage(PRICE)),
  duration: yup.string().matches(NUMBER_REGEX, ValidMessage(DURATION)).min(1, MinLength(DURATION, 1))
    .max(3, MaxLength(DURATION, 3)).required(requiredMessage(DURATION)),
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
  emergencyMobile: notRequiredPhone(MOBILE_NUMBER),
  emergencyName: notRequiredStringOnly(NAME),
  employerUsualOccupation: notRequiredStringOnly(USUAL_OCCUPATION),
  employerIndustry: notRequiredStringOnly(INDUSTRY),
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
  guarantorSuffix: notRequiredStringOnly(SUFFIX),
  guarantorCountry: notRequiredStringOnly(COUNTRY),
  guarantorAddress2: notRequiredStringOnly(ADDRESS),
  guarantorEmployerName: notRequiredStringOnly(NAME),
  guarantorSsn: notRequiredMatches(SSN_VALIDATION_MESSAGE, SSN_REGEX),
  guarantorMiddleName: notRequiredStringOnly(MIDDLE_NAME),
  guarantorEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  guarantorAddress: yup.string().matches(STRING_REGEX, ValidMessage(ADDRESS)).required(requiredMessage(ADDRESS)),
  guarantorPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11))
    .max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  guarantorZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE)
    .required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  guarantorCity: yup.string().matches(STRING_REGEX, ValidMessage(ADDRESS))
    .required(requiredMessage(CITY)).min(2, MinLength(CITY, 2)).max(20, MaxLength(CITY, 20)),
  guarantorState: yup.string().matches(STRING_REGEX, ValidMessage(ADDRESS))
    .required(requiredMessage(STATE)).min(2, MinLength(STATE, 2)).max(15, MaxLength(STATE, 15)),
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

export const settingSchema = yup.object({
  ...facilityIdSchema,
  ...timeZoneSchema
})

export const appointmentSchema = yup.object({
  ...patientIdSchema,
  ...serviceIdSchema,
  ...providerIdSchema,
  ...facilityIdSchema,
  notes: yup.string(),
  primaryInsurance: notRequiredStringOnly(PRIMARY_INSURANCE),
  secondaryInsurance: notRequiredStringOnly(SECONDARY_INSURANCE),
})

export const doctorScheduleSchema = yup.object({
  ...scheduleTimeSchema,
  day: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(DAY)),
  locationId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(LOCATION)),
  servicesIds: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(APPOINTMENT_TYPE)),
})

export const externalAppointmentSchema = yup.object({
  ...dobSchema,
  ...emailSchema,
  ...serviceIdSchema,
  ...providerIdSchema,
  ...firstLastNameSchema,
})
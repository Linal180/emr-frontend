// packages block
import * as yup from "yup";
import moment from "moment";
// utils and constants block
import { requiredMessage } from "../utils";
import {
  ADDRESS, ADDRESS_2, ALPHABETS_REGEX, CITY, CLIA_ID_NUMBER, CODE, CONFIRM_YOUR_PASSWORD, COUNTRY, EMAIL,
  FACILITY, FAX, FEDERAL_TAX_ID, FIRST_NAME, GENDER, INSURANCE_PLAN_TYPE, INVALID_EMAIL, LAST_NAME,
  MAMMOGRAPHY_CERTIFICATION_NUMBER, MaxLength, MinLength, MOBILE_NUMBER, NAME, NPI, NUMBER_REGEX,
  PASSWORD, PASSWORDS_MUST_MATCH, PASSWORD_LABEL, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE_NUMBER,
  PRACTICE_TYPE, MIDDLE_NAME, DURATION, PRICE, REVENUE_CODE, ROLE, SERVICE_CODE, STATE, TAMXONOMY_CODE,
  ValidMessage, ZIP_CODE, PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, SPECIALTY, SSN, SSN_TYPE,
  DEA_NUMBER, LANGUAGE_SPOKEN, TAX_ID, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  CHAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE, ANESTHESIA_LICENSE, CTP_NUMBER,
  STATE_LICENSE, PRESCRIPTIVE_AUTH_NUMBER, EMPLOYER_NAME, USUAL_INDUSTRY, PREVIOUS_LAST_NAME, USUAL_PROVIDER_ID,
  MOTHERS_MAIDEN_NAME, PREVIOUS_FIRST_NAME, RELATIONSHIP, USUAL_OCCUPATION, NPI_REGEX, NPI_VALIDATION_MESSAGE,
  CLIA_REGEX, CLIA_VALIDATION_MESSAGE, REVENUE_CODE_REGEX, REVENUE_CODE_VALIDATION_MESSAGE, TAXONOMY_CODE,
  TAXONOMY_CODE_REGEX, TAXONOMY_VALIDATION_MESSAGE, TIME_ZONE_TEXT,
} from "../constants";

const passwordSchema = { password: yup.string().required(requiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)) };
const npiSchema = { npi: yup.string().matches(NPI_REGEX, NPI_VALIDATION_MESSAGE) }
const cliaIdNumberSchema = {
  cliaIdNumber: yup.string().required(requiredMessage(CLIA_ID_NUMBER))
    .matches(CLIA_REGEX, CLIA_VALIDATION_MESSAGE)
}

const revenueCodeSchema = {
  revenueCode: yup.string().matches(REVENUE_CODE_REGEX, REVENUE_CODE_VALIDATION_MESSAGE).notRequired()
}

const taxonomyCodeSchema = {
  taxonomyCode: yup.string().matches(TAXONOMY_CODE_REGEX, TAXONOMY_VALIDATION_MESSAGE)
}

const dobSchema = {
  dob: yup.string().test(value => new Date(value || '') <= new Date() && moment().diff(moment(value), 'years') < 100)
}

const doctorDobSchema = {
  dob: yup.string().test(value => moment().diff(moment(value), 'years') > 20 && moment().diff(moment(value), 'years') < 100)
}

const roleTypeSchema = {
  roleType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(ROLE))
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
  }).required(requiredMessage(USUAL_PROVIDER_ID))
}

const facilityIdSchema = {
  facilityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(FACILITY))
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

  deaTermDate: yup.string().test((value, ctx) => {
    if (!value) return true
    return new Date(value || '') >= new Date() && new Date(value || '') >= new Date(ctx.parent.deaActiveDate)
  })
}

const licenseDateSchema = {
  licenseActiveDate: yup.string().test(value => {
    if (!value) return true
    return new Date(value || '') <= new Date()
  }),

  licenseTermDate: yup.string().test((value, ctx) => {
    if (!value) return true
    return new Date(value || '') >= new Date() && new Date(value || '') >= new Date(ctx.parent.licenseActiveDate)
  })
}

const patientRegisterDateSchema = {
  registrationDate: yup.string().test(value => {
    if (!value) return true
    return new Date(value || '') <= new Date()
  }),

  deceasedDate: yup.string().test((value, ctx) => {
    if (!value) return true
    return new Date(value || '') <= new Date() && new Date(value || '') >= new Date(ctx.parent.registrationDate)
  })
}

const patientStatementDateSchema = {
  statementNoteDateFrom: yup.string().test(value => new Date(value || '') <= new Date()),
  statementNoteDateTo: yup.string().test((value, ctx) => {
    if (!value) return true
    return new Date(value || '') > new Date(ctx.parent.statementNoteDateFrom)
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
  fax: yup.string(),
  city: yup.string(),
  state: yup.string(),
  address: yup.string(),
  country: yup.string(),
  zipCode: yup.string(),
  address2: yup.string(),
  phone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)),
};

export const billingAddressSchema = {
  billingFax: yup.string(),
  billingCity: yup.string(),
  billingState: yup.string(),
  billingCountry: yup.string(),
  billingAddress: yup.string(),
  billingZipCode: yup.string(),
  billingAddress2: yup.string(),
  billingEmail: yup.string().email(INVALID_EMAIL),
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
  ...cliaIdNumberSchema,
  ...practiceTypeSchema,
  ...billingAddressSchema,
  name: yup.string().required(requiredMessage(NAME)),
  code: yup.string().required(requiredMessage(CODE)),
  federalTaxId: yup.string().required(requiredMessage(FEDERAL_TAX_ID)),
  tamxonomyCode: yup.string().required(requiredMessage(TAMXONOMY_CODE)),
  insurancePlanType: yup.string().required(requiredMessage(INSURANCE_PLAN_TYPE)),
  mammographyCertificationNumber: yup.string().required(requiredMessage(MAMMOGRAPHY_CERTIFICATION_NUMBER)),
})

export const basicDoctorSchema = {
  ...npiSchema,
  ...deaDateSchema,
  ...ssnTypeSchema,
  ...doctorDobSchema,
  ...specialtySchema,
  ...facilityIdSchema,
  ...licenseDateSchema,
  ...taxonomyCodeSchema,
  ...firstLastNameSchema,
  ssn: yup.string(),
  upin: yup.string(),
  taxId: yup.string(),
  prefix: yup.string(),
  suffix: yup.string(),
  deaNumber: yup.string(),
  dpsCtpNumber: yup.string(),
  taxIdStuff: yup.string(),
  stateLicense: yup.string(),
  emcProviderId: yup.string(),
  languagesSpoken: yup.string(),
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
  middleName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MIDDLE_NAME)).min(3, MinLength(MIDDLE_NAME, 3)).max(26, MaxLength(MIDDLE_NAME, 26)),
};

export const doctorSchema = yup.object({
  ...basicDoctorSchema,
  ...contactSchema,
  ...billingAddressSchema,
})

export const facilityServicesSchema = {
  ...facilityIdSchema,
  duration: yup.string().required(requiredMessage(DURATION)),
  name: yup.string().required(requiredMessage(NAME)),
  price: yup.string().matches(NUMBER_REGEX, ValidMessage(PRICE)).min(1, MinLength(PRICE, 1)).max(15, MaxLength(PRICE, 15)).required(requiredMessage(PRICE)),
};

export const serviceSchema = yup.object({
  ...facilityServicesSchema,
})

export const PatientSchema = {
  ...dobSchema,
  ...patientRegisterDateSchema,
  ...patientStatementDateSchema,
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
  middleName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MIDDLE_NAME)).min(3, MinLength(MIDDLE_NAME, 3)).max(26, MaxLength(MIDDLE_NAME, 26)),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  prefferedName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  previousFirstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(PREVIOUS_FIRST_NAME)).min(3, MinLength(PREVIOUS_FIRST_NAME, 3)).max(26, MaxLength(PREVIOUS_FIRST_NAME, 26)).required(requiredMessage(PREVIOUS_FIRST_NAME)),
  motherMaidenName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MOTHERS_MAIDEN_NAME)).min(3, MinLength(MOTHERS_MAIDEN_NAME, 3)).max(26, MaxLength(MOTHERS_MAIDEN_NAME, 26)).required(requiredMessage(MOTHERS_MAIDEN_NAME)),
  previouslastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(PREVIOUS_LAST_NAME)).min(3, MinLength(PREVIOUS_LAST_NAME, 3)).max(26, MaxLength(PREVIOUS_LAST_NAME, 26)).required(requiredMessage(PREVIOUS_LAST_NAME)),
  language: yup.string().required(requiredMessage(LANGUAGE_SPOKEN)),
  sexAtBirth: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(LANGUAGE_SPOKEN)),
  suffix: yup.string().required(requiredMessage(SUFFIX)),
  ssn: yup.string().required(requiredMessage(SSN)),
};

export const basicContactSchema = {
  basicPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  basicMobile: yup.string().min(11, MinLength(MOBILE_NUMBER, 11)).max(15, MaxLength(MOBILE_NUMBER, 15)).required(requiredMessage(MOBILE_NUMBER)),
  basicAddress: yup.string().required(requiredMessage(ADDRESS)),
  basicAddress2: yup.string().required(requiredMessage(ADDRESS_2)),
  basicZipCode: yup.string().required(requiredMessage(ZIP_CODE)),
  basicCity: yup.string().required(requiredMessage(CITY)),
  basicCountry: yup.string().required(requiredMessage(COUNTRY)),
  basicState: yup.string().required(requiredMessage(STATE)),
};

export const emergencyPatientSchema = {
  employerUsualOccupation: yup.string().required(requiredMessage(USUAL_OCCUPATION)),
  employerIndustry: yup.string().required(requiredMessage(USUAL_INDUSTRY)),
  emergencyName: yup.string().required(requiredMessage(NAME)),
  emergencyPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
};

export const kinPatientSchema = {
  kinName: yup.string().required(requiredMessage(NAME)),
  kinMobile: yup.string().min(11, MinLength(MOBILE_NUMBER, 11)).max(15, MaxLength(MOBILE_NUMBER, 15)).required(requiredMessage(MOBILE_NUMBER)),
  kinRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(RELATIONSHIP)),
  kinPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
};

export const guardianPatientSchema = {
  guardianFirstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
  guardianMiddleName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MIDDLE_NAME)).min(3, MinLength(MIDDLE_NAME, 3)).max(26, MaxLength(MIDDLE_NAME, 26)),
  guardianLastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  guardianSuffix: yup.string().required(requiredMessage(SUFFIX)),
};

export const guarantorPatientSchema = {
  guarantorFirstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
  guarantorMiddleName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MIDDLE_NAME)).min(3, MinLength(MIDDLE_NAME, 3)).max(26, MaxLength(MIDDLE_NAME, 26)),
  guarantorLastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  guarantorEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  guarantorRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(RELATIONSHIP)),
  guarantorPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  guarantorSuffix: yup.string().required(requiredMessage(SUFFIX)),
  guarantorSsn: yup.string().required(requiredMessage(SSN)),
  guarantorAddress: yup.string().required(requiredMessage(ADDRESS)),
  guarantorAddress2: yup.string().required(requiredMessage(ADDRESS_2)),
  guarantorZipCode: yup.string().required(requiredMessage(ZIP_CODE)),
  guarantorCity: yup.string().required(requiredMessage(CITY)),
  guarantorCountry: yup.string().required(requiredMessage(COUNTRY)),
  guarantorEmployerName: yup.string().required(requiredMessage(EMPLOYER_NAME)),
};

export const employerPatientSchema = {
  employerName: yup.string().required(requiredMessage(NAME)),
  employerPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  employerIndustry: yup.string().required(requiredMessage(USUAL_INDUSTRY)),
  employerUsualOccupation: yup.string().required(requiredMessage(USUAL_OCCUPATION)),
};

export const patientsSchema = yup.object({
  ...facilityIdSchema,
  ...genderSchema,
  ...usualProviderSchema,
  ...PatientSchema,
  ...basicContactSchema,
  ...employerPatientSchema,
  ...guarantorPatientSchema,
  ...guardianPatientSchema,
  ...kinPatientSchema,
  ...emergencyPatientSchema
})

export const settingSchema = yup.object({
  ...facilityIdSchema,
  ...timeZoneSchema
})

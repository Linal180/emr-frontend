// packages block
import * as yup from "yup";
import moment from "moment";
// utils and constants block
import { dateValidation, requiredMessage, timeValidation } from "../utils";
import {
  ADDRESS, ALPHABETS_REGEX, CITY, CONFIRM_YOUR_PASSWORD, COUNTRY, EMAIL,
  FACILITY, FIRST_NAME, GENDER, INVALID_EMAIL, LAST_NAME, MaxLength, MinLength,
  MOBILE_NUMBER, NAME, NUMBER_REGEX, PASSWORD, PASSWORDS_MUST_MATCH, PASSWORD_LABEL,
  PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE_NUMBER, PRACTICE_TYPE, MIDDLE_NAME,
  DURATION, PRICE, ROLE, SERVICE_CODE, STATE, ValidMessage, ZIP_CODE, USUAL_PROVIDER_ID,
  NPI_REGEX, NPI_VALIDATION_MESSAGE, CLIA_REGEX, CLIA_VALIDATION_MESSAGE,
  REVENUE_CODE_REGEX, REVENUE_CODE_VALIDATION_MESSAGE, TAXONOMY_CODE_REGEX,
  TAXONOMY_VALIDATION_MESSAGE, TIME_ZONE_TEXT, RELATIONSHIP, TID_VALIDATION_MESSAGE,
  TID_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE, MAMMOGRAPHY_CERT_NUMBER_REGEX,
  FACILITY_CODE_VALIDATION_MESSAGE, FACILITY_CODE_REGEX, CODE, SSN_REGEX, SSN_VALIDATION_MESSAGE,
  ZIP_REGEX, ZIP_VALIDATION_MESSAGE, SEX_AT_BIRTH, PATIENT, PROVIDER, SERVICE, DAY, LOCATION,
   APPOINTMENT_TYPE,
} from "../constants";

const passwordSchema = { password: yup.string().required(requiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)) };
const npiSchema = { npi: yup.string().matches(NPI_REGEX, NPI_VALIDATION_MESSAGE) }
const cliaIdNumberSchema = {
  cliaIdNumber: yup.string().matches(CLIA_REGEX, CLIA_VALIDATION_MESSAGE)
}

const federalTaxIdSchema = {
  federalTaxId: yup.string().matches(TID_REGEX, TID_VALIDATION_MESSAGE),
}

const revenueCodeSchema = {
  revenueCode: yup.string().matches(REVENUE_CODE_REGEX, REVENUE_CODE_VALIDATION_MESSAGE).notRequired()
}

const taxonomyCodeSchema = {
  taxonomyCode: yup.string().matches(TAXONOMY_CODE_REGEX, TAXONOMY_VALIDATION_MESSAGE)
}

const ssnSchema = {
  ssn: yup.string().matches(SSN_REGEX, SSN_VALIDATION_MESSAGE)
}

const facilityCodeSchema = {
  code: yup.string().matches(FACILITY_CODE_REGEX, FACILITY_CODE_VALIDATION_MESSAGE)
    .required(requiredMessage(CODE))
}

const dobSchema = {
  dob: yup.string().test(value => new Date(value || '') <= new Date() && moment().diff(moment(value), 'years') < 100)
}

const doctorDobSchema = {
  dob: yup.string().test(value => moment().diff(moment(value), 'years') > 20 && moment().diff(moment(value), 'years') < 100)
}

const mammographySchema = {
  mammographyCertificationNumber: yup.string().notRequired()
    .matches(MAMMOGRAPHY_CERT_NUMBER_REGEX, MAMMOGRAPHY_VALIDATION_MESSAGE),
};

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
  }).required(requiredMessage(USUAL_PROVIDER_ID))
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
  registrationDate: yup.string().test(value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),

  deceasedDate: yup.string().test((value, { parent: { registrationDate } }) => {
    if (!value) return true

    return dateValidation(value, registrationDate)
  })
}

const patientStatementDateSchema = {
  statementNoteDateFrom: yup.string().test(value => {
    if (!value) return true

    return new Date(value || '') <= new Date()
  }),
  statementNoteDateTo: yup.string().test((value, ctx) => {
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
  ...mammographySchema,
  ...facilityCodeSchema,
  ...cliaIdNumberSchema,
  ...practiceTypeSchema,
  ...federalTaxIdSchema,
  ...billingAddressSchema,
  insurancePlanType: yup.string(),
  name: yup.string().required(requiredMessage(NAME)),
  tamxonomyCode: yup.string().matches(TAXONOMY_CODE_REGEX, TAXONOMY_VALIDATION_MESSAGE),
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
  name: yup.string().required(requiredMessage(NAME)),
  duration: yup.string().matches(NUMBER_REGEX, ValidMessage(DURATION)).min(1, MinLength(DURATION, 1)).max(3, MaxLength(DURATION, 3)).required(requiredMessage(DURATION)),
  price: yup.string().matches(NUMBER_REGEX, ValidMessage(PRICE)).min(2, MinLength(PRICE, 2)).max(5, MaxLength(PRICE, 5)).required(requiredMessage(PRICE)),
};

export const serviceSchema = yup.object({
  ...facilityServicesSchema,
})

export const PatientSchema = {
  ...ssnSchema,
  ...dobSchema,
  ...patientRegisterDateSchema,
  ...patientStatementDateSchema,
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
  middleName: yup.string(),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  prefferedName: yup.string(),
  previousFirstName: yup.string(),
  motherMaidenName: yup.string(),
  previouslastName: yup.string(),
  language: yup.string(),
  sexAtBirth: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(SEX_AT_BIRTH)),
  suffix: yup.string(),
};

export const basicContactSchema = {
  basicEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  basicPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  basicMobile: yup.string(),
  basicAddress: yup.string().required(requiredMessage(ADDRESS)).min(4, MinLength(ADDRESS, 4)).max(30, MaxLength(ADDRESS, 30)),
  basicAddress2: yup.string(),
  basicZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  basicCity: yup.string().required(requiredMessage(CITY)).min(2, MinLength(CITY, 2)).max(20, MaxLength(CITY, 20)),
  basicCountry: yup.string().required(requiredMessage(COUNTRY)).min(2, MinLength(COUNTRY, 2)).max(20, MaxLength(COUNTRY, 20)),
  basicState: yup.string().required(requiredMessage(STATE)).min(2, MinLength(STATE, 2)).max(15, MaxLength(STATE, 15)),
};

export const emergencyPatientSchema = {
  employerUsualOccupation: yup.string(),
  employerIndustry: yup.string(),
  emergencyName: yup.string(),
  emergencyPhone: yup.string(),
};

export const kinPatientSchema = {
  kinName: yup.string(),
  kinMobile: yup.string(),
  kinPhone: yup.string(),
  kinRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }),
};

export const guardianPatientSchema = {
  guardianFirstName: yup.string(),
  guardianMiddleName: yup.string(),
  guardianLastName: yup.string(),
  guardianSuffix: yup.string(),
};

export const guarantorPatientSchema = {
  guarantorFirstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(requiredMessage(FIRST_NAME)),
  guarantorMiddleName: yup.string(),
  guarantorLastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(requiredMessage(LAST_NAME)),
  guarantorEmail: yup.string().email(INVALID_EMAIL).required(requiredMessage(EMAIL)),
  guarantorRelationship: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(requiredMessage(RELATIONSHIP)),
  guarantorPhone: yup.string().min(11, MinLength(PHONE_NUMBER, 11)).max(15, MaxLength(PHONE_NUMBER, 15)).required(requiredMessage(PHONE_NUMBER)),
  guarantorSuffix: yup.string(),
  guarantorSsn: yup.string().matches(SSN_REGEX, SSN_VALIDATION_MESSAGE),
  guarantorAddress: yup.string().required(requiredMessage(ADDRESS)),
  guarantorAddress2: yup.string(),
  guarantorZipCode: yup.string().required(requiredMessage(ZIP_CODE)).matches(ZIP_REGEX, ZIP_VALIDATION_MESSAGE),
  guarantorCity: yup.string().required(requiredMessage(CITY)).min(2, MinLength(CITY, 2)).max(20, MaxLength(CITY, 20)),
  guarantorState: yup.string().required(requiredMessage(STATE)).min(2, MinLength(STATE, 2)).max(15, MaxLength(STATE, 15)),
  guarantorCountry: yup.string(),
  guarantorEmployerName: yup.string(),
};

export const employerPatientSchema = {
  employerName: yup.string(),
  employerPhone: yup.string(),
  employerIndustry: yup.string(),
  employerUsualOccupation: yup.string(),
};

export const extendedPatientSchema = yup.object({
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

export const appointmentSchema = yup.object({
  ...patientIdSchema,
  ...serviceIdSchema,
  ...providerIdSchema,
  ...facilityIdSchema,
  notes: yup.string(),
  employment: yup.boolean(),
  autoAccident: yup.boolean(),
  otherAccident: yup.boolean(),
  primaryInsurance: yup.string(),
  secondaryInsurance: yup.string(),
  scheduleEndDateTime: yup.string(),
  scheduleStartDateTime: yup.string(),
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
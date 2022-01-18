// packages block
import * as yup from "yup";
// utils and constants block
import { RequiredMessage } from "../utils";
import {
  ADDRESS, ADDRESS_2, ALPHABETS_REGEX, CITY, CLIA_ID_NUMBER, CODE,
  CONFIRM_YOUR_PASSWORD, COUNTRY, DOB, EMAIL, FACILITY, FAX, FEDERAL_TAX_ID,
  FIRST_NAME, GENDER, INSURANCE_PLAN_TYPE, INVALID_EMAIL, LAST_NAME, MAMMOGRAPHY_CERTIFICATION_NUMBER,
  MaxLength, MinLength, MOBILE_NUMBER, NAME, NPI, NUMBER_REGEX, PASSWORD, PASSWORDS_MUST_MATCH,
  PASSWORD_LABEL, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE_NUMBER, PRACTICE_TYPE,
  PROVIDER, MIDDLE_NAME,
  REVENUE_CODE, ROLE, SERVICE_CODE, STATE, TAMXONOMY_CODE, ValidMessage, ZIP_CODE, PREFIX, SUFFIX, PROVIDER_INITIALS, DEGREE_CREDENTIALS, SPECIALTY, SSN, SSN_TYPE, DEA_NUMBER, LANGUAGE_SPOKEN, TAX_ID, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER, CAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE, ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE, PRESCRIPTIVE_AUTH_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE,
} from "../constants";

const roleTypeSchema = {
  roleType: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(RequiredMessage(ROLE))
}
const passwordSchema = { password: yup.string().required(RequiredMessage(PASSWORD_LABEL)) }
const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(RequiredMessage(EMAIL)) };

const passwordAndRepeatPasswordSchema = {
  password: yup.string().required(RequiredMessage(PASSWORD)).matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
  repeatPassword: yup.string().oneOf([yup.ref("password"), null], PASSWORDS_MUST_MATCH).required(CONFIRM_YOUR_PASSWORD),
}

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
  fax: yup.string().required(RequiredMessage(FAX)),
  city: yup.string().required(RequiredMessage(CITY)),
  state: yup.string().required(RequiredMessage(STATE)),
  address: yup.string().required(RequiredMessage(ADDRESS)),
  country: yup.string().required(RequiredMessage(COUNTRY)),
  zipCode: yup.string().required(RequiredMessage(ZIP_CODE)),
  address2: yup.string().required(RequiredMessage(ADDRESS_2)),
  phone: yup.string().matches(NUMBER_REGEX, ValidMessage(PHONE_NUMBER)).min(8, MinLength(PHONE_NUMBER, 8)).max(15, MaxLength(PHONE_NUMBER, 15)).required(RequiredMessage(PHONE_NUMBER)),
};

export const billingAddressSchema = {
  billingFax: yup.string().required(RequiredMessage(FAX)),
  billingCity: yup.string().required(RequiredMessage(CITY)),
  billingState: yup.string().required(RequiredMessage(STATE)),
  billingCountry: yup.string().required(RequiredMessage(COUNTRY)),
  billingAddress: yup.string().required(RequiredMessage(ADDRESS)),
  billingZipCode: yup.string().required(RequiredMessage(ZIP_CODE)),
  billingAddress2: yup.string().required(RequiredMessage(ADDRESS_2)),
  billingEmail: yup.string().email(INVALID_EMAIL).required(RequiredMessage(EMAIL)),
  billingPhone: yup.string().matches(NUMBER_REGEX, ValidMessage(PHONE_NUMBER)).min(8, MinLength(PHONE_NUMBER, 8)).max(15, MaxLength(PHONE_NUMBER, 15)).required(RequiredMessage(PHONE_NUMBER)),
}

const staffBasicSchema = {
  ...roleTypeSchema,
  dob: yup.string().required(RequiredMessage(DOB)),
  gender: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(RequiredMessage(GENDER)),
  username: yup.string().required(RequiredMessage(PROVIDER)),
  facilityId: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(RequiredMessage(FACILITY)),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(RequiredMessage(LAST_NAME)),
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(RequiredMessage(FIRST_NAME)),
  phone: yup.string().matches(NUMBER_REGEX, ValidMessage(PHONE_NUMBER)).min(8, MinLength(PHONE_NUMBER, 8)).max(15, MaxLength(PHONE_NUMBER, 15)).required(RequiredMessage(PHONE_NUMBER)),
  mobile: yup.string().matches(NUMBER_REGEX, ValidMessage(MOBILE_NUMBER)).min(8, MinLength(MOBILE_NUMBER, 8)).max(15, MaxLength(MOBILE_NUMBER, 15)).required(RequiredMessage(MOBILE_NUMBER)),
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
  ...contactSchema,
  ...billingAddressSchema,
  npi: yup.string().required(RequiredMessage(NPI)),
  name: yup.string().required(RequiredMessage(NAME)),
  code: yup.string().required(RequiredMessage(CODE)),
  revenueCode: yup.string().required(RequiredMessage(REVENUE_CODE)),
  serviceCode: yup.string().required(RequiredMessage(SERVICE_CODE)),
  practiceType: yup.string().required(RequiredMessage(PRACTICE_TYPE)),
  cliaIdNumber: yup.string().required(RequiredMessage(CLIA_ID_NUMBER)),
  federalTaxId: yup.string().required(RequiredMessage(FEDERAL_TAX_ID)),
  tamxonomyCode: yup.string().required(RequiredMessage(TAMXONOMY_CODE)),
  insurancePlanType: yup.string().required(RequiredMessage(INSURANCE_PLAN_TYPE)),
  mammographyCertificationNumber: yup.string().required(RequiredMessage(MAMMOGRAPHY_CERTIFICATION_NUMBER)),

})

export const basicDoctorSchema = {
  // ...roleTypeSchema,
  npi: yup.string().required(RequiredMessage(NPI)),
  dob: yup.string().required(RequiredMessage(DOB)),
  ssn: yup.string().required(RequiredMessage(SSN)),
  upin: yup.string().required(RequiredMessage(UPIN)),
  taxId: yup.string().required(RequiredMessage(TAX_ID)),
  prefix: yup.string().required(RequiredMessage(PREFIX)),
  suffix: yup.string().required(RequiredMessage(SUFFIX)),
  ssnType: yup.string().required(RequiredMessage(SSN_TYPE)),
  facilityId: yup.string().required(RequiredMessage(FACILITY)),
  deaNumber: yup.string().required(RequiredMessage(DEA_NUMBER)),
  speciality: yup.string().required(RequiredMessage(SPECIALTY)),
  dpsCtpNumber: yup.string().required(RequiredMessage(CTP_NUMBER)),
  taxIdStuff: yup.string().required(RequiredMessage(TAX_ID_STUFF)),
  deaTermDate: yup.string().required(RequiredMessage(DEA_TERM_DATE)),
  stateLicense: yup.string().required(RequiredMessage(STATE_LICENSE)),
  taxonomyCode: yup.string().required(RequiredMessage(TAMXONOMY_CODE)),
  deaActiveDate: yup.string().required(RequiredMessage(DEA_ACTIVE_DATE)),
  emcProviderId: yup.string().required(RequiredMessage(EMC_PROVIDER_ID)),
  languagesSpoken: yup.string().required(RequiredMessage(LANGUAGE_SPOKEN)),
  // billingFacility: yup.string().required(RequiredMessage(BILLING_FACILITY)),
  campusGrpNumber: yup.string().required(RequiredMessage(CAMPUS_GRP_NUMBER)),
  blueShildNumber: yup.string().required(RequiredMessage(BLUE_SHIED_NUMBER)),
  licenseTermDate: yup.string().required(RequiredMessage(LICENSE_TERM_DATE)),
  providerIntials: yup.string().required(RequiredMessage(PROVIDER_INITIALS)),
  specialityLicense: yup.string().required(RequiredMessage(SPECIALTY_LICENSE)),
  degreeCredentials: yup.string().required(RequiredMessage(DEGREE_CREDENTIALS)),
  anesthesiaLicense: yup.string().required(RequiredMessage(ANESTHESIA_LICENSE)),
  licenseActiveDate: yup.string().required(RequiredMessage(LICENSE_ACTIVE_DATE)),
  medicareGrpNumber: yup.string().required(RequiredMessage(MEDICARE_GRP_NUMBER)),
  medicaidGrpNumber: yup.string().required(RequiredMessage(MEDICAID_GRP_NUMBER)),
  prescriptiveAuthNumber: yup.string().required(RequiredMessage(PRESCRIPTIVE_AUTH_NUMBER)),
  meammographyCertNumber: yup.string().required(RequiredMessage(MAMMOGRAPHY_CERTIFICATION_NUMBER)),
  middleName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(MIDDLE_NAME)).min(3, MinLength(MIDDLE_NAME, 3)).max(26, MaxLength(MIDDLE_NAME, 26)),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(RequiredMessage(LAST_NAME)),
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(RequiredMessage(FIRST_NAME)),
};

export const doctorSchema = yup.object({
  ...basicDoctorSchema,
  ...contactSchema,
  ...billingAddressSchema,

})

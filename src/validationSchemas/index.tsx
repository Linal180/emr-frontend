// packages block
import * as yup from "yup";
// utils and constants block
import { RequiredMessage } from "../utils";
import {
  ADDRESS, ADDRESS_2, ALPHABETS_REGEX, CITY, CLIA_ID_NUMBER, CODE,
  CONFIRM_YOUR_PASSWORD, COUNTRY, DOB, EMAIL, FACILITY, FAX, FEDERAL_TAX_ID,
  FIRST_NAME, GENDER, INSURANCE_PLAN_TYPE, INVALID_EMAIL, LAST_NAME, MAMMOGRAPHY_CERTIFICATION_NUMBER,
  MaxLength, MinLength, MOBILE_NUMBER, NAME, NPI, NUMBER_REGEX, PASSWORD, PASSWORDS_MUST_MATCH,
  PASSWORD_LABEL, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, PHONE, PHONE_NUMBER, PRACTICE_TYPE,
  REVENUE_CODE, ROLE, SERVICE_CODE, STATE, TAMXONOMY_CODE, USER_NAME,
  ValidMessage, ZIP_CODE
} from "../constants";

const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(RequiredMessage(EMAIL)) };
const passwordSchema = { password: yup.string().required(RequiredMessage(PASSWORD_LABEL)) }

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

const staffBasicSchema = {
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(RequiredMessage(FIRST_NAME)),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(RequiredMessage(LAST_NAME)),
  username: yup.string().matches(ALPHABETS_REGEX, ValidMessage(USER_NAME)).min(3, MinLength(USER_NAME, 3)).max(26, MaxLength(USER_NAME, 26)).required(RequiredMessage(USER_NAME)),
  phone: yup.string().matches(NUMBER_REGEX, ValidMessage(PHONE_NUMBER)).min(8, MinLength(PHONE_NUMBER, 8)).max(15, MaxLength(PHONE_NUMBER, 15)).required(RequiredMessage(PHONE_NUMBER)),
  mobile: yup.string().matches(NUMBER_REGEX, ValidMessage(MOBILE_NUMBER)).min(8, MinLength(MOBILE_NUMBER, 8)).max(15, MaxLength(MOBILE_NUMBER, 15)).required(RequiredMessage(MOBILE_NUMBER)),
  dob: yup.string().required(RequiredMessage(DOB)),
  gender: yup.string().required(RequiredMessage(GENDER)),
  roleType: yup.string().required(RequiredMessage(ROLE)),
  facilityId: yup.string().required(RequiredMessage(FACILITY)),
}

export const addStaffSchema = yup.object({
  ...staffBasicSchema,
  ...emailSchema,
  ...passwordSchema
})

export const updateStaffSchema = yup.object({
  ...staffBasicSchema,
  ...emailSchema,
})

export const facilitySchema = yup.object({
  name: yup.string().required(RequiredMessage(NAME)),
  practiceType: yup.string().required(RequiredMessage(PRACTICE_TYPE)),
  code: yup.string().required(RequiredMessage(CODE)),
  email: yup.string().required(RequiredMessage(EMAIL)),
  phone: yup.string().required(RequiredMessage(PHONE)),
  fax: yup.string().required(RequiredMessage(FAX)),
  zipCode: yup.string().required(RequiredMessage(ZIP_CODE)),
  address: yup.string().required(RequiredMessage(ADDRESS)),
  address2: yup.string().required(RequiredMessage(ADDRESS_2)),
  city: yup.string().required(RequiredMessage(CITY)),
  state: yup.string().required(RequiredMessage(STATE)),
  country: yup.string().required(RequiredMessage(COUNTRY)),
  cliaIdNumber: yup.string().required(RequiredMessage(CLIA_ID_NUMBER)),
  federalTaxId: yup.string().required(RequiredMessage(FEDERAL_TAX_ID)),
  revenueCode: yup.string().required(RequiredMessage(REVENUE_CODE)),
  tamxonomyCode: yup.string().required(RequiredMessage(TAMXONOMY_CODE)),
  insurancePlanType: yup.string().required(RequiredMessage(INSURANCE_PLAN_TYPE)),
  mammographyCertificationNumber: yup.string().required(RequiredMessage(MAMMOGRAPHY_CERTIFICATION_NUMBER)),
  npi: yup.string().required(RequiredMessage(NPI)),
  serviceCode: yup.string().required(RequiredMessage(SERVICE_CODE)),
})

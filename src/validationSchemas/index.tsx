// packages block
import * as yup from "yup";
// utils and constants block
import { RequiredMessage } from "../utils";
import { INVALID_EMAIL, REQUIRED_MESSAGE, ALPHABETS_REGEX, MaxLength, MinLength, NUMBER_REGEX, ValidMessage, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, CONFIRM_YOUR_PASSWORD, PASSWORDS_MUST_MATCH, FIRST_NAME, LAST_NAME, PHONE_NUMBER, ZIP_CODE, EMAIL, PASSWORD_LABEL, NAME, PASSWORD } from "../constants";

const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(RequiredMessage(EMAIL)) };
const passwordSchema = { password: yup.string().required(RequiredMessage(PASSWORD_LABEL)) }

const passwordAndRepeatPasswordSchema = {
  password: yup.string().required(RequiredMessage(PASSWORD)).matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
  repeatPassword: yup.string().oneOf([yup.ref("password"), null], PASSWORDS_MUST_MATCH).required(CONFIRM_YOUR_PASSWORD),
}

const basicUserSchema = {
  firstName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(FIRST_NAME)).min(3, MinLength(FIRST_NAME, 3)).max(26, MaxLength(FIRST_NAME, 26)).required(RequiredMessage(FIRST_NAME)),
  lastName: yup.string().matches(ALPHABETS_REGEX, ValidMessage(LAST_NAME)).min(3, MinLength(LAST_NAME, 3)).max(26, MaxLength(LAST_NAME, 26)).required(RequiredMessage(LAST_NAME)),
  phone: yup.string().matches(NUMBER_REGEX, ValidMessage(PHONE_NUMBER)).min(8, MinLength(PHONE_NUMBER, 8)).max(15, MaxLength(PHONE_NUMBER, 15)).required(RequiredMessage(PHONE_NUMBER)),
  zipCode: yup.string().matches(NUMBER_REGEX, ValidMessage(ZIP_CODE)).required(RequiredMessage(ZIP_CODE))
}

export const loginValidationSchema = yup.object({
  ...emailSchema,
  ...passwordSchema
});

export const updateRoleSchema = yup.object({
  id: yup.string().required(),
  roles: yup.string().required(REQUIRED_MESSAGE)
});

export const userUpdateSchema = yup.object({
  id: yup.string().required(REQUIRED_MESSAGE),
  ...emailSchema,
  ...basicUserSchema
});

export const addUserValidationSchema = yup.object({
  ...emailSchema,
  ...basicUserSchema,
  ...passwordAndRepeatPasswordSchema,
  roleType: yup.string().required(REQUIRED_MESSAGE),
});

export const resetPasswordValidationSchema = yup.object({
  ...passwordAndRepeatPasswordSchema
});

export const forgetPasswordValidationSchema = yup.object({
  ...emailSchema,
});

export const featureAndTagValidationSchema = yup.object({ name: yup.string().max(20, MaxLength(NAME, 20)).min(3, MinLength(NAME, 3)).required(REQUIRED_MESSAGE) });

export const changePasswordValidationSchema = yup.object({
  oldPassword: yup.string().required(REQUIRED_MESSAGE),
  newPassword: yup.string().required(REQUIRED_MESSAGE).matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
  repeatPassword: yup.string().oneOf([yup.ref("newPassword"), null], PASSWORDS_MUST_MATCH).required(CONFIRM_YOUR_PASSWORD),
});

export const updateUserRoleSchema = yup.object({
  id: yup.string().required(),
  roles: yup.string().required(REQUIRED_MESSAGE)
});

export const updateUserSchema = yup.object({
  id: yup.string().required(REQUIRED_MESSAGE),
  ...emailSchema,
  ...basicUserSchema
});

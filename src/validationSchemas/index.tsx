// packages block
import * as yup from "yup";
// utils and constants block
import { RequiredMessage } from "../utils";
import { INVALID_EMAIL, REQUIRED_MESSAGE, ALPHABETS_REGEX, MaxLength, MinLength, NUMBER_REGEX, ValidMessage, PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE, LONGITUDE_LATITUDE_REGEX, CONFIRM_YOUR_PASSWORD, PASSWORDS_MUST_MATCH, FIRST_NAME, LAST_NAME, PHONE_NUMBER, ZIP_CODE, EMAIL, PASSWORD_LABEL, NAME, PASSWORD, DESCRIPTION, DETAIL_OVERVIEW, COMMENT, FEATURES_TEXT, TAGS_TEXT, LONGITUDE, LATITUDE } from "../constants";

const emailSchema = { email: yup.string().email(INVALID_EMAIL).required(RequiredMessage(EMAIL)) };
const passwordSchema = { password: yup.string().required(RequiredMessage(PASSWORD_LABEL)) }

const basicPropertySchema = {
  name: yup.string().required(RequiredMessage(NAME)),
  description: yup.string().required(REQUIRED_MESSAGE),
  detailOverview: yup.string().required(REQUIRED_MESSAGE),
  address: yup.string().required(REQUIRED_MESSAGE),
  locationData: yup.object().shape({
    name: yup.string().required(),
    id: yup.string().required()
  }).required(REQUIRED_MESSAGE),
}

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

export const locationValidationSchema = yup.object({
  address: yup.string().required(REQUIRED_MESSAGE),
  name: yup.string().required(REQUIRED_MESSAGE),
  longitude: yup.string().when({
    is: (val: string) => val,
    then: yup.string().matches(LONGITUDE_LATITUDE_REGEX, ValidMessage(LONGITUDE, "1.0-90.0")).max(5, MaxLength(LONGITUDE, 5)),
    otherwise: yup.string()
  }),

  latitude: yup.string().when({
    is: (val: string) => val,
    then: yup.string().matches(LONGITUDE_LATITUDE_REGEX, ValidMessage(LATITUDE, "1.0-90.0")).max(5, MaxLength(LATITUDE, 5)),
    otherwise: yup.string()
  }),

  description: yup.string().required(REQUIRED_MESSAGE).min(5, MinLength(DESCRIPTION, 5)),
  detailOverview: yup.string().required(REQUIRED_MESSAGE).min(5, MinLength(DETAIL_OVERVIEW, 5)),
});

export const changePasswordValidationSchema = yup.object({
  oldPassword: yup.string().required(REQUIRED_MESSAGE),
  newPassword: yup.string().required(REQUIRED_MESSAGE).matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
  repeatPassword: yup.string().oneOf([yup.ref("newPassword"), null], PASSWORDS_MUST_MATCH).required(CONFIRM_YOUR_PASSWORD),
});

export const addPropertyValidationSchema = (activeStep: number) => yup.object({
  ...basicPropertySchema,
  selectedFeatures: activeStep > 0 ? yup.array().of(yup.string().min(3, MinLength(FEATURES_TEXT, 3)).max(20, MaxLength(FEATURES_TEXT, 20))).min(1).required(REQUIRED_MESSAGE) : yup.array().of(yup.string()),
  selectedTags: activeStep > 0 ? yup.array().of(yup.string().min(3, MinLength(TAGS_TEXT, 3)).max(20, MaxLength(TAGS_TEXT, 20))).min(1).required(REQUIRED_MESSAGE) : yup.array().of(yup.string()),
});

export const editPropertyValidationSchema = yup.object({
  ...basicPropertySchema
});

export const propertyTagsSchema = yup.object({
  tags: yup.array().of(yup.string().min(3, MinLength(TAGS_TEXT, 3)).max(20, MaxLength(TAGS_TEXT, 20))).min(1).required(REQUIRED_MESSAGE)
});

export const propertyFeatureSchema = yup.object({
  features: yup.array().of(yup.string().min(3, MinLength(FEATURES_TEXT, 3)).max(20, MaxLength(FEATURES_TEXT, 20))).min(1).required(REQUIRED_MESSAGE)
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

export const updateRequestSchema = yup.object({
  id: yup.string().required(REQUIRED_MESSAGE),
  requestStatus: yup.string().required(REQUIRED_MESSAGE),
  description: yup.string().required(REQUIRED_MESSAGE).min(5, MinLength(COMMENT, 5)).max(50, MaxLength(COMMENT, 50)),
});

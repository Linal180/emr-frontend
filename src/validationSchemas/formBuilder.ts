// packages block
import * as yup from "yup";
import { notRequiredPhone, requiredPhone } from ".";
import { FormBuilderApiSelector } from "../constants";
//graphql, utils
import { ElementType, SectionsInputs } from "../generated/graphql";
import { invalidMessage, requiredMessage } from "../utils";
//schema
export const getFormBuilderValidation = (formSection: SectionsInputs[]) => {
  let validation: any = {}
  formSection?.map((section) => {
    const { fields } = section || {}
    fields?.map((field) => {
      const { required, type, apiCall, fieldId, label, isMultiSelect } = field;
      if (!apiCall) {
        switch (type) {
          case ElementType.Text:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break;
          case ElementType.Email:
            validation[fieldId] = required ? yup.string().email(invalidMessage(label)).required(requiredMessage(label)) : yup.string().email(invalidMessage(label))
            break;
          case ElementType.Tel:
            validation[fieldId] = required ? requiredPhone(label) : notRequiredPhone(label)
            break;
          case ElementType.Radio:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break;
          case ElementType.Select:
            validation[fieldId] = isMultiSelect ? (required ? yup.array().min(1, requiredMessage(label)).required(requiredMessage(label)) : yup.array().of(yup.string().required())) : (required ? yup.string().required(requiredMessage(label)) : yup.string())
            break;
          case ElementType.Date:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break
          case ElementType.File:
            validation[fieldId] = required ? yup.mixed().required(requiredMessage(label)) : yup.mixed()
            break;
          case ElementType.Number:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break;
          default:
            break;
        }
      }
      else {
        switch (apiCall) {
          case FormBuilderApiSelector.FACILITY_PROVIDERS:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break;
          case FormBuilderApiSelector.PAYMENT_TYPE:
            validation[fieldId] = required ? yup.string().required(requiredMessage(label)) : yup.string()
            break;
          case FormBuilderApiSelector.PRACTICE_FACILITIES:
            validation[fieldId] = yup.string().required(requiredMessage(label))
            break;
          case FormBuilderApiSelector.SERVICE_SELECT:
            validation[fieldId] = yup.string().required(requiredMessage(label))
            break;
          case FormBuilderApiSelector.SERVICE_SLOT:
            break;
          default:
            break;
        }
      }
      return field
    })
    return section
  })
  return yup.object(validation)
}

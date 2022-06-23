// packages block
import * as yup from "yup";
//graphql, utils
import { notRequiredPhone, requiredPhone } from ".";
import { invalidMessage, requiredMessage } from "../utils";
import { ElementType, FormTabsInputs } from "../generated/graphql";
import {
  COMPANY_NAME, CONTRACT_NO, FormBuilderApiSelector, FormBuilderPaymentTypes, GROUP_NUMBER, MEMBER_ID, ORGANIZATION_NAME
} from "../constants";
//schema
export const getFormBuilderValidation = (formSection: FormTabsInputs[], paymentType: string, tabIndex: number) => {
  let validation: any = {}
  formSection?.filter((_, index) => index === tabIndex)?.map((tab) => {
    const { sections } = tab || {}
    return sections?.map((section) => {
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
              validation[fieldId] = required ? yup.string().required(requiredMessage(label)).nullable() : yup.string().nullable()
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

              switch (paymentType) {
                case FormBuilderPaymentTypes.INSURANCE:
                  validation['companyName'] = yup.string().required(requiredMessage(COMPANY_NAME))
                  validation['memberId'] = yup.string().required(requiredMessage(MEMBER_ID))
                  validation['groupNumber'] = yup.string().required(requiredMessage(GROUP_NUMBER))
                  break

                case FormBuilderPaymentTypes.CONTRACT:
                  validation['contractNumber'] = yup.string().required(requiredMessage(CONTRACT_NO))
                  validation['organizationName'] = yup.string().required(requiredMessage(ORGANIZATION_NAME))
                  break

                default:
                  break;
              }
              break;

            case FormBuilderApiSelector.PRACTICE_FACILITIES:
              validation[fieldId] = yup.string().required(requiredMessage(label))
              break;

            case FormBuilderApiSelector.SERVICE_SELECT:
              validation[fieldId] = yup.string().required(requiredMessage(label))
              break;

            case FormBuilderApiSelector.SERVICE_SLOT:
              break;

            case FormBuilderApiSelector.TERMS_CONDITIONS:
              validation[fieldId] = yup.boolean().oneOf([true, null], requiredMessage(label))
              break;

            default:
              break;
          }
        }
        return field
      })
      return section
    })
  })
  return yup.object(validation)
}

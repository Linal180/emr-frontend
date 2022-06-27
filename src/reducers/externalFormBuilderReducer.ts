import { getFormInitialValues } from "../constants";
import { FormType, FormTabsInputs } from "../generated/graphql";
import { SelectorOption } from "../interfacesTypes";

export interface State {
  isActive: boolean;
  loader: boolean;
  uploadImage: boolean;
  formName: string;
  formValues: FormTabsInputs[];
  formType: FormType;
  facilityId: string;
  serviceId: string;
  practiceId: string;
  facilityFieldId: SelectorOption;
  paymentType: string;
  activeStep: number;
  serviceTypeId: string;
  transactionId: string;
  provider: SelectorOption
}

export const initialState: State = {
  isActive: false,
  loader: true,
  uploadImage: false,
  formName: '',
  formValues: getFormInitialValues(),
  formType: FormType.Appointment,
  facilityId: '',
  serviceId: "",
  practiceId: "",
  facilityFieldId: { id: "", name: "" },
  paymentType: '',
  activeStep: 10,
  serviceTypeId: "",
  transactionId: "",
  provider: {
    id: "",
    name: ""
  }
}

export enum ActionType {
  SET_ACTIVE = 'setIsActive',
  SET_LOADER = 'setLoader',
  SET_UPLOAD_IMAGE = 'setUploadImage',
  SET_FORM_NAME = 'setFormName',
  SET_FORM_VALUES = 'setFormValues',
  SET_FORM_TYPE = 'setFormType',
  SET_FACILITY_ID = 'setFacilityId',
  SET_SERVICE_ID = 'setServiceId',
  SET_PRACTICE_ID = 'setPracticeId',
  SET_FACILITY_FIELD_ID = 'setFacilityFieldId',
  SET_PAYMENT_TYPE = 'setPaymentType',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_SERVICE_TYPE_ID = 'setServiceTypeId',
  SET_TRANSACTION_ID = 'setTransactionId',
  SET_PROVIDER = 'setProvider'
}

export type Action = { type: ActionType.SET_ACTIVE; isActive: boolean } |
{ type: ActionType.SET_LOADER; loader: boolean } |
{ type: ActionType.SET_UPLOAD_IMAGE; uploadImage: boolean } |
{ type: ActionType.SET_FORM_NAME; formName: string } |
{ type: ActionType.SET_FORM_VALUES; formValues: FormTabsInputs[] } |
{ type: ActionType.SET_FACILITY_FIELD_ID; facilityFieldId: SelectorOption } |
{ type: ActionType.SET_FACILITY_ID; facilityId: string } |
{ type: ActionType.SET_FORM_TYPE; formType: FormType } |
{ type: ActionType.SET_SERVICE_ID; serviceId: string } |
{ type: ActionType.SET_PRACTICE_ID; practiceId: string } |
{ type: ActionType.SET_PAYMENT_TYPE; paymentType: string } |
{ type: ActionType.SET_ACTIVE_STEP; activeStep: number } |
{ type: ActionType.SET_SERVICE_TYPE_ID; serviceTypeId: string } |
{ type: ActionType.SET_TRANSACTION_ID; transactionId: string } |
{ type: ActionType.SET_PROVIDER, provider: SelectorOption }

export const externalFormBuilderReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_ACTIVE:
      return {
        ...state,
        isActive: action.isActive
      }

    case ActionType.SET_LOADER:
      return {
        ...state,
        loader: action.loader
      }

    case ActionType.SET_UPLOAD_IMAGE:
      return {
        ...state,
        uploadImage: action.uploadImage
      }

    case ActionType.SET_FORM_NAME:
      return {
        ...state,
        formName: action.formName
      }

    case ActionType.SET_FORM_VALUES:
      return {
        ...state,
        formValues: action.formValues
      }

    case ActionType.SET_FORM_TYPE:
      return {
        ...state,
        formType: action.formType
      }

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_SERVICE_ID:
      return {
        ...state,
        serviceId: action.serviceId
      }

    case ActionType.SET_PRACTICE_ID:
      return {
        ...state,
        practiceId: action.practiceId
      }

    case ActionType.SET_FACILITY_FIELD_ID:
      return {
        ...state,
        facilityFieldId: action.facilityFieldId
      }

    case ActionType.SET_PAYMENT_TYPE:
      return {
        ...state,
        paymentType: action.paymentType
      }

    case ActionType.SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.activeStep
      }

    case ActionType.SET_SERVICE_TYPE_ID:
      return {
        ...state,
        serviceTypeId: action.serviceTypeId
      }

    case ActionType.SET_TRANSACTION_ID:
      return {
        ...state,
        transactionId: action.transactionId
      }

    case ActionType.SET_PROVIDER:
      return {
        ...state,
        provider: action.provider
      }
  }
}
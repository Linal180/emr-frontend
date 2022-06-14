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
  paymentType: ''
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
  SET_PAYMENT_TYPE = 'setPaymentType'
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
{ type: ActionType.SET_PAYMENT_TYPE; paymentType: string }


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
  }
}
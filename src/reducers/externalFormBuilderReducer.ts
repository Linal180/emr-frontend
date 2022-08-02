import { getFormInitialValues } from "../constants";
import { SelectorOption } from "../interfacesTypes";
import { FormType, FormTabsInputs, AgreementsPayload, Attachment } from "../generated/graphql";

export interface State {
  loader: boolean;
  formName: string;
  isActive: boolean;
  serviceId: string;
  patientId: string;
  formType: FormType;
  facilityId: string;
  practiceId: string;
  activeStep: number;
  paymentType: string;
  isSignature: boolean;
  uploadImage: boolean;
  transactionId: string;
  serviceTypeId: string;
  provider: SelectorOption;
  signatureLoader: boolean;
  formValues: FormTabsInputs[];
  facilityFieldId: SelectorOption;
  insuranceCard1: Attachment | undefined;
  insuranceCard2: Attachment | undefined;
  drivingLicense2: Attachment | undefined;
  drivingLicense1: Attachment | undefined;
  agreements: AgreementsPayload['agreements'];
}

export const initialState: State = {
  loader: true,
  formName: '',
  serviceId: "",
  patientId: "",
  activeStep: 0,
  practiceId: "",
  facilityId: '',
  agreements: [],
  paymentType: '',
  isActive: false,
  serviceTypeId: "",
  transactionId: "",
  isSignature: false,
  uploadImage: false,
  signatureLoader: false,
  insuranceCard1: undefined,
  insuranceCard2: undefined,
  drivingLicense1: undefined,
  drivingLicense2: undefined,
  formType: FormType.Appointment,
  provider: { id: "", name: "" },
  formValues: getFormInitialValues(),
  facilityFieldId: { id: "", name: "" },
}

export enum ActionType {
  SET_LOADER = 'setLoader',
  SET_ACTIVE = 'setIsActive',
  SET_PATIENT_ID = 'patientId',
  SET_PROVIDER = 'setProvider',
  SET_FORM_NAME = 'setFormName',
  SET_FORM_TYPE = 'setFormType',
  SET_SIGNATURE = 'setSignature',
  SET_SERVICE_ID = 'setServiceId',
  SET_AGREEMENTS = 'setAgreements',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_FACILITY_ID = 'setFacilityId',
  SET_PRACTICE_ID = 'setPracticeId',
  SET_FORM_VALUES = 'setFormValues',
  SET_UPLOAD_IMAGE = 'setUploadImage',
  SET_PAYMENT_TYPE = 'setPaymentType',
  SET_TRANSACTION_ID = 'setTransactionId',
  SET_SERVICE_TYPE_ID = 'setServiceTypeId',
  SET_SIGNATURE_LOADER = 'setSignatureLoader',
  SET_FACILITY_FIELD_ID = 'setFacilityFieldId',
  SET_INSURANCE_CARD_1 = 'SET_INSURANCE_CARD_1',
  SET_INSURANCE_CARD_2 = 'SET_INSURANCE_CARD_2',
  SET_DRIVING_LICENSE_1 = 'SET_DRIVING_LICENSE_1',
  SET_DRIVING_LICENSE_2 = 'SET_DRIVING_LICENSE_2'
}

export type Action = { type: ActionType.SET_ACTIVE; isActive: boolean } |
{ type: ActionType.SET_LOADER; loader: boolean } |
{ type: ActionType.SET_FORM_NAME; formName: string } |
{ type: ActionType.SET_FORM_TYPE; formType: FormType } |
{ type: ActionType.SET_SERVICE_ID; serviceId: string } |
{ type: ActionType.SET_PATIENT_ID; patientId: string } |
{ type: ActionType.SET_FACILITY_ID; facilityId: string } |
{ type: ActionType.SET_ACTIVE_STEP; activeStep: number } |
{ type: ActionType.SET_PRACTICE_ID; practiceId: string } |
{ type: ActionType.SET_SIGNATURE; isSignature: boolean } |
{ type: ActionType.SET_PAYMENT_TYPE; paymentType: string } |
{ type: ActionType.SET_UPLOAD_IMAGE; uploadImage: boolean } |
{ type: ActionType.SET_PROVIDER, provider: SelectorOption } |
{ type: ActionType.SET_TRANSACTION_ID; transactionId: string } |
{ type: ActionType.SET_SERVICE_TYPE_ID; serviceTypeId: string } |
{ type: ActionType.SET_FORM_VALUES; formValues: FormTabsInputs[] } |
{ type: ActionType.SET_SIGNATURE_LOADER; signatureLoader: boolean } |
{ type: ActionType.SET_FACILITY_FIELD_ID; facilityFieldId: SelectorOption } |
{ type: ActionType.SET_AGREEMENTS; agreements: AgreementsPayload['agreements'] } |
{ type: ActionType.SET_INSURANCE_CARD_1; insuranceCard1: Attachment | undefined } |
{ type: ActionType.SET_INSURANCE_CARD_2; insuranceCard2: Attachment | undefined } |
{ type: ActionType.SET_DRIVING_LICENSE_1; drivingLicense1: Attachment | undefined } |
{ type: ActionType.SET_DRIVING_LICENSE_2; drivingLicense2: Attachment | undefined }

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

    case ActionType.SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.agreements
      }

    case ActionType.SET_SIGNATURE:
      return {
        ...state,
        isSignature: action.isSignature
      }

    case ActionType.SET_SIGNATURE_LOADER:
      return {
        ...state,
        signatureLoader: action.signatureLoader
      }

    case ActionType.SET_PATIENT_ID:
      return {
        ...state,
        patientId: action.patientId
      }

    case ActionType.SET_DRIVING_LICENSE_1:
      return {
        ...state,
        drivingLicense1: action.drivingLicense1
      }

    case ActionType.SET_DRIVING_LICENSE_2:
      return {
        ...state,
        drivingLicense2: action.drivingLicense2
      }

    case ActionType.SET_INSURANCE_CARD_1:
      return {
        ...state,
        insuranceCard1: action.insuranceCard1
      }

    case ActionType.SET_INSURANCE_CARD_2:
      return {
        ...state,
        insuranceCard2: action.insuranceCard2
      }
  }
}
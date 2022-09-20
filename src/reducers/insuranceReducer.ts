import { EMPTY_OPTION } from "../constants"
import { AttachmentWithPreSignedUrlPayload } from "../generated/graphql"
import { SelectorOption } from "../interfacesTypes"

export interface State {
  policyId: string
  activeStep: number
  isFormLoaded: boolean
  policyHolderId: string
  openDelete: boolean
  documentTypeId: string
  policyAttachmentId: string
  insuranceId: SelectorOption
  numberOfFiles: number
  attachments: AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']
  cameraOpen: boolean;
  isPolicyAttachmentFetch: boolean
}

export const initialState: State = {
  policyId: '',
  activeStep: 0,
  isFormLoaded: true,
  policyHolderId: '',
  insuranceId: EMPTY_OPTION,
  numberOfFiles: 0,
  openDelete: false,
  documentTypeId: '',
  policyAttachmentId: '',
  attachments: [],
  cameraOpen: false,
  isPolicyAttachmentFetch: false
}

export enum ActionType {
  SET_POLICY_ID = 'setPolicyId',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_IS_FORM_LOADED = 'setIsFormLoaded',
  SET_POLICY_HOLDER_ID = 'setPolicyHolderId',
  SET_INSURANCE_ID = 'setInsuranceId',
  SET_NUMBER_OF_FILES = 'setNumberOfFiles',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_DOCUMENT_TYPE_ID = 'setDocumentTypeId',
  SET_POLICY_ATTACHMENT_ID = 'setPolicyAttachmentId',
  SET_ATTACHMENTS = 'setAttachments',
  SET_CAMERA_OPEN = 'setCameraOpen',
  SET_IS_POLICY_ATTACHMENT_FETCH = 'SET_IS_POLICY_ATTACHMENT_FETCH'
}

export type Action =
  | { type: ActionType.SET_POLICY_ID, policyId: string }
  | { type: ActionType.SET_ACTIVE_STEP, activeStep: number }
  | { type: ActionType.SET_CAMERA_OPEN, cameraOpen: boolean }
  | { type: ActionType.SET_IS_FORM_LOADED, isFormLoaded: boolean }
  | { type: ActionType.SET_POLICY_HOLDER_ID, policyHolderId: string }
  | { type: ActionType.SET_INSURANCE_ID, insuranceId: SelectorOption }
  | { type: ActionType.SET_NUMBER_OF_FILES, numberOfFiles: number }
  | { type: ActionType.SET_OPEN_DELETE, openDelete: boolean }
  | { type: ActionType.SET_DOCUMENT_TYPE_ID, documentTypeId: string }
  | { type: ActionType.SET_POLICY_ATTACHMENT_ID, policyAttachmentId: string }
  | { type: ActionType.SET_ATTACHMENTS, attachments: AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl'] }
  | { type: ActionType.SET_IS_POLICY_ATTACHMENT_FETCH, isPolicyAttachmentFetch: boolean }


export const insuranceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_POLICY_ID:
      return {
        ...state,
        policyId: action.policyId
      }

    case ActionType.SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.activeStep
      }

    case ActionType.SET_IS_FORM_LOADED:
      return {
        ...state,
        isFormLoaded: action.isFormLoaded
      }

    case ActionType.SET_POLICY_HOLDER_ID:
      return {
        ...state,
        policyHolderId: action.policyHolderId
      }

    case ActionType.SET_INSURANCE_ID:
      return {
        ...state,
        insuranceId: action.insuranceId
      }

    case ActionType.SET_NUMBER_OF_FILES:
      return {
        ...state,
        numberOfFiles: action.numberOfFiles
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_POLICY_ATTACHMENT_ID:
      return {
        ...state,
        policyAttachmentId: action.policyAttachmentId
      }

    case ActionType.SET_DOCUMENT_TYPE_ID:
      return {
        ...state,
        documentTypeId: action.documentTypeId
      }

    case ActionType.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments
      }

    case ActionType.SET_CAMERA_OPEN:
      return {
        ...state,
        cameraOpen: action.cameraOpen
      }

    case ActionType.SET_IS_POLICY_ATTACHMENT_FETCH:
      return {
        ...state,
        isPolicyAttachmentFetch: action.isPolicyAttachmentFetch
      }
  }
};

import { Attachment, AttachmentPayload, AttachmentsPayload, CreateAttachmentInput } from "../generated/graphql";

export interface State {
  meta: string
  action: string
  isOpen: boolean
  isEdit: boolean
  fileUrl: string
  openSign: boolean
  openDelete: boolean
  providerName: string
  documentTab: boolean
  preSignedUrl: string
  attachmentId: string
  attachmentUrl: string
  isEditModalOpen: boolean
  attachments: Attachment[]
  signedByProvider: boolean
  deleteAttachmentId: string
  attachment: Attachment | undefined
  insuranceCard1: Attachment | undefined
  insuranceCard2: Attachment | undefined
  drivingLicense1: Attachment | undefined
  drivingLicense2: Attachment | undefined
  attachmentData: AttachmentPayload['attachment'];
  attachmentsData: AttachmentsPayload['attachments'];
  mediaData: Pick<CreateAttachmentInput, "title"> | undefined
}

export const initialState: State = {
  meta: "",
  action: '',
  fileUrl: '',
  isOpen: false,
  isEdit: false,
  openSign: false,
  attachments: [],
  attachmentId: '',
  preSignedUrl: '',
  providerName: '',
  openDelete: false,
  attachmentUrl: '',
  documentTab: false,
  attachmentsData: [],
  mediaData: undefined,
  attachmentData: null,
  attachment: undefined,
  isEditModalOpen: false,
  deleteAttachmentId: '',
  signedByProvider: false,
  insuranceCard1: undefined,
  insuranceCard2: undefined,
  drivingLicense1: undefined,
  drivingLicense2: undefined,
}

export enum ActionType {
  SET_ACTION = 'setAction',
  SET_IS_OPEN = 'setIsOpen',
  SET_IS_EDIT = 'setIsEdit',
  SET_FILE_URL = 'setFileUrl',
  SET_OPEN_SIGN = 'setOpenSign',
  SET_MEDIA_DATA = 'setMediaData',
  SET_ATTACHMENT = 'setAttachment',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_ATTACHMENTS = 'setAttachments',
  SET_DOCUMENT_TAB = 'setDocumentTab',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_PROVIDER_NAME = 'setProviderName',
  SET_PRE_SIGNED_URL = 'setPreSignedUrl',
  SET_ATTACHMENT_URL = 'setAttachmentUrl',
  SET_ATTACHMENT_DATA = 'setAttachmentData',
  SET_INSURANCE_CARD_1 = 'setInsuranceCard1',
  SET_INSURANCE_CARD_2 = 'setInsuranceCard2',
  SET_ATTACHMENTS_DATA = 'setAttachmentsData',
  SET_DRIVING_LICENSE_1 = 'setDrivingLicense1',
  SET_DRIVING_LICENSE_2 = 'setDrivingLicense2',
  SET_SIGNED_BY_PROVIDER = 'setSignedByProvider',
  SET_DELETE_ATTACHMENT_ID = 'setDeleteAttachmentId',
  SET_IS_EDIT_MEDIA_MODAL_OPEN = 'setIsEditMediaModalOpen',
}

export type Action =
  | { type: ActionType.SET_ACTION, action: string }
  | { type: ActionType.SET_IS_OPEN; isOpen: boolean }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_FILE_URL; fileUrl: string }
  | { type: ActionType.SET_OPEN_SIGN; openSign: boolean }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_ATTACHMENT; attachment: Attachment }
  | { type: ActionType.SET_DOCUMENT_TAB, documentTab: boolean }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string }
  | { type: ActionType.SET_PROVIDER_NAME, providerName: string }
  | { type: ActionType.SET_PRE_SIGNED_URL; preSignedUrl: string }
  | { type: ActionType.SET_ATTACHMENT_URL; attachmentUrl: string }
  | { type: ActionType.SET_ATTACHMENTS; attachments: Attachment[] }
  | { type: ActionType.SET_SIGNED_BY_PROVIDER, signedByProvider: boolean }
  | { type: ActionType.SET_DELETE_ATTACHMENT_ID; deleteAttachmentId: string }
  | { type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN; isEditModalOpen: boolean }
  | { type: ActionType.SET_INSURANCE_CARD_1; insuranceCard1: Attachment | undefined }
  | { type: ActionType.SET_INSURANCE_CARD_2; insuranceCard2: Attachment | undefined }
  | { type: ActionType.SET_DRIVING_LICENSE_1; drivingLicense1: Attachment | undefined }
  | { type: ActionType.SET_DRIVING_LICENSE_2; drivingLicense2: Attachment | undefined }
  | { type: ActionType.SET_ATTACHMENT_DATA; attachmentData: AttachmentPayload['attachment'] }
  | { type: ActionType.SET_ATTACHMENTS_DATA; attachmentsData: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_MEDIA_DATA; mediaData: Pick<CreateAttachmentInput, "title"> | undefined }

export const mediaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
      }

    case ActionType.SET_ACTION:
      return {
        ...state,
        action: action.action
      }

    case ActionType.SET_OPEN_SIGN:
      return {
        ...state,
        openSign: action.openSign
      }

    case ActionType.SET_PROVIDER_NAME:
      return {
        ...state,
        providerName: action.providerName
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_PRE_SIGNED_URL:
      return {
        ...state,
        preSignedUrl: action.preSignedUrl
      }

    case ActionType.SET_DOCUMENT_TAB:
      return {
        ...state,
        documentTab: action.documentTab
      }

    case ActionType.SET_SIGNED_BY_PROVIDER:
      return {
        ...state,
        signedByProvider: action.signedByProvider
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

    case ActionType.SET_ATTACHMENT_URL:
      return {
        ...state,
        attachmentUrl: action.attachmentUrl
      }

    case ActionType.SET_FILE_URL:
      return {
        ...state,
        fileUrl: action.fileUrl
      }

    case ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN:
      return {
        ...state,
        isEditModalOpen: action.isEditModalOpen
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit,
      }

    case ActionType.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments
      }

    case ActionType.SET_ATTACHMENT:
      return {
        ...state,
        attachment: action.attachment
      }

    case ActionType.SET_ATTACHMENT_ID:
      return {
        ...state,
        attachmentId: action.attachmentId
      }

    case ActionType.SET_MEDIA_DATA:
      return {
        ...state,
        mediaData: action.mediaData
      }

    case ActionType.SET_ATTACHMENT_DATA:
      return {
        ...state,
        attachmentData: action.attachmentData
      }

    case ActionType.SET_ATTACHMENTS_DATA:
      return {
        ...state,
        attachmentsData: action.attachmentsData
      }

    case ActionType.SET_DELETE_ATTACHMENT_ID:
      return {
        ...state,
        deleteAttachmentId: action.deleteAttachmentId
      }
  }
}

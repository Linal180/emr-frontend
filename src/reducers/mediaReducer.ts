import { Attachment, AttachmentPayload, AttachmentsPayload, AttachmentWithPreSignedUrlPayload, CreateAttachmentInput, PracticePayload } from "../generated/graphql";
import { SelectorOption } from "../interfacesTypes";

export interface State {
  page: number
  totalPages: number
  searchQuery: string
  files: File[]
  action: string
  isOpen: boolean
  isEdit: boolean
  fileUrl: string
  loading: boolean
  policyId: string
  openSign: boolean
  file: File | null
  activeStep: number
  openDelete: boolean
  labResultId: string
  providerName: string
  isSignedTab: boolean
  preSignedUrl: string
  documentName: string
  attachmentId: string
  drawerOpened: boolean
  isFormLoaded: boolean
  attachmentUrl: string
  policyHolderId: string
  isEditModalOpen: boolean
  labDocumentTypeId: string
  attachments: Attachment[]
  signedByProvider: boolean
  deleteAttachmentId: string
  insuranceId: SelectorOption
  documentTypeId: SelectorOption
  attachment: Attachment | undefined
  insuranceCard1: Attachment | undefined
  insuranceCard2: Attachment | undefined
  drivingLicense1: Attachment | undefined
  drivingLicense2: Attachment | undefined;
  practiceData: PracticePayload['practice']
  attachmentData: AttachmentPayload['attachment'];
  attachmentsData: AttachmentsPayload['attachments'];
  labOrderAttachments: AttachmentsPayload['attachments']
  mediaData: Pick<CreateAttachmentInput, "title"> | undefined;
  signatureAttachmentId: string;
  documentId: string;
  policyAttachments: AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  searchQuery: '',
  files: [],
  action: '',
  file: null,
  fileUrl: '',
  policyId: '',
  activeStep: 0,
  isOpen: false,
  isEdit: false,
  loading: false,
  openSign: false,
  attachments: [],
  labResultId: '',
  documentName: "",
  attachmentId: '',
  providerName: '',
  preSignedUrl: '',
  openDelete: false,
  attachmentUrl: '',
  practiceData: null,
  policyHolderId: '',
  isFormLoaded: true,
  isSignedTab: false,
  drawerOpened: false,
  attachmentsData: [],
  mediaData: undefined,
  attachmentData: null,
  policyAttachments: [],
  labDocumentTypeId: "",
  attachment: undefined,
  isEditModalOpen: false,
  deleteAttachmentId: '',
  signedByProvider: false,
  labOrderAttachments: [],
  insuranceCard1: undefined,
  insuranceCard2: undefined,
  drivingLicense1: undefined,
  drivingLicense2: undefined,
  signatureAttachmentId: '',
  documentId: '',
  insuranceId: { id: "", name: "" },
  documentTypeId: { id: "", name: "" },
}

export enum ActionType {
  SET_PAGE = 'SetPage',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_FILE = 'setFile',
  SET_ACTION = 'setAction',
  SET_FILES = 'SET_FILES',
  SET_IS_OPEN = 'setIsOpen',
  SET_IS_EDIT = 'setIsEdit',
  SET_LOADING = 'setLoading',
  SET_FILE_URL = 'setFileUrl',
  SET_OPEN_SIGN = 'setOpenSign',
  SET_POLICY_ID = 'setPolicyId',
  SET_MEDIA_DATA = 'setMediaData',
  SET_ATTACHMENT = 'setAttachment',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_ACTIVE_STEP = 'setActiveStep',
  SET_ATTACHMENTS = 'setAttachments',
  SET_INSURANCE_ID = 'setInsuranceId',
  SET_LAB_RESULT_ID = 'setLabResultId',
  SET_IS_SIGNED_TAB = 'setIsSignedTab',
  SET_PRACTICE_DATA = 'setPracticeData',
  SET_DRAWER_OPENED = 'setDrawerOpened',
  SET_DOCUMENT_NAME = 'setDocumentName',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_PROVIDER_NAME = 'setProviderName',
  SET_PRE_SIGNED_URL = 'setPreSignedUrl',
  SET_IS_FORM_LOADED = 'setIsFormLoaded',
  SET_ATTACHMENT_URL = 'setAttachmentUrl',
  SET_ATTACHMENT_DATA = 'setAttachmentData',
  SET_INSURANCE_CARD_1 = 'setInsuranceCard1',
  SET_DOCUMENT_TYPE_ID = 'setDocumentTypeId',
  SET_POLICY_HOLDER_ID = 'setPolicyHolderId',
  SET_INSURANCE_CARD_2 = 'setInsuranceCard2',
  SET_ATTACHMENTS_DATA = 'setAttachmentsData',
  SET_DRIVING_LICENSE_1 = 'setDrivingLicense1',
  SET_DRIVING_LICENSE_2 = 'setDrivingLicense2',
  SET_SIGNED_BY_PROVIDER = 'setSignedByProvider',
  SET_POLICY_ATTACHMENTS = 'setPolicyAttachments',
  SET_LAB_DOCUMENT_TYPE_ID = 'setLabDocumentTypeId',
  SET_DELETE_ATTACHMENT_ID = 'setDeleteAttachmentId',
  SET_LAB_ORDER_ATTACHMENTS = 'setLabOrderAttachments',
  SET_IS_EDIT_MEDIA_MODAL_OPEN = 'setIsEditMediaModalOpen',
  SET_DOCUMENT_ID = 'setDocumentId'
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_FILES, files: File[] }
  | { type: ActionType.SET_ACTION, action: string }
  | { type: ActionType.SET_FILE; file: File | null }
  | { type: ActionType.SET_IS_OPEN; isOpen: boolean }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_LOADING; loading: boolean }
  | { type: ActionType.SET_FILE_URL; fileUrl: string }
  | { type: ActionType.SET_POLICY_ID; policyId: string }
  | { type: ActionType.SET_OPEN_SIGN; openSign: boolean }
  | { type: ActionType.SET_ACTIVE_STEP; activeStep: number }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_LAB_RESULT_ID; labResultId: string }
  | { type: ActionType.SET_ATTACHMENT; attachment: Attachment }
  | { type: ActionType.SET_IS_SIGNED_TAB, isSignedTab: boolean }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string }
  | { type: ActionType.SET_DOCUMENT_NAME, documentName: string }
  | { type: ActionType.SET_PROVIDER_NAME, providerName: string }
  | { type: ActionType.SET_DRAWER_OPENED; drawerOpened: boolean }
  | { type: ActionType.SET_PRE_SIGNED_URL; preSignedUrl: string }
  | { type: ActionType.SET_ATTACHMENT_URL; attachmentUrl: string }
  | { type: ActionType.SET_IS_FORM_LOADED; isFormLoaded: boolean }
  | { type: ActionType.SET_ATTACHMENTS; attachments: Attachment[] }
  | { type: ActionType.SET_POLICY_HOLDER_ID; policyHolderId: string }
  | { type: ActionType.SET_INSURANCE_ID; insuranceId: SelectorOption }
  | { type: ActionType.SET_SIGNED_BY_PROVIDER, signedByProvider: boolean }
  | { type: ActionType.SET_LAB_DOCUMENT_TYPE_ID; labDocumentTypeId: string }
  | { type: ActionType.SET_DOCUMENT_TYPE_ID; documentTypeId: SelectorOption }
  | { type: ActionType.SET_DELETE_ATTACHMENT_ID; deleteAttachmentId: string }
  | { type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN; isEditModalOpen: boolean }
  | { type: ActionType.SET_INSURANCE_CARD_1; insuranceCard1: Attachment | undefined }
  | { type: ActionType.SET_PRACTICE_DATA; practiceData: PracticePayload['practice'] }
  | { type: ActionType.SET_INSURANCE_CARD_2; insuranceCard2: Attachment | undefined }
  | { type: ActionType.SET_DRIVING_LICENSE_1; drivingLicense1: Attachment | undefined }
  | { type: ActionType.SET_DRIVING_LICENSE_2; drivingLicense2: Attachment | undefined }
  | { type: ActionType.SET_ATTACHMENT_DATA; attachmentData: AttachmentPayload['attachment'] }
  | { type: ActionType.SET_ATTACHMENTS_DATA; attachmentsData: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_MEDIA_DATA; mediaData: Pick<CreateAttachmentInput, "title"> | undefined }
  | { type: ActionType.SET_LAB_ORDER_ATTACHMENTS; labOrderAttachments: AttachmentsPayload['attachments'] }
  | { type: ActionType.SET_POLICY_ATTACHMENTS; policyAttachments: AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl'] }
  | { type: ActionType.SET_DOCUMENT_ID; documentId: string }

export const mediaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

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

    case ActionType.SET_DOCUMENT_NAME:
      return {
        ...state,
        documentName: action.documentName
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

    case ActionType.SET_IS_SIGNED_TAB:
      return {
        ...state,
        isSignedTab: action.isSignedTab
      }

    case ActionType.SET_FILES:
      return {
        ...state,
        files: action.files
      }

    case ActionType.SET_POLICY_ID:
      return {
        ...state,
        policyId: action.policyId
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

    case ActionType.SET_POLICY_ATTACHMENTS:
      return {
        ...state,
        policyAttachments: action.policyAttachments
      }

    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.loading
      }

    case ActionType.SET_DOCUMENT_TYPE_ID:
      return {
        ...state,
        documentTypeId: action.documentTypeId
      }

    case ActionType.SET_DRAWER_OPENED:
      return {
        ...state,
        drawerOpened: action.drawerOpened
      }

    case ActionType.SET_LAB_ORDER_ATTACHMENTS:
      return {
        ...state,
        labOrderAttachments: action.labOrderAttachments
      }

    case ActionType.SET_LAB_DOCUMENT_TYPE_ID:
      return {
        ...state,
        labDocumentTypeId: action.labDocumentTypeId
      }

    case ActionType.SET_LAB_RESULT_ID:
      return {
        ...state,
        labResultId: action.labResultId
      }

    case ActionType.SET_PRACTICE_DATA:
      return {
        ...state,
        practiceData: action.practiceData
      }

    case ActionType.SET_FILE:
      return {
        ...state,
        file: action.file
      }

    case ActionType.SET_DOCUMENT_ID:
      return {
        ...state,
        documentId: action.documentId
      }
  }
}
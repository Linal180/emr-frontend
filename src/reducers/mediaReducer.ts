import { Attachment, CreateAttachmentInput } from "../generated/graphql";

export interface State {
  meta: string
  isOpen: boolean
  isEdit: boolean
  fileUrl: string
  attachmentId: string
  isEditModalOpen: boolean
  attachments: Attachment[]
  deleteAttachmentId: string
  bannerAttachments: Attachment[]
  collageAttachments: Attachment[]
  attachment: Attachment | undefined
  attachmentData: Pick<CreateAttachmentInput, "title"> | undefined
}

export const initialState: State = {
  meta: "",
  fileUrl: '',
  isOpen: false,
  isEdit: false,
  attachments: [],
  attachmentId: '',
  attachment: undefined,
  bannerAttachments: [],
  collageAttachments: [],
  isEditModalOpen: false,
  deleteAttachmentId: '',
  attachmentData: undefined
}

export enum ActionType {
  SET_IS_OPEN = 'setIsOpen',
  SET_IS_EDIT = 'setIsEdit',
  SET_FILE_URL = 'setFileUrl',
  SET_ATTACHMENT = 'setAttachment',
  SET_ATTACHMENTS = 'setAttachments',
  SET_ATTACHMENT_ID = 'setAttachmentId',
  SET_ATTACHMENT_DATA = 'setAttachmentData',
  SET_DELETE_ATTACHMENT_ID = 'setDeleteAttachmentId',
  SET_IS_EDIT_MEDIA_MODAL_OPEN = 'setIsEditMediaModalOpen',
}

export type Action =
  | { type: ActionType.SET_IS_OPEN; isOpen: boolean }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_FILE_URL; fileUrl: string }
  | { type: ActionType.SET_ATTACHMENT; attachment: Attachment }
  | { type: ActionType.SET_ATTACHMENT_ID; attachmentId: string }
  | { type: ActionType.SET_ATTACHMENTS; attachments: Attachment[] }
  | { type: ActionType.SET_DELETE_ATTACHMENT_ID; deleteAttachmentId: string }
  | { type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN, isEditModalOpen: boolean }
  | { type: ActionType.SET_ATTACHMENT_DATA; attachmentData: Pick<CreateAttachmentInput, "title"> | undefined }

export const mediaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
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

    case ActionType.SET_ATTACHMENT_DATA:
      return {
        ...state,
        attachmentData: action.attachmentData
      }

    case ActionType.SET_DELETE_ATTACHMENT_ID:
      return {
        ...state,
        deleteAttachmentId: action.deleteAttachmentId
      }
  }
}

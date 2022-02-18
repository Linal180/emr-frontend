import { Attachment } from "../generated/graphql";

export interface State {
  meta: string
  isOpen: boolean
  isEdit: boolean
  isEditModalOpen: boolean
  attachments: Attachment[]
  bannerAttachments: Attachment[]
  collageAttachments: Attachment[]
  attachment: Attachment | undefined
}

export const initialState: State = {
  meta: "",
  isOpen: false,
  isEdit: false,
  attachments: [],
  attachment: undefined,
  bannerAttachments: [],
  collageAttachments: [],
  isEditModalOpen: false
}

export enum ActionType {
  SET_IS_OPEN = 'setIsOpen',
  SET_IS_EDIT = 'setIsEdit',
  SET_ATTACHMENT = 'setAttachment',
  SET_ATTACHMENTS = 'setAttachments',
  SET_IS_EDIT_MEDIA_MODAL_OPEN = 'setIsEditMediaModalOpen',
}

export type Action =
  | { type: ActionType.SET_IS_OPEN; isOpen: boolean }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_ATTACHMENT; attachment: Attachment }
  | { type: ActionType.SET_ATTACHMENTS; attachments: Attachment[] }
  | { type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN, isEditModalOpen: boolean }

export const mediaReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
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
  }
}

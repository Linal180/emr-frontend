import { AgreementsPayload } from "../generated/graphql";

export interface State {
  page: number
  pages: number
  files: File[]
  isLoaded: boolean
  withFile: boolean
  bodyStatus: boolean
  openDelete: boolean
  searchQuery: string
  agreementId: string
  agreementUrl: string
  agreementBody: string
  descriptionType: string
  isFileModalOpen: boolean
  agreementToRemove: string
  signatureRequired: boolean
  viewAgreementBeforeAgreeing: boolean
  agreements: AgreementsPayload['agreements']
}

export const initialState: State = {
  page: 1,
  pages: 0,
  files: [],
  agreements: [],
  searchQuery: '',
  agreementId: '',
  isLoaded: false,
  withFile: false,
  agreementUrl: '',
  bodyStatus: false,
  openDelete: false,
  agreementBody: '',
  agreementToRemove: '',
  isFileModalOpen: false,
  signatureRequired: false,
  descriptionType: 'Text Editor',
  viewAgreementBeforeAgreeing: false,
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_FILES = 'setFiles',
  SET_PAGES = 'setPages',
  SET_IS_LOADED = 'setIsLoaded',
  SET_WITH_FILE = 'setWithFile',
  SET_AGREEMENTS = 'setAgreements',
  SET_BODY_STATUS = 'setBodyStatus',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_AGREEMENT_ID = 'setAgreementId',
  SET_AGREEMENT_URL = 'setAgreementUrl',
  SET_AGREEMENT_BODY = 'setAgreementBody',
  SET_DESCRIPTION_TYPE = 'setDescriptionType',
  SET_IS_FILE_MODAL_OPEN = 'setIsFileModalOpen',
  SET_SIGNATURE_REQUIRED = 'setSignatureRequired',
  SET_AGREEMENT_TO_REMOVE = 'setAgreementToRemove',
  SET_VIEW_AGREEMENT_BEFORE_AGREEING = 'setViewAgreementBeforeAgreeing',
}

export type Action =
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_PAGES, pages: number }
  | { type: ActionType.SET_FILES, files: File[] }
  | { type: ActionType.SET_IS_LOADED, isLoaded: boolean }
  | { type: ActionType.SET_WITH_FILE, withFile: boolean }
  | { type: ActionType.SET_OPEN_DELETE, openDelete: boolean }
  | { type: ActionType.SET_BODY_STATUS, bodyStatus: boolean }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_AGREEMENT_ID, agreementId: string }
  | { type: ActionType.SET_AGREEMENT_URL, agreementUrl: string }
  | { type: ActionType.SET_AGREEMENT_BODY, agreementBody: string }
  | { type: ActionType.SET_DESCRIPTION_TYPE, descriptionType: string }
  | { type: ActionType.SET_AGREEMENT_TO_REMOVE, agreementToRemove: string }
  | { type: ActionType.SET_IS_FILE_MODAL_OPEN, isFileModalOpen: boolean }
  | { type: ActionType.SET_SIGNATURE_REQUIRED, signatureRequired: boolean }
  | { type: ActionType.SET_AGREEMENTS, agreements: AgreementsPayload['agreements'] }
  | { type: ActionType.SET_VIEW_AGREEMENT_BEFORE_AGREEING, viewAgreementBeforeAgreeing: boolean }

export const agreementReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_AGREEMENTS:
      return {
        ...state,
        agreements: action.agreements
      }

    case ActionType.SET_AGREEMENT_URL:
      return {
        ...state,
        agreementUrl: action.agreementUrl
      }

    case ActionType.SET_PAGES:
      return {
        ...state,
        pages: action.pages
      }

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_AGREEMENT_TO_REMOVE:
      return {
        ...state,
        agreementToRemove: action.agreementToRemove
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_IS_FILE_MODAL_OPEN:
      return {
        ...state,
        isFileModalOpen: action.isFileModalOpen
      }

    case ActionType.SET_FILES:
      return {
        ...state,
        files: action.files
      }

    case ActionType.SET_SIGNATURE_REQUIRED:
      return {
        ...state,
        signatureRequired: action.signatureRequired
      }

    case ActionType.SET_VIEW_AGREEMENT_BEFORE_AGREEING:
      return {
        ...state,
        viewAgreementBeforeAgreeing: action.viewAgreementBeforeAgreeing
      }

    case ActionType.SET_AGREEMENT_BODY:
      return {
        ...state,
        agreementBody: action.agreementBody
      }

    case ActionType.SET_AGREEMENT_ID:
      return {
        ...state,
        agreementId: action.agreementId
      }

    case ActionType.SET_DESCRIPTION_TYPE:
      return {
        ...state,
        descriptionType: action.descriptionType
      }

    case ActionType.SET_IS_LOADED:
      return {
        ...state,
        isLoaded: action.isLoaded
      }

    case ActionType.SET_WITH_FILE:
      return {
        ...state,
        withFile: action.withFile
      }

    case ActionType.SET_BODY_STATUS:
      return {
        ...state,
        bodyStatus: action.bodyStatus
      }
  }
};

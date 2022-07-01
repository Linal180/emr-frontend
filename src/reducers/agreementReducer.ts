import {
  AgreementsPayload
} from "../generated/graphql";

export interface State {
  agreements: AgreementsPayload['agreements']
  agreementUrl: string
  pages: number
  page: number
  openDelete: boolean
  agreementToRemove: string
  searchQuery: string
  isFileModalOpen: boolean
  files: File[]
  signatureRequired: boolean
  viewAgreementBeforeAgreeing: boolean
  agreementBody: string
  agreementId: string
  descriptionType: string
  isLoaded: boolean
  withFile: boolean
}

export const initialState: State = {
  agreements: [],
  agreementUrl: '',
  pages: 0,
  page: 1,
  openDelete: false,
  agreementToRemove: '',
  searchQuery: '',
  isFileModalOpen: false,
  files: [],
  signatureRequired: false,
  viewAgreementBeforeAgreeing: false,
  agreementBody: '',
  agreementId: '',
  descriptionType: 'Text Editor',
  isLoaded: false,
  withFile: false,
}

export enum ActionType {
  SET_AGREEMENTS = 'SET_AGREEMENTS',
  SET_AGREEMENT_URL = 'SET_AGREEMENT_URL',
  SET_PAGES = 'SET_PAGES',
  SET_PAGE = 'SET_PAGE',
  SET_OPEN_DELETE = 'SET_OPEN_DELETE',
  SET_AGREEMENT_TO_REMOVE = 'SET_AGREEMENT_TO_REMOVE',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_IS_FILE_MODAL_OPEN = 'SET_IS_FILE_MODAL_OPEN',
  SET_FILES = 'SET_FILES',
  SET_SIGNATURE_REQUIRED = 'SET_SIGNATURE_REQUIRED',
  SET_VIEW_AGREEMENT_BEFORE_AGREEING = 'SET_VIEW_AGREEMENT_BEFORE_AGREEING',
  SET_AGREEMENT_BODY = 'SET_AGREEMENT_BODY',
  SET_AGREEMENT_ID = 'SET_AGREEMENT_ID',
  SET_DESCRIPTION_TYPE = 'SET_DESCRIPTION_TYPE',
  SET_IS_LOADED = 'SET_IS_LOADED',
  SET_WITH_FILE = 'SET_WITH_FILE'
}

export type Action =
  | { type: ActionType.SET_AGREEMENTS, agreements: AgreementsPayload['agreements'] }
  | { type: ActionType.SET_AGREEMENT_URL, agreementUrl: string }
  | { type: ActionType.SET_PAGES, pages: number }
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_OPEN_DELETE, openDelete: boolean }
  | { type: ActionType.SET_AGREEMENT_TO_REMOVE, agreementToRemove: string }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_IS_FILE_MODAL_OPEN, isFileModalOpen: boolean }
  | { type: ActionType.SET_FILES, files: File[] }
  | { type: ActionType.SET_SIGNATURE_REQUIRED, signatureRequired: boolean }
  | { type: ActionType.SET_VIEW_AGREEMENT_BEFORE_AGREEING, viewAgreementBeforeAgreeing: boolean }
  | { type: ActionType.SET_AGREEMENT_BODY, agreementBody: string }
  | { type: ActionType.SET_AGREEMENT_ID, agreementId: string }
  | { type: ActionType.SET_DESCRIPTION_TYPE, descriptionType: string }
  | { type: ActionType.SET_IS_LOADED, isLoaded: boolean }
  | { type: ActionType.SET_WITH_FILE, withFile: boolean }

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
  }
};

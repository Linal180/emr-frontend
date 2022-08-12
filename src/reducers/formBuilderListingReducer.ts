import { FormsPayload, FormTabs } from "../generated/graphql";

export interface State {
  page: number;
  copied: boolean;
  formName: string;
  totalPages: number;
  openShare: boolean;
  searchQuery: string;
  openDelete: boolean;
  formEmbedUrl: string;
  deleteFormId: string;
  openPreview: boolean;
  formPreviewData: FormTabs[];
  forms: FormsPayload['forms'];
}

export const initialState: State = {
  page: 1,
  forms: [],
  formName: '',
  totalPages: 0,
  copied: false,
  searchQuery: '',
  openShare: false,
  formEmbedUrl: '',
  deleteFormId: '',
  openDelete: false,
  openPreview: false,
  formPreviewData: [],
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_FORMS = "setForms",
  SET_COPIED = 'SET_COPIED',
  SET_FORM_NAME = 'setFormName',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_OPEN_SHARE = 'SET_OPEN_SHARE',
  SET_OPEN_PREVIEW = 'setOpenPreview',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_OPEN_DELETE = 'SET_OPEN_DELETE',
  SET_PREVIEW_DATA = 'setPreviewData',
  SET_DELETE_FORM_ID = 'SET_DELETE_FORM_ID',
  SET_FORM_EMBED_URL = 'SET_FORM_EMBED_URL',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_COPIED; copied: boolean; }
  | { type: ActionType.SET_FORM_NAME; formName: string; }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_OPEN_SHARE; openShare: boolean; }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean; }
  | { type: ActionType.SET_OPEN_PREVIEW; openPreview: boolean; }
  | { type: ActionType.SET_FORM_EMBED_URL; formEmbedUrl: string }
  | { type: ActionType.SET_FORMS; forms: FormsPayload['forms']; }
  | { type: ActionType.SET_DELETE_FORM_ID; deleteFormId: string; }
  | { type: ActionType.SET_PREVIEW_DATA; formPreviewData: FormTabs[]; }

export const formBuilderListingReducer = (state: State, action: Action): State => {
  switch (action.type) {

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_FORM_EMBED_URL:
      return {
        ...state,
        formEmbedUrl: action.formEmbedUrl
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

    case ActionType.SET_COPIED:
      return {
        ...state,
        copied: action.copied
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_OPEN_SHARE:
      return {
        ...state,
        openShare: action.openShare
      }

    case ActionType.SET_DELETE_FORM_ID:
      return {
        ...state,
        deleteFormId: action.deleteFormId
      }

    case ActionType.SET_FORMS:
      return {
        ...state,
        forms: action.forms
      }

    case ActionType.SET_FORM_NAME:
      return {
        ...state,
        formName: action.formName
      }

    case ActionType.SET_OPEN_PREVIEW:
      return {
        ...state,
        openPreview: action.openPreview
      }

    case ActionType.SET_PREVIEW_DATA:
      return {
        ...state,
        formPreviewData: action.formPreviewData
      }
  }
}
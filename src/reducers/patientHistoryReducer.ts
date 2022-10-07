import { FindAllQuestionTemplatesPayload, QuestionTemplatePayload } from "../generated/graphql";

export interface State {
  page: number;
  totalPages: number;
  itemId: string;
  templates: FindAllQuestionTemplatesPayload['templates']
  template: QuestionTemplatePayload['template'] | null
  searchQuery: string
}

export const initialState: State = {
  page: 1,
  itemId: '',
  templates: [],
  template: null,
  totalPages: 0,
  searchQuery: ''
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_ITEM_ID = 'SET_ITEM_ID',
  SET_TEMPLATES = 'setTemplates',
  SET_TEMPLATE = 'setTemplate',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery'
}

export type Action =
  { type: ActionType.SET_PAGE; page: number } |
  { type: ActionType.SET_ITEM_ID, itemId: string } |
  { type: ActionType.SET_TOTAL_PAGES; totalPages: number } |
  { type: ActionType.SET_SEARCH_QUERY; searchQuery: string } |
  { type: ActionType.SET_TEMPLATES; templates: FindAllQuestionTemplatesPayload['templates'] } |
  { type: ActionType.SET_TEMPLATE; template: QuestionTemplatePayload['template'] | null }


export const patientHistoryReducer = (state: State, action: Action): State => {
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

    case ActionType.SET_TEMPLATES:
      return {
        ...state,
        templates: action.templates
      }

    case ActionType.SET_TEMPLATE:
      return {
        ...state,
        template: action.template
      }

    case ActionType.SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }
  }
}
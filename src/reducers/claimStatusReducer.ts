import { BillingPayload, BillingsPayload } from "../generated/graphql";

export interface State {
  page: number;
  totalPages: number;
  openAdvancedSearch: boolean;
  isRejectedModalOpen: boolean;
  claimStatuses: BillingsPayload['billings'];
  selectedClaim: BillingPayload['billing'] | null
}

export const initialState: State = {
  page: 1,
  totalPages: 0,
  claimStatuses: [],
  openAdvancedSearch: false,
  isRejectedModalOpen: false,
  selectedClaim: null
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_ADVANCE_MODAL = 'setAdvanceModal',
  SET_SELECTED_CLAIM = 'setSelectedClaim',
  SET_REJECTED_MODAL = 'setRejectedModal',
  SET_BILLING_STATUSES = 'setBillingStatuses',
}

export type Action =
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_TOTAL_PAGES, totalPages: number }
  | { type: ActionType.SET_ADVANCE_MODAL, openAdvancedSearch: boolean }
  | { type: ActionType.SET_REJECTED_MODAL, isRejectedModalOpen: boolean }
  | { type: ActionType.SET_BILLING_STATUSES, claimStatuses: BillingsPayload['billings'] }
  | { type: ActionType.SET_SELECTED_CLAIM, selectedClaim: BillingPayload['billing'] | null }

export const claimStatusReducer = (state: State, action: Action): State => {

  switch (action.type) {

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_ADVANCE_MODAL:
      return {
        ...state,
        openAdvancedSearch: action.openAdvancedSearch
      }

    case ActionType.SET_REJECTED_MODAL:
      return {
        ...state,
        isRejectedModalOpen: action.isRejectedModalOpen
      }

    case ActionType.SET_BILLING_STATUSES:
      return {
        ...state,
        claimStatuses: action.claimStatuses
      }

    case ActionType.SET_SELECTED_CLAIM:
      return {
        ...state,
        selectedClaim: action.selectedClaim
      }
  }
}

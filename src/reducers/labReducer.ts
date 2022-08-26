import { LabTests, LabTestsPayload } from "../generated/graphql"

export interface State {
  labOrders: LabTestsPayload['labTests']
  page: number
  pages: number
  resultReceived: boolean
  receivedDate: string
  searchQuery: string
  isStickerModalOpen: boolean
  stickerOrder: string
  isEdit: boolean
  orderNum: string
  drawerOpened: boolean
  labTestIds: string[]
  labTestsToEdit: LabTests[]
}

export const initialState: State = {
  labOrders: [],
  page: 1,
  pages: 0,
  resultReceived: true,
  receivedDate: '',
  searchQuery: '',
  isStickerModalOpen: false,
  stickerOrder: '',
  isEdit: false,
  orderNum: '',
  drawerOpened: false,
  labTestIds: [],
  labTestsToEdit: []
}

export enum ActionType {
  SET_LAB_ORDERS = 'setLabOrders',
  SET_PAGE = 'setPage',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_RESULT_RECEIVED = 'setResultReceived',
  SET_RECEIVED_DATE = 'setReceivedDate',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_IS_STICKER_MODAL_OPEN = 'setIsStickerModalOpen',
  SET_STICKER_ORDER = 'setStickerOrder',
  SET_IS_EDIT = 'setIsEdit',
  SET_ORDER_NUM = 'setOrderNum',
  SET_DRAWER_OPENED = 'setDrawerOpened',
  SET_LAB_TEST_IDS = 'setLabTestIds',
  SET_LAB_TESTS_TO_EDIT = 'setLabTestsToEdit'
}

export type Action =
  | { type: ActionType.SET_LAB_ORDERS, labOrders: LabTestsPayload['labTests'] }
  | { type: ActionType.SET_PAGE, page: number }
  | { type: ActionType.SET_TOTAL_PAGES, pages: number }
  | { type: ActionType.SET_RESULT_RECEIVED, resultReceived: boolean }
  | { type: ActionType.SET_RECEIVED_DATE, receivedDate: string }
  | { type: ActionType.SET_SEARCH_QUERY, searchQuery: string }
  | { type: ActionType.SET_IS_STICKER_MODAL_OPEN, isStickerModalOpen: boolean }
  | { type: ActionType.SET_STICKER_ORDER, stickerOrder: string }
  | { type: ActionType.SET_IS_EDIT, isEdit: boolean }
  | { type: ActionType.SET_ORDER_NUM, orderNum: string }
  | { type: ActionType.SET_DRAWER_OPENED, drawerOpened: boolean }
  | { type: ActionType.SET_LAB_TEST_IDS, labTestIds: string[] }
  | { type: ActionType.SET_LAB_TESTS_TO_EDIT, labTestsToEdit: LabTests[] }


export const labReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_LAB_ORDERS:
      return {
        ...state,
        labOrders: action.labOrders
      }

    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        pages: action.pages
      }

    case ActionType.SET_RESULT_RECEIVED:
      return {
        ...state,
        resultReceived: action.resultReceived
      }

    case ActionType.SET_RECEIVED_DATE:
      return {
        ...state,
        receivedDate: action.receivedDate
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_STICKER_ORDER:
      return {
        ...state,
        stickerOrder: action.stickerOrder
      }

    case ActionType.SET_IS_STICKER_MODAL_OPEN:
      return {
        ...state,
        isStickerModalOpen: action.isStickerModalOpen
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_ORDER_NUM:
      return {
        ...state,
        orderNum: action.orderNum
      }

    case ActionType.SET_DRAWER_OPENED:
      return {
        ...state,
        drawerOpened: action.drawerOpened
      }

    case ActionType.SET_LAB_TEST_IDS:
      return {
        ...state,
        labTestIds: action.labTestIds
      }

    case ActionType.SET_LAB_TESTS_TO_EDIT:
      return {
        ...state,
        labTestsToEdit: action.labTestsToEdit
      }
  }
};

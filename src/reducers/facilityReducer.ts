// packages block
import { usStreet } from "smartystreets-javascript-sdk";
// constant and interfaces block
import { USA } from "../constants";
import { SmartyUserData, FacilityBillingType } from "../interfacesTypes";
import { FacilitiesPayload, FacilityPayload } from "../generated/graphql";

export interface State {
  page: number;
  isEdit: boolean;
  tabValue: string;
  billingId: string;
  contactId: string;
  totalPages: number;
  openModal: boolean;
  facilityId: string;
  openDelete: boolean;
  addBilling: boolean;
  searchQuery: string;
  isVerified: boolean;
  hasBilling: boolean;
  addressOpen: boolean;
  sameAddress: boolean;
  userData: SmartyUserData;
  deleteFacilityId: string;
  data: usStreet.Candidate[];
  billingData: FacilityBillingType;
  facility: FacilityPayload['facility'];
  facilities: FacilitiesPayload['facilities'];
}

export const initialState: State = {
  page: 1,
  data: [],
  tabValue: '1',
  totalPages: 0,
  billingId: '',
  contactId: '',
  isEdit: false,
  facility: null,
  facilities: [],
  facilityId: '',
  searchQuery: '',
  openModal: false,
  hasBilling: false,
  addBilling: false,
  openDelete: false,
  isVerified: false,
  addressOpen: false,
  sameAddress: false,
  deleteFacilityId: '',
  userData: { street: '', address: '' },
  billingData: {
    billingFax: '',
    billingCity: '',
    billingPhone: '',
    billingEmail: '',
    billingState: '',
    billingAddress: '',
    billingZipCode: '',
    billingAddress2: '',
    billingCountry: USA
  }
}

export enum ActionType {
  SET_PAGE = 'setPage',
  SET_DATA = 'setData',
  SET_IS_EDIT = 'setIsEdit',
  SET_FACILITY = 'setFacility',
  SET_TAB_VALUE = 'setTabValue',
  SET_USER_DATA = 'setUserData',
  SET_CONTACT_ID = 'setContactId',
  SET_BILLING_ID = 'setBillingId',
  SET_OPEN_MODAL = 'setOpenModal',
  SET_FACILITIES = 'setFacilities',
  SET_HAS_BILLING = 'setHasBilling',
  SET_FACILITY_ID = 'setFacilityId',
  SET_ADD_BILLING = 'setAddBilling',
  SET_OPEN_DELETE = 'setOpenDelete',
  SET_IS_VERIFIED = 'setIsVerified',
  SET_TOTAL_PAGES = 'setTotalPages',
  SET_SEARCH_QUERY = 'setSearchQuery',
  SET_SAME_ADDRESS = 'setSameAddress',
  SET_ADDRESS_OPEN = 'setAddressOpen',
  SET_BILLING_DATA = 'setBillingData',
  SET_DELETE_FACILITY_ID = 'setDeleteFacilityId',
}

export type Action =
  | { type: ActionType.SET_PAGE; page: number }
  | { type: ActionType.SET_IS_EDIT; isEdit: boolean }
  | { type: ActionType.SET_TAB_VALUE; tabValue: string }
  | { type: ActionType.SET_CONTACT_ID; contactId: string }
  | { type: ActionType.SET_BILLING_ID; billingId: string }
  | { type: ActionType.SET_OPEN_MODAL; openModal: boolean }
  | { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
  | { type: ActionType.SET_FACILITY_ID; facilityId: string }
  | { type: ActionType.SET_HAS_BILLING, hasBilling: boolean }
  | { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
  | { type: ActionType.SET_IS_VERIFIED; isVerified: boolean }
  | { type: ActionType.SET_DATA; data: usStreet.Candidate[] }
  | { type: ActionType.SET_ADD_BILLING, addBilling: boolean }
  | { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
  | { type: ActionType.SET_ADDRESS_OPEN; addressOpen: boolean }
  | { type: ActionType.SET_SAME_ADDRESS, sameAddress: boolean }
  | { type: ActionType.SET_USER_DATA; userData: SmartyUserData }
  | { type: ActionType.SET_DELETE_FACILITY_ID; deleteFacilityId: string }
  | { type: ActionType.SET_BILLING_DATA, billingData: FacilityBillingType }
  | { type: ActionType.SET_FACILITY; facility: FacilityPayload['facility'] }
  | { type: ActionType.SET_FACILITIES; facilities: FacilitiesPayload['facilities'] }

export const facilityReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_PAGE:
      return {
        ...state,
        page: action.page
      }

    case ActionType.SET_CONTACT_ID:
      return {
        ...state,
        contactId: action.contactId
      }

    case ActionType.SET_BILLING_ID:
      return {
        ...state,
        billingId: action.billingId
      }

    case ActionType.SET_ADD_BILLING:
      return {
        ...state,
        addBilling: action.addBilling
      }

    case ActionType.SET_HAS_BILLING:
      return {
        ...state,
        hasBilling: action.hasBilling
      }

    case ActionType.SET_SAME_ADDRESS:
      return {
        ...state,
        sameAddress: action.sameAddress
      }

    case ActionType.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      }

    case ActionType.SET_FACILITY_ID:
      return {
        ...state,
        facilityId: action.facilityId
      }

    case ActionType.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: action.openModal
      }

    case ActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.searchQuery
      }

    case ActionType.SET_OPEN_DELETE:
      return {
        ...state,
        openDelete: action.openDelete
      }

    case ActionType.SET_FACILITY:
      return {
        ...state,
        facility: action.facility
      }

    case ActionType.SET_FACILITIES:
      return {
        ...state,
        facilities: action.facilities
      }

    case ActionType.SET_DELETE_FACILITY_ID:
      return {
        ...state,
        deleteFacilityId: action.deleteFacilityId
      }

    case ActionType.SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_IS_VERIFIED:
      return {
        ...state,
        isVerified: action.isVerified
      }

    case ActionType.SET_ADDRESS_OPEN:
      return {
        ...state,
        addressOpen: action.addressOpen
      }

    case ActionType.SET_DATA:
      return {
        ...state,
        data: action.data
      }

    case ActionType.SET_TAB_VALUE:
      return {
        ...state,
        tabValue: action.tabValue
      }

    case ActionType.SET_USER_DATA:
      return {
        ...state,
        userData: action.userData
      }

    case ActionType.SET_BILLING_DATA:
      return {
        ...state,
        billingData: action.billingData
      }
  };
}

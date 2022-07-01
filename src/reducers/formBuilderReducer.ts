import { FIELD_EDIT_INITIAL_VALUES, getFormInitialValues } from "../constants";
import { FormsPayload, FormTabsInputs } from "../generated/graphql";
import { FormInitialType } from "../interfacesTypes";

export interface State {
  isActive: boolean;
  openTemplate: boolean;
  formName: string;
  colMenu: HTMLElement | null;
  selected: FormInitialType;
  formValues: FormTabsInputs[];
  isEdit: string;
  sectionValue: string;
  preDefinedComponent: FormsPayload['forms'],
  formFacility: string;
  formPractice: string;
  selectedTab: string;
  tabOptions: string
}

export const initialState: State = {
  isActive: false,
  openTemplate: false,
  formName: '',
  colMenu: null,
  selected: FIELD_EDIT_INITIAL_VALUES,
  formValues: getFormInitialValues(),
  isEdit: '',
  sectionValue: '',
  preDefinedComponent: [],
  formFacility: "",
  formPractice: "",
  selectedTab: '0',
  tabOptions: ''
}

export enum ActionType {
  SET_ACTIVE = 'setIsActive',
  SET_OPEN_TEMPLATE = 'setOpenTemplate',
  SET_FORM_NAME = 'setFormName',
  SET_COL_MENU = 'setColMenu',
  SET_SELECTED_FIELD = 'setSelected',
  SET_FORM_VALUES = 'setFormValues',
  SET_SECTION_EDIT = 'setEdit',
  SET_SECTION_VALUE = 'setSectionValue',
  SET_PRE_DEFINED_COMPONENTS = 'setPreDefinedComponents',
  SET_FACILITY = "setFacility",
  SET_PRACTICE = "setPractice",
  SET_TAB = 'setTab',
  SET_TAB_OPTIONS = 'setSelectTab'
}

export type Action = { type: ActionType.SET_ACTIVE; isActive: boolean } |
{ type: ActionType.SET_OPEN_TEMPLATE; openTemplate: boolean } |
{ type: ActionType.SET_FORM_NAME; formName: string } |
{ type: ActionType.SET_COL_MENU; colMenu: HTMLElement | null } |
{ type: ActionType.SET_SELECTED_FIELD; selected: FormInitialType } |
{ type: ActionType.SET_FORM_VALUES; formValues: FormTabsInputs[] } |
{ type: ActionType.SET_SECTION_EDIT; isEdit: string } |
{ type: ActionType.SET_SECTION_VALUE; sectionValue: string } |
{ type: ActionType.SET_PRE_DEFINED_COMPONENTS; preDefinedComponent: FormsPayload['forms'] } |
{ type: ActionType.SET_FACILITY; formFacility: string } |
{ type: ActionType.SET_PRACTICE; formPractice: string } |
{ type: ActionType.SET_TAB; selectedTab: string } |
{ type: ActionType.SET_TAB_OPTIONS; tabOptions: string }

export const formBuilderReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_ACTIVE:
      return {
        ...state,
        isActive: action.isActive
      }

    case ActionType.SET_OPEN_TEMPLATE:
      return {
        ...state,
        openTemplate: action.openTemplate
      }

    case ActionType.SET_FORM_NAME:
      return {
        ...state,
        formName: action.formName
      }

    case ActionType.SET_COL_MENU:
      return {
        ...state,
        colMenu: action.colMenu
      }

    case ActionType.SET_SELECTED_FIELD:
      return {
        ...state,
        selected: action.selected
      }

    case ActionType.SET_FORM_VALUES:
      return {
        ...state,
        formValues: action.formValues
      }

    case ActionType.SET_SECTION_EDIT:
      return {
        ...state,
        isEdit: action.isEdit
      }

    case ActionType.SET_SECTION_VALUE:
      return {
        ...state,
        sectionValue: action.sectionValue
      }

    case ActionType.SET_PRE_DEFINED_COMPONENTS:
      return {
        ...state,
        preDefinedComponent: action.preDefinedComponent
      }

    case ActionType.SET_FACILITY:
      return {
        ...state,
        formFacility: action.formFacility
      }

    case ActionType.SET_PRACTICE:
      return {
        ...state,
        formPractice: action.formPractice
      }

    case ActionType.SET_TAB:
      return {
        ...state,
        selectedTab: action.selectedTab
      }

    case ActionType.SET_TAB_OPTIONS:
      return {
        ...state,
        tabOptions: action.tabOptions
      }
  }
}
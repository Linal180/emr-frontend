import { FIELD_EDIT_INITIAL_VALUES, getFormInitialValues } from "../constants";
import { FormsPayload, SectionsInputs } from "../generated/graphql";
import { FormInitialType } from "../interfacesTypes";

export interface State {
  isActive: boolean;
  openTemplate: boolean;
  formName: string;
  colMenu: HTMLElement | null;
  selected: FormInitialType;
  formValues: SectionsInputs[];
  isEdit: string;
  sectionValue: string;
  preDefinedComponent: FormsPayload['forms']
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
  preDefinedComponent: []
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
}

export type Action = { type: ActionType.SET_ACTIVE; isActive: boolean } |
{ type: ActionType.SET_OPEN_TEMPLATE; openTemplate: boolean } |
{ type: ActionType.SET_FORM_NAME; formName: string } |
{ type: ActionType.SET_COL_MENU; colMenu: HTMLElement | null } |
{ type: ActionType.SET_SELECTED_FIELD; selected: FormInitialType } |
{ type: ActionType.SET_FORM_VALUES; formValues: SectionsInputs[] } |
{ type: ActionType.SET_SECTION_EDIT; isEdit: string } |
{ type: ActionType.SET_SECTION_VALUE; sectionValue: string } |
{ type: ActionType.SET_PRE_DEFINED_COMPONENTS; preDefinedComponent: FormsPayload['forms'] }

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

    default:
      return state
  }
}
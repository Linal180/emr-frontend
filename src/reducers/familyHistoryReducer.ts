import { FamilyHistoriesPayload } from "../generated/graphql";


export interface State {
	page: number;
	openAdd: boolean;
	totalPages: number;
	openDelete: boolean;
	delFamilyId: string;
	editFamilyId: string;
	familyHistories: FamilyHistoriesPayload['familyHistories']
}


export const initialState: State = {
	page: 1,
	totalPages: 0,
	openAdd: false,
	delFamilyId: '',
	editFamilyId: '',
	openDelete: false,
	familyHistories: [],
}

export enum ActionType {
	SET_PAGE = 'setPage',
	SET_OPEN_ADD = 'setOpenAdd',
	SET_TOTAL_PAGES = 'SET_TOTAL_PAGES',
	SET_OPEN_DELETE = "SET_OPEN_DELETE",
	SET_DEL_FAMILY_ID = 'SET_DEL_FAMILY_ID',
	SET_EDIT_FAMILY_ID = 'SET_EDIT_FAMILY_ID',
	SET_FAMILY_HISTORIES = 'SET_FAMILY_HISTORIES',
}

export type Action =
	| { type: ActionType.SET_PAGE; page: number }
	| { type: ActionType.SET_OPEN_ADD; openAdd: boolean }
	| { type: ActionType.SET_TOTAL_PAGES; totalPages: number }
	| { type: ActionType.SET_OPEN_DELETE; openDelete: boolean }
	| { type: ActionType.SET_DEL_FAMILY_ID; delFamilyId: string }
	| { type: ActionType.SET_EDIT_FAMILY_ID; editFamilyId: string }
	| { type: ActionType.SET_FAMILY_HISTORIES; familyHistories: FamilyHistoriesPayload['familyHistories'] }


export const familyHistoryReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case ActionType.SET_PAGE:
			return {
				...state,
				page: action.page
			}

		case ActionType.SET_OPEN_ADD:
			return {
				...state,
				openAdd: action.openAdd
			}

		case ActionType.SET_FAMILY_HISTORIES:
			return {
				...state,
				familyHistories: action.familyHistories
			}

		case ActionType.SET_TOTAL_PAGES:
			return {
				...state,
				totalPages: action.totalPages
			}

		case ActionType.SET_OPEN_DELETE:
			return {
				...state,
				openDelete: action.openDelete
			}

		case ActionType.SET_DEL_FAMILY_ID:
			return {
				...state,
				delFamilyId: action.delFamilyId
			}

		case ActionType.SET_EDIT_FAMILY_ID:
			return {
				...state,
				editFamilyId: action.editFamilyId
			}
	}
}
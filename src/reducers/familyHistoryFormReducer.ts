import { IcdCodesPayload } from "../generated/graphql";


export interface State {
	problem: string;
	searchQuery: string;
	searchedData: IcdCodesPayload['icdCodes']
}


export const initialState: State = {
	problem: '',
	searchQuery: '',
	searchedData: []
}

export enum ActionType {
	SET_PROBLEM = 'setProblem',
	SET_SEARCH_QUERY = 'setSearchQuery',
	SET_SEARCHED_DATA = 'setSearchData'
}

export type Action =
	| { type: ActionType.SET_PROBLEM; problem: string }
	| { type: ActionType.SET_SEARCH_QUERY; searchQuery: string }
	| { type: ActionType.SET_SEARCHED_DATA, searchedData: IcdCodesPayload['icdCodes'] }


export const familyHistoryFormReducer = (state: State, action: Action): State => {
	switch (action.type) {

		case ActionType.SET_PROBLEM:
			return {
				...state,
				problem: action.problem
			}

		case ActionType.SET_SEARCH_QUERY:
			return {
				...state,
				searchQuery: action.searchQuery
			}

		case ActionType.SET_SEARCHED_DATA:
			return {
				...state,
				searchedData: action.searchedData
			}
	}
}
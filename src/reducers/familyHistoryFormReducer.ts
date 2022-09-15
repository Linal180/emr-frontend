

export interface State {
	problem: string
}


export const initialState: State = {
	problem: ''
}

export enum ActionType {
	SET_PROBLEM = 'setProblem'
}

export type Action =
	| { type: ActionType.SET_PROBLEM; problem: string }


export const familyHistoryFormReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case ActionType.SET_PROBLEM:
			return {
				...state,
				problem: action.problem
			}
	}
}
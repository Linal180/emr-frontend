// packages block
import { createContext, FC, useCallback, useReducer, Reducer, useEffect, useContext } from "react";
import { pluck } from "underscore"
// graphql, interfaces/types, reducer and constants block
import { TOKEN } from "../constants";
import { ChartContextInterface } from "../interfacesTypes";
import { ReactionsPayload, useFindAllReactionsLazyQuery } from "../generated/graphql";
import {
  Action, ActionType, initialState, chartReducer, State as LocalState
} from '../reducers/chartReducer';
import { AuthContext } from "./authContext";

export const ChartContext = createContext<ChartContextInterface>({
  reactionList: [],
  fetchAllReactionList: (name: string) => { }
});

export const ChartContextProvider: FC = ({ children }): JSX.Element => {
  const { isLoggedIn } = useContext(AuthContext);
  const hasToken = localStorage.getItem(TOKEN);
  const [{ reactionList, reactionPages }, dispatch] = useReducer<Reducer<LocalState, Action>>(chartReducer, initialState)

  const [findAllReactions] = useFindAllReactionsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllReactions: { reactions, pagination } } = data

        !!reactions &&
          setReactionList(reactions as ReactionsPayload['reactions'])

        if (pagination) {
          const { totalPages } = pagination

          if (totalPages ? reactionPages !== totalPages : false) {
            dispatch({ type: ActionType.SET_REACTION_PAGES, reactionPages: reactionPages + 1 });
          }
        }
      }
    }
  })

  const fetchAllReactionList = useCallback(async (name = '', page = 1) => {
    try {
      const pageInput = { paginationOptions: { limit: 5, page } }
      const reactionInputs = name ? { reactionName: name, ...pageInput } : { ...pageInput }

      await findAllReactions({
        variables: { reactionInput: { ...reactionInputs } }
      })
    } catch { }
  }, [findAllReactions])

  const setReactionList = (reactions: ReactionsPayload['reactions']) => {
    if (!!reactionList) {
      const alreadyFetched = pluck(reactionList, 'id');
      let newlyFetched: ReactionsPayload['reactions'] = []

      reactions?.map(reaction => {
        const { id } = reaction || {}

        return !alreadyFetched.includes(id) && newlyFetched?.push(reaction)
      })

      dispatch({
        type: ActionType.SET_REACTION_LIST,
        reactionList: [...reactionList, ...newlyFetched] as ReactionsPayload['reactions']
      });
    }
  }

  useEffect(() => {
    hasToken && isLoggedIn && fetchAllReactionList('', reactionPages)
  }, [fetchAllReactionList, hasToken, isLoggedIn, reactionPages])

  return (
    <ChartContext.Provider
      value={{
        reactionList,
        fetchAllReactionList
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

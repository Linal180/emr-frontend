// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import { FacilitiesPayload, useFindAllFacilitiesLazyQuery } from "../generated/graphql";
import { Action, ActionType, initialState, listContextReducer, State as LocalState } from '../reducers/listContextReducer';

export const ListContext = createContext<ListContextInterface>({
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const { facilityPages, facilityList } = state;

  const [findAllFacility] = useFindAllFacilitiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllFacility: { facility, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? facilityPages !== totalPages : false) {
            setFacilityPages(facilityPages + 1)
          }
        }

        !!facility && !!facilityList && setFacilityList([...facilityList, ...facility])
      }
    }
  })

  const fetchAllFacilityList = useCallback((page = 1) => {
    dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [] })

    findAllFacility({
      variables: {
        facilityInput: {
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllFacility])



  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])

  const setFacilityList = (facilities: FacilitiesPayload['facility']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });

  return (
    <ListContext.Provider
      value={{
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

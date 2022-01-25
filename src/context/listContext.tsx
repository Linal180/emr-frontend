// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, FacilitiesPayload, useFindAllFacilitiesLazyQuery,
} from "../generated/graphql";
import { Action, ActionType, initialState, listContextReducer, State as LocalState } from '../reducers/listContextReducer';

export const ListContext = createContext<ListContextInterface>({
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
  doctorList: [],
  setDoctorList: () => { },
  fetchAllDoctorList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const { doctorPages, doctorList, facilityPages, facilityList, serviceList, servicePages } = state;

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

  const [findAllDoctor] = useFindAllDoctorLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllDoctor: { doctors, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? doctorPages !== totalPages : false) {
            setDoctorPages(doctorPages + 1)
          }
        }

        !!doctors && !!doctorList && setDoctorList([...doctorList, ...doctors])
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

  const fetchAllDoctorList = useCallback((page = 1) => {
    dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [] })

    findAllDoctor({
      variables: {
        doctorInput: {
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllDoctor])

  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])
  useEffect(() => { hasToken && fetchAllDoctorList(doctorPages) }, [fetchAllDoctorList, hasToken, doctorPages])

  const setFacilityList = (facilities: FacilitiesPayload['facility']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: doctors });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setDoctorPages = (pageNumber: number) => dispatch({ type: ActionType.SET_DOCTOR_PAGES, doctorPages: pageNumber });

  return (
    <ListContext.Provider
      value={{
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
        doctorList,
        setDoctorList,
        fetchAllDoctorList
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

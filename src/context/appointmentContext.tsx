// packages block
import { createContext, FC, useCallback, useReducer, Reducer, useEffect } from "react";
// graphql, interfaces/types, reducer and constants block
import { PAGE_LIMIT, TOKEN } from "../constants";
import { AppointmentContextInterface } from "../interfacesTypes";
import { AppointmentsPayload, useFindAllAppointmentsLazyQuery } from "../generated/graphql";
import { appointmentContextReducer, Action, ActionType, initialState, State as LocalState } from "../reducers/appointmentContextReducer";

export const AppointmentContext = createContext<AppointmentContextInterface>({
  appointmentList: [],
  setAppointmentList: () => { },
  fetchAllAppointmentList: () => { },
});

export const AppointmentContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [{ appointmentList, appointmentPages }, dispatch] = useReducer<Reducer<LocalState, Action>>(appointmentContextReducer, initialState)

  const [findAllAppointments] = useFindAllAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};
      alert("1233")

      if (findAllAppointments) {
        const { appointments, pagination } = findAllAppointments

        if (pagination) {
          const { totalPages } = pagination;

          if (totalPages ? appointmentPages !== totalPages : false) {
            setAppointmentPages(appointmentPages + 1)
          }
        }

        !!appointments && !!appointmentList &&
          setAppointmentList([...appointmentList, ...appointments] as AppointmentsPayload['appointments'])
      }
    }
  });

  const fetchAllAppointmentList = useCallback(async (page = 1) => {
    dispatch({ type: ActionType.SET_APPOINTMENT_LIST, appointmentList: [] })

    try {
      await findAllAppointments({
        variables: {
          appointmentInput: {
            paginationOptions: {
              page, limit: PAGE_LIMIT
            }
          }
        },
      });
    } catch { }
  }, [findAllAppointments])

  // useEffect(() => { hasToken && fetchAllAppointmentList(appointmentPages) }, [fetchAllAppointmentList, hasToken, appointmentPages])

  const setAppointmentList = (appointments: AppointmentsPayload['appointments']) => dispatch({
    type: ActionType.SET_APPOINTMENT_LIST, appointmentList: appointments
  });

  const setAppointmentPages = (pageNumber: number) => dispatch({
    type: ActionType.SET_APPOINTMENT_PAGES, appointmentPages: pageNumber
  });

  return (
    <AppointmentContext.Provider
      value={{
        appointmentList,
        setAppointmentList,
        fetchAllAppointmentList,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

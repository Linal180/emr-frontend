// packages block
import { createContext, FC, useState, useEffect, useContext } from "react";
// components block
import Alert from "../components/common/Alert";
// graphql, interfaces/types and constants block
import { AuthContext } from ".";
import { PAGE_LIMIT, TOKEN } from "../constants";
import { AppContextProps } from "../interfacesTypes";
import // Phase, PhasesPayload, useFindAllPhasesLazyQuery
"../generated/graphql";

export const AppContext = createContext<AppContextProps>({
  isSidebarOpen: true,
  setIsSidebarOpen() {},
});

export const AppContextProvider: FC = ({ children }): JSX.Element => {
  const { user: currentUser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  // const [phases, setPhases] = useState<PhasesPayload["phases"]>([]);
  // const [currentPhase, setCurrentPhase] = useState<Phase>();

  // const [fetchAllPhases] = useFindAllPhasesLazyQuery({
  //   fetchPolicy: "network-only",
  //   notifyOnNetworkStatusChange: true,
  //   variables: {
  //     phasesInput: {
  //       paginationOptions: {
  //         page: 1,
  //         limit: PAGE_LIMIT
  //       }
  //     }
  //   },

  //   onError({ message }) {
  //     Alert.error(message)
  //   },

  //   onCompleted(data) {
  //     const { findAllPhases: { phases, response } } = data

  //     if (response) {
  //       const { status } = response;

  //       if (status && status === 200 && phases) {
  //         const sortedPhases = [...phases]?.sort((itemOne, itemTwo) => {

  //           if (itemOne && itemTwo) {
  //             return itemOne?.order - itemTwo?.order
  //           }

  //           return 0;
  //         })

  //         setPhases(sortedPhases);
  //         for (let phase of phases) {
  //           if (phase && phase.isCurrentPhase) {
  //             setCurrentPhase(phase)
  //           }
  //         }
  //       }
  //     }
  //   },
  // })

  // useEffect(() => {
  //   if (phases?.length === 0 && localStorage.getItem(TOKEN))
  //     fetchAllPhases({
  //       variables: {
  //         phasesInput: {
  //           paginationOptions: {
  //             page: 1,
  //             limit: PAGE_LIMIT
  //           }
  //         }
  //       }
  //     })
  // }, [phases?.length, fetchAllPhases, currentUser])

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        // phases,
        // currentPhase,
        // setCurrentPhase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

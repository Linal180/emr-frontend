// packages block
import { createContext, FC, useState, useEffect, useContext } from "react";
// components block
// graphql, interfaces/types and constants block
import { AppContextProps } from "../interfacesTypes";

export const AppContext = createContext<AppContextProps>({
  isSidebarOpen: true,
  setIsSidebarOpen() { },
});

export const AppContextProvider: FC = ({ children }): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

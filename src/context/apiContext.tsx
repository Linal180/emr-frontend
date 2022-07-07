// packages block
import axios from "axios";
import { createContext, FC, useEffect, useState } from "react";
// components block
import { ApiContextProps } from "../interfacesTypes";

export const ApiContext = createContext<ApiContextProps>({
  clientRemote: ''
});

export const ApiContextProvider: FC = ({ children }): JSX.Element => {
  const [clientRemote, setClientRemote] = useState<string>('');

  const getAPI = async () => {
    try {
      const res = await axios.get('https://geolocation-db.com/json/')
      const { data } = res
      const { IPv4 } = data || {}
      IPv4 && setClientRemote(IPv4)
    } catch (error) { }
  }

  useEffect(() => {
    getAPI()
  }, [])

  return (
    <ApiContext.Provider
      value={{
        clientRemote,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

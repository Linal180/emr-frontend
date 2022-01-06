// packages block
import { createContext, FC, useEffect, useState } from "react";
// graphql, interfaces/types and constants block
import { TOKEN } from "../constants";
import { AuthContextProps } from "../interfacesTypes";
import { User, useGetLoggedInUserLazyQuery } from "../generated/graphql";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  setUser: (user: User | null) => {},
});

export const AuthContextProvider: FC = ({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);

  const [fetchUser, { loading }] = useGetLoggedInUserLazyQuery({
    nextFetchPolicy: "network-only",

    onError() {
      setUser(null);
    },

    onCompleted(data) {
      if (data) {
        const {
          me: { user },
        } = data;

        if (user) {
          setUser(user);
        }
      }
    },
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);

  const hasToken = localStorage.getItem(TOKEN);

  useEffect(() => {
    hasToken && setIsLoggedIn(true);
    isLoggedIn && hasToken && fetchUser();
  }, [isLoggedIn, hasToken, fetchUser, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

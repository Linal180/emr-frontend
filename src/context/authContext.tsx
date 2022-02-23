// packages block
import { createContext, FC, useCallback, useEffect, useState } from "react";
// graphql, interfaces/types and constants block
import { TOKEN } from "../constants";
import { AuthContextProps } from "../interfacesTypes";
import { User, useGetLoggedInUserLazyQuery } from "../generated/graphql";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  setUser: (user: User | null) => { },
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
        const { me } = data

        if (me) {
          const { user } = me;

          user && setUser(user as User);
        }
      }
    },
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);

  const hasToken = localStorage.getItem(TOKEN);

  const getUser = useCallback( async () => {
    try {
      await fetchUser();
    } catch (error) {}
  }, [fetchUser]);

  useEffect(() => {
      hasToken && setIsLoggedIn(true);
      isLoggedIn && hasToken && getUser();
  }, [isLoggedIn, hasToken, loading, getUser]);

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

// packages block
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/styles";
import axios from 'axios';
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from 'react';
// components block
import AppContainer from './AppContainer';
import { CloseButton, SnackbarUtilsConfigrator } from "./components/common/Alert";
import Loader from './components/common/Loader';
// graphql, constants, context, apollo, and theme block
import 'rc-time-picker/assets/index.css';
import client from './apollo';
import { REMOTE_IP } from './constants';
import { AppContextProvider, AuthContextProvider, FacilityContextProvider, ListContextProvider, PermissionContextProvider } from './context';
import './styles/styles.css';
import { theme } from "./theme/theme";

const App = () => {
  const [loader, setLoader] = useState(false)

  const getAPI = async () => {
    try {
      setLoader(true)
      const res = await axios.get('https://geolocation-db.com/json/')
      setLoader(false)
      const { data } = res
      const { IPv4 } = data || {}
      IPv4 && sessionStorage.setItem(REMOTE_IP, IPv4)
    } catch (error) {
      setLoader(false)
    }
  }

  useEffect(() => {
    getAPI()
  }, [])

  return (
    <SnackbarProvider maxSnack={5} autoHideDuration={3000} action={key => <CloseButton id={key} />}
      preventDuplicate={true} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <SnackbarUtilsConfigrator />
      {loader ? <Loader loading={true} /> :
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <AuthContextProvider>
              <AppContextProvider>
                <PermissionContextProvider>
                  <ListContextProvider>
                    <FacilityContextProvider>
                      <AppContainer />
                    </FacilityContextProvider>
                  </ListContextProvider>
                </PermissionContextProvider>
              </AppContextProvider>
            </AuthContextProvider>
          </ThemeProvider>
        </ApolloProvider>}
    </SnackbarProvider>
  );
};

export default App;

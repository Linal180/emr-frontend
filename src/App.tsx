// packages block
import axios from 'axios';
import { useState, useEffect } from 'react'
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/styles";
// components block
import AppContainer from './AppContainer'
import BackdropLoader from './components/common/Backdrop';
import { SnackbarUtilsConfigrator, CloseButton } from "./components/common/Alert";
// graphql, constants, context, apollo, and theme block
import './styles/styles.css'
import client from './apollo'
import { theme } from "./theme/theme";
import { REMOTE_IP } from './constants';
import 'rc-time-picker/assets/index.css';
import {
  AuthContextProvider, AppContextProvider, ListContextProvider, FacilityContextProvider, PermissionContextProvider,
  ChartContextProvider
} from './context'

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
      {loader ? <BackdropLoader loading={true} /> :
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <AuthContextProvider>
              <AppContextProvider>
                <PermissionContextProvider>
                  <ListContextProvider>
                    <FacilityContextProvider>
                      <ChartContextProvider>
                        <AppContainer />
                      </ChartContextProvider>
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

// packages block
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/styles";
// components block
import AppContainer from './AppContainer'
import { SnackbarUtilsConfigrator, CloseButton } from "./components/common/Alert";
// graphql, constants, context, apollo, and theme block
import './styles/styles.css'
import client from './apollo'
import { theme } from "./theme/theme";
import 'rc-time-picker/assets/index.css';
import {
  AuthContextProvider, AppContextProvider, ListContextProvider, FacilityContextProvider, PermissionContextProvider,
  ChartContextProvider, ApiContextProvider
} from './context'

const App = () => {
  return (
    <SnackbarProvider maxSnack={5} autoHideDuration={3000} action={key => <CloseButton id={key} />}
      preventDuplicate={true} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <SnackbarUtilsConfigrator />
      <ApiContextProvider>
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
        </ApolloProvider>
      </ApiContextProvider>
    </SnackbarProvider>
  );
};

export default App;

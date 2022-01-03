// packages block
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/styles";
// components block
import AppContainer from './AppContainer'
import { SnackbarUtilsConfigrator, CloseButton } from "./components/common/Alert";
// graphql, constants, context, apollo, and theme block
import client from './apollo'
import { theme } from "./theme/theme";
import { AuthContextProvider, AppContextProvider } from './context'
import './styles/styles.css'

const App = () => {
  return (
    <SnackbarProvider maxSnack={5} autoHideDuration={3000} action={key => <CloseButton id={key} />}
      preventDuplicate={true} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <SnackbarUtilsConfigrator />

      <ApolloProvider client={client}>
        <AuthContextProvider>
          <AppContextProvider>
            <ThemeProvider theme={theme}>
              <AppContainer />
            </ThemeProvider>
          </AppContextProvider>
        </AuthContextProvider>
      </ApolloProvider>
    </SnackbarProvider>
  );
};

export default App;

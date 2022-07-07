/*
  1. Creating connection with GraphQL
  2. Handling and showing GraphQL and network errors.
  */

// packages block
import dotenv from 'dotenv';
import { useContext } from 'react';
import { onError } from "@apollo/client/link/error";
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from, DefaultOptions, Operation, NextLink } from "@apollo/client";
// components block
import Alert from "../components/common/Alert";
// utils and constants block
import history from '../history';
import { ApiContext } from '../context'
import { handleLogout } from "../utils";
import {
  FORBIDDEN_EXCEPTION, INVALID_OR_EXPIRED_TOKEN_MESSAGE, MAINTENANCE_ALERT, MAINTENANCE_ROUTE,
  NOT_FOUND_EXCEPTION, PRECONDITION_FAILED_EXCEPTION, TOKEN, TOKEN_INVALID, TOKEN_NOT_FOUND,
  UNAUTHORIZED, FA_TOKEN,
} from "../constants";
dotenv.config()

const authMiddleware = new ApolloLink((operation: Operation, forward: NextLink) => {
  const token = localStorage.getItem(TOKEN) || localStorage.getItem(FA_TOKEN);
  const pathname = window.location.pathname;
  const { clientRemote } = useContext(ApiContext)

  operation.setContext({
    headers: {
      authorization: `Bearer ${token}`,
      pathname, clientRemote
    },
  });

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_BASE_URL}/graphql`,

});

const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.map(
      ({ extensions }) => {
        if (extensions) {
          const { exception } = extensions;

          if (exception) {
            const { response } = exception;

            if (response) {
              const { error, response: errorResponse } = response

              if (error && error !== NOT_FOUND_EXCEPTION) {
                if (error === TOKEN_NOT_FOUND) {
                  Alert.error(INVALID_OR_EXPIRED_TOKEN_MESSAGE)
                } else
                  Alert.error(error)
              }

              if (errorResponse) {
                const { error: responseError, message } = errorResponse;

                if (message && message !== NOT_FOUND_EXCEPTION && message !== FORBIDDEN_EXCEPTION) {
                  Alert.error(message)
                } else if (
                  responseError
                  && responseError !== NOT_FOUND_EXCEPTION
                  && responseError === PRECONDITION_FAILED_EXCEPTION
                ) {
                  Alert.error(responseError)
                }
              }
            }
          }
        }

        return forward(operation);
      }
    );

    const [{ message }] = graphQLErrors;

    if (message === UNAUTHORIZED || message === TOKEN_INVALID) handleLogout();
  }

  if (networkError) {
    Alert.error(MAINTENANCE_ALERT)
    history.push(MAINTENANCE_ROUTE)
    client.clearStore()
  }
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  },

  query: {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  },

  mutate: {
  },
};

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false
  }),
  connectToDevTools: true,
  link: from([authMiddleware, errorLink, httpLink]),
  defaultOptions: defaultOptions
});

export default client;

import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Pages from './pages';
import Login from './pages/login';
import injectStyles from './styles';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { resolvers, typeDefs } from './resolvers';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000',
  headers: {
    // Attach our login token to the authorization header
    authorization: localStorage.getItem('token'),

    // Define our client here (as well as any custom headers)
    'client-name': 'Space Explorer [annotated]',
    'client-version': '1.0.0',
    // NOTE: Our back-end server will need to do some special processing to parse these custom header names we've created
    // See back-end/javascript/apollo-server/apollo-tutorial/src/engine-demo.js for an example
  },
});

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers,
});

// Warm the cache with values for our isLoggedIn and cartItems so the queries that use them don't error out.
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  },
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById('root'),
);

/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, browserHistory } from 'react-router';
import { createStore } from 'redux';

import createClient from './apollo-client';

const dest = document.getElementById('content');

export default ({ routes, client = createClient(), ...options}) => {
  let store = options.store;
  if (!store) {
    client.initStore();
    store = client.store;
  }

  ReactDOM.render(
    <ApolloProvider client={client} store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </ApolloProvider>,
    dest
  );
}

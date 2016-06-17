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

import ourClient from '../server/app/apollo-client';
import DevTools from '../server/app/DevTools';

const dest = document.getElementById('content');

import ReactDOMServer from 'react-dom/server';

export default ({ routes, client = ourClient, ...options}) => {
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

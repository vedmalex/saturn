import ApolloClient, { createNetworkInterface } from 'apollo-client';

// Globally register gql template literal tag
import { registerGqlTag } from 'apollo-client/gql';
registerGqlTag();

import config from '../config';

let url;
let options = {};
if (__SERVER__) {
  options.ssrMode = true;
  url = `http://#{config.host}:#{config.port}/graphql`;
} else {
  options.ssrForceFetchDelay = 100;
  url = '/graphql'
}

export default () => new ApolloClient({
  networkInterface: createNetworkInterface(url, {
    credentials: 'same-origin',
  }),
  ...options,
});

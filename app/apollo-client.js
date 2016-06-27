import ApolloClient, { createNetworkInterface } from 'apollo-client';

// Globally register gql template literal tag
import { registerGqlTag } from 'apollo-client/gql';
registerGqlTag();

let options = {};
if (__SERVER__) {
  options.ssrMode = true;
} else {
  options.ssrForceFetchDelay = 100;
}

export default () => new ApolloClient({
  networkInterface: createNetworkInterface('http://localhost:3000/graphql', {
    credentials: 'same-origin',
  }),
  ...options,
});

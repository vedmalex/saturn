import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { addTypenameToSelectionSet } from 'apollo-client/queries/queryTransform';

// Globally register gql template literal tag
import { registerGqlTag } from 'apollo-client/gql';
registerGqlTag();

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql', {
    credentials: 'same-origin',
  }),
});

export default client;

import createClient from 'saturn-framework/app/apollo-client';
import createStore from 'saturn-framework/app/store';
import createApp from 'saturn-framework/app';

const client = createClient();

import count from './reducers/count';
const store = createStore({ client, reducers: { count } });

import routes from './routes';

createApp({ routes, client, store });

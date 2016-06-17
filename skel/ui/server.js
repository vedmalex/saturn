import client from 'saturn-framework/server/app/apollo-client';
import createStore from 'saturn-framework/redux/store';
import createApp from 'saturn-framework/server/app';

import count from './reducers/count';
const store = createStore({ client, reducers: { count } });

import routes from './routes';

createApp({ routes, client, store });

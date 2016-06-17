import { createStore, combineReducers } from 'redux';
import count from './reducers/count';

export default createStore(combineReducers({ count }));

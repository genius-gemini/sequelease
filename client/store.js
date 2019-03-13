import { createStore, applyMiddleware } from 'redux';
import combinedReducers from './reducers/index';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const middleware = composeWithDevTools(
  applyMiddleware(thunk, createLogger({ collapsed: true }))
);

export default createStore(combinedReducers, middleware);

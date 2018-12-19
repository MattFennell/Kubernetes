import rootReducer from '../Reducers/root';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const middlewares = [];

middlewares.push(thunk);

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export default createStore(rootReducer, compose(applyMiddleware(...middlewares)));

import { combineReducers } from 'redux';
import stateReducer from './state';
import playerReducer from './player';

const rootReducer = combineReducers({
  stateReducer,
  playerReducer
});

export default rootReducer;
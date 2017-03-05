import {
  MOUSE_VECTOR,
  TIMER_START,
  TIMER_STOP,
} from '../actions/';

const initialState = {
  mouseVector: {x: 0, y: 0},
  timers: {}
};

const stateReducer = (state = initialState, action) => {
  switch (action.type) {

  case MOUSE_VECTOR:
    return {
      ...state,
      mouseVector: action.payload
    };

  case TIMER_START:
    return {
      ...state,
      timers: {
        ...state.timers,
        [action.payload.action]: {action: action.payload.action, timerId: action.payload.timerId}
      }
    };

  case TIMER_STOP:
    let timers = {...state.timers};
    delete timers[action.payload.action];
    return {
      ...state,
      timers: {
        ...timers,
      }
    };

  default:
    return state;
  }
};

export default stateReducer;

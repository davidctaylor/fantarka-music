import { combineReducers } from '@reduxjs/toolkit'

import playerReducer from 'components/player/player-slice';

const rootReducer = combineReducers({
  player: playerReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

import { all, fork } from "@redux-saga/core/effects";
import { combineReducers } from "redux";
import todo, {todoSaga} from "./todo";
import app, {appSaga} from "./app";

const rootReducer = combineReducers({
  todo,
  app,
})

export function* rootSaga() {
  yield all([
    fork(todoSaga),
    fork(appSaga),
  ])
}

export default rootReducer;
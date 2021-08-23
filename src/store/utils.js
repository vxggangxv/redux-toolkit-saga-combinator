import { call, put } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";

export const fetchInitialState = {
  pending: null,
  success: null,
  failure: null,
};

export const fetchCurrentState = (state, currentState) => {
  if (currentState === "init" || currentState === "clear") {
    return (state = { ...fetchInitialState });
  }
  return (state = {
    pending: false,
    success: false,
    failure: false,
    [currentState]: true,
  });
};

export function createFetchAction(type) {
  const INIT = `${type}_init`;
  const REQUEST = `${type}_request`;
  const SUCCESS = `${type}_success`;
  const FAILURE = `${type}_failure`;
  const CLEAR = `${type}_clear`;

  return {
    // TYPE: type,
    // REQUEST,
    // SUCCESS,
    // FAILURE,
    init: createAction(INIT),
    request: createAction(REQUEST),
    success: createAction(SUCCESS),
    failure: createAction(FAILURE),
    clear: createAction(CLEAR),
  };
}

export function fetchReducerActions(type, key, config = {}) {
  const {
    init = () => {},
    pending = () => {},
    success = () => {},
    failure = () => {},
    common = () => {},
    isRestful = false,
  } = config;
  const targetState = (str, obj, type, action) => {
    const splitArray = str.split(".");
    const targetState = str.split(".").reduce((a, c) => {
      // console.log(type, 'type');
      if (splitArray[splitArray.length - 1] === c) {
        a[c] = {
          ...a[c],
          ...fetchCurrentState(a[c], type),
        };
        // if (type === 'success' || type === 'failure') {
        if (type === "success") {
          a[c] = {
            ...a[c],
            data: action?.payload,
            error: null,
          };
        }
        // clear : data null 만드는 함수
        if (type === "failure") {
          a[c] = {
            ...a[c],
            data: null,
            error: action?.payload,
          };
        }
        // clear : data null 만드는 함수
        if (type === "clear") {
          a[c] = {
            ...a[c],
            data: null,
          };
        }
      }
      return a[c];
    }, obj);
    return targetState;
  };
  // console.log(key, 'key');
  // state[key] = {
  //   ...state[key],
  //   ...fetchCurrentState(state[key], 'init'),
  // };
  return {
    [type.init]: (state, action) => {
      targetState(key, state, "init");
      init(state, action);
      common(state, action);
    },
    [type.request]: (state, action) => {
      targetState(key, state, "pending");
      pending(state, action);
      common(state, action);
    },
    [type.success]: (state, action) => {
      if (isRestful) {
        targetState(key, state, "success");
      } else {
        targetState(key, state, "success", action);
      }
      success(state, action);
      common(state, action);
    },
    [type.failure]: (state, action) => {
      targetState(key, state, "failure", action);
      failure(state, action);
      common(state, action);
    },
    [type.clear]: (state, action) => {
      targetState(key, state, "clear");
      // clear(state, action);
      // common(state, action);
    },
  };
}

export function createSaga(actions, key, req, config = {}) {
  const {
    isApiLoading = true,
    isAlertSuccess = false,
    isAlertfailure = true,
    success = () => {},
    failure = () => {},
  } = config;
  // console.log(actions, 'actions');
  return function* ({ payload }) {
    // const payload = action?.payload;
    // console.log(payload, 'payload');

    try {
      const response = yield call(req, payload);
      let data = response.data;

      yield put(actions[`${key}_success`](data));
      success(data);

      // dev redux console
      console.group(`-- ${key}_request Redux saga`);
      console.log(
        ` %cRequest Data :\n`,
        "color:red;padding:5px;font-weight:bold",
        data?.payload
      );
      console.log(
        ` %cResponse Data :\n`,
        "color:red;padding:5px;font-weight:bold",
        data
      );
      console.groupEnd();
    } catch (error) {
      yield put(
        actions[`${key}_failure`]({
          ...error,
          isShow: isAlertfailure,
          message: error?.message,
        })
      );
      failure(error);

      // error
      console.group(`-- ${key}_request Redux saga error`);
      console.log(
        ` %cPayload :\n`,
        "color:red;padding:5px;font-weight:bold",
        error?.payload
      );
      console.log(
        ` %cError :\n`,
        "color:red;padding:5px;font-weight:bold",
        error
      );
      console.groupEnd();
    } finally {
      // const isExceptList = ['handleAutoLogin', 'handleUserInfo', 'handleIndicationFormat'];
      // const isExcept = isExceptList.some(item => item === tag);
      // if (!isExcept) yield put(actions[`${key}_init`]());
      yield put(actions[`${key}_init`]());
      // console.log('work init');
    }
  };
}

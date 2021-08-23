import { createAction, createSlice } from '@reduxjs/toolkit';
import { all, delay, put, takeEvery } from 'redux-saga/effects';

const initialState = {
  // api pending, success, failure에 따른 자동 loading show
  apiCalling: false,
};

// Popups id
let _pid = 0;

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    set_api_calling_status: state => {
      state.apiCalling = true;
    },
    clear_api_calling_status: state => {
      state.apiCalling = false;
    },
  },
});

export const actions = slice.actions;

// Todo somethine what you want
function* handleRequest(action) {}

function* handleSuccess(action) {}

function* handleFailure(action) {}

export function* appSaga() {
  yield all([
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_request');
      }
    }, handleRequest),
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_success');
      }
    }, handleSuccess),
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_failure');
      }
    }, handleFailure),
  ]);
}

export default slice.reducer;

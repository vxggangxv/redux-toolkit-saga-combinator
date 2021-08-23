import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as api from 'api/todo';

export const fetch_todos = createFetchAction('fetch_todos');
export const fetch_todo = createFetchAction('fetch_todo');

const initialState = {
  todos: {
    ...fetchInitialState,
  },
  todo: {
    ...fetchInitialState,
  },
};

const slice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_todos, 'todos'),
    ...fetchReducerActions(fetch_todo, 'todo'),
  },
});

export const actions = slice.actions;

export function* todoSaga() {
  yield all([
    takeLatest(actions.fetch_todos_request, createSaga(actions, 'fetch_todos', api.fetchTodos)),
    takeLatest(actions.fetch_todo_request, createSaga(actions, 'fetch_todo', api.fetchTodoById)),
  ]);
}

export default slice.reducer;

import { bindActionCreators } from "redux";
import store from 'store';
import { actions as todoActions } from './modules/todo';

const { dispatch } = store;

export const TodoActions = bindActionCreators(todoActions, dispatch)
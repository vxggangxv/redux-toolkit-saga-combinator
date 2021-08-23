import axios from 'axios';

export function fetchTodos() {
  return axios.get('https://jsonplaceholder.typicode.com/todos');
}
export function fetchTodoById(id) {
  return axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
}

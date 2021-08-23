import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { TodoActions } from "store/actionCreators";
import { shallowEqual, useSelector } from "react-redux";

function App() {
  const { todos, todo } = useSelector(
    (state) => ({
      todos: state.todo.todos.data,
      todo: state.todo.todo.data,
    }),
    shallowEqual
  );
  const [todoIndex, setTodoIndex] = useState("todos");

  const onGetTodos = () => {
    setTodoIndex("todos");
    TodoActions.fetch_todos_request();
  };

  const onGetTodo = () => {
    setTodoIndex("todo");
    TodoActions.fetch_todo_request(7);
  };

  // useEffect(() => {
  //   console.log('todos', todos);
  // }, [todos])

  // useEffect(() => {
  //   console.log('todo', todo);
  // }, [todo])

  return (
    <div className="App">
      <button className="App-link" onClick={onGetTodos}>
        Todos
      </button>
      <button className="App-link" onClick={onGetTodo}>
        Todo
      </button>

      <div className="App-todo-data">
        {todoIndex === "todos" && (
          <div>
            {!!todos?.length &&
              todos.map((item, idx) => {
                if (idx > 9) return;
                return (
                  <p key={idx}>
                    {item.id}: {item.title}
                  </p>
                );
              })}
          </div>
        )}
        {todoIndex === "todo" && (
          <div>
            {todo?.id}: {todo?.title}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

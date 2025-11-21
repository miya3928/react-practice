import { useState } from "react";

export default function Todo() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, input]);
    setInput("");
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index) );
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ToDo を入力"
      />
      <button onClick={addTodo}>追加</button>

      <ul>
        {todos.map((t, index) => (
          <li key={index}>
            {t}
            <button onClick={() => deleteTodo(index)} style={{ marginLeft: "10px" }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
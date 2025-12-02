import { useState } from "react";

export default function Todo() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      done: false,
      created_at: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
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
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>保存</button>
                <button onClick={cancelEdit}>キャンセル</button>
              </>
            ) : (
              <>
                {todo.text}
                <button
                  onClick={() => startEdit(todo)}
                  style={{ marginLeft: "10px" }}
                >
                  編集
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ marginLeft: "10px" }}
                >
                  削除
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
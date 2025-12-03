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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
      {/* 新規追加 */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ToDo を入力"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* ToDo リスト */}
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            {editingId === todo.id ? (
              <div className="flex gap-2 w-full">
                <input
                  className="flex-1 border rounded px-2 py-1"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  保存
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <>
                <span>{todo.text}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(todo)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
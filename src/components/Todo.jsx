// Todo.jsx
import { useState, useEffect } from "react";
// 💡 TodoItemコンポーネントをimport
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence } from 'framer-motion';

// localStorageから初期データを読み込むヘルパー関数
const getInitialTodos = () => {
  const data = localStorage.getItem("todos");
  // 堅牢性を高めるためのtry-catch
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse localStorage data:", e);
    return [];
  }
};

export default function Todo() {
  const [todos, setTodos] = useState(getInitialTodos);
  // フォーム入力値のステート
  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState("");

  // 編集モード関連のステート
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");

  // 🌟 データの永続化: todosが変更されるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 🌟 新規追加: ソート基準を保持するステート
  const [sortBy, setSortBy] = useState("created_at");
  // ソートロジックの定義
  const sortedTodos = [...todos];
  // ソート処理の実行
  if(sortBy === "priority"){
    const priorityOrder ={ high: 3, medium: 2, low: 1 };
    sortedTodos.sort((a,b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }else if (sortBy === "dueDate"){
    sortedTodos.sort((a,b) => {
      const dateA =a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const dateB =b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      return dateA - dateB;
    });
  }else if (sortBy === "created_at") {
    sortedTodos.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }
  // 完了済みのアイテムを常にリストの最後に移動
  sortedTodos.sort((a,b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  // --- CRUD 操作 ---

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      done: false,
      created_at: new Date().toISOString(),
      priority: priorityInput,
      dueDate: dueDateInput || null,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    // フォームのリセット
    setInput("");
    setPriorityInput("medium");
    setDueDateInput("");
  };

  const toggleDone = (id) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setEditingPriority(todo.priority); // 既存の優先度を設定
    setEditingDueDate(todo.dueDate || ""); // 既存の期日を設定
  };

  const saveEdit = (id) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: editingText.trim(),
              priority: editingPriority,
              dueDate: editingDueDate || null,
            }
          : todo
      )
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingPriority("");
    setEditingDueDate("");
  };

  // --- JSX (レンダリング) ---

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
      {/* 1. 新規追加フォーム */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2 focus:ring focus:ring-blue-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ToDo を入力"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={input.trim() === ""}
            >
              追加
            </button>
        </div>

        {/* 2. 優先順位と期日入力 */}
        <div className="flex gap-2 text-sm">
            <select
                value={priorityInput}
                onChange={(e) => setPriorityInput(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
            >
                <option value="high">🔥 高</option>
                <option value="medium">📝 中</option>
                <option value="low">🌱 低</option>
            </select>
            <input
                type="date"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
            />
        </div>
      </div>

      {/* 🌟 4. ソート機能の追加 */}
      <div className="mb-6 justify-end items-center gap-2 text-sm">
        <label htmlFor="sort-select" className="text-gray-500">
          並べ替え：
        </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1 bg-white">
          <option value="created_at">作成日（新しい→古い）</option>
          <option value="dueDate">期日(早い→遅い)</option>
          <option value="priority">優先度（高→低）</option>
        </select>
      </div>

      {/* 3. ToDo リスト */}
      <ul className="space-y-3">
      <AnimatePresence>
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            // 操作関数
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            // 編集ステート
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            editingPriority={editingPriority}
            setEditingPriority={setEditingPriority}
            editingDueDate={editingDueDate}
            setEditingDueDate={setEditingDueDate}
          />
        ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
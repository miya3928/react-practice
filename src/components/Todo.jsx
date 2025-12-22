// Todo.jsx
import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence } from 'framer-motion';

const getInitialTodos = () => {
  const data = localStorage.getItem("todos");
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse localStorage data:", e);
    return [];
  }
};

export default function Todo({ user }) {
  const [todos, setTodos] = useState(getInitialTodos);
  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [tagInput, setTagInput] = useState("プライベート"); // 🌟 タグ用ステート追加

  // 進捗率の計算
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.done).length;
  const progress = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  // 編集モード関連
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editingTag, setEditingTag] = useState(""); // 🌟 編集用タグ
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      done: false,
      created_at: new Date().toISOString(),
      priority: priorityInput,
      dueDate: dueDateInput || null,
      tag: tagInput, // 🌟 タグを追加
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInput("");
    setPriorityInput("medium");
    setDueDateInput("");
    setTagInput("プライベート");
  };

  const toggleDone = (id) => {
    setTodos(prevTodos => prevTodos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  // 🌟 完了済みを一括削除
  const clearCompleted = () => {
    if (window.confirm("完了済みのタスクをすべて削除しますか？")) {
      setTodos(prevTodos => prevTodos.filter(todo => !todo.done));
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setEditingPriority(todo.priority);
    setEditingDueDate(todo.dueDate || "");
    setEditingTag(todo.tag || "プライベート"); // 🌟 既存タグ設定
  };

  const saveEdit = (id) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, text: editingText.trim(), priority: editingPriority, dueDate: editingDueDate || null, tag: editingTag }
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
    setEditingTag("");
  };

  // 絞り込みとソート (既存ロジック継続)
  const filteredTodos = todos.filter(todo => {
    if (filterStatus === "active") return !todo.done;
    if (filterStatus === "completed") return todo.done;
    return true;
  });

  const [sortBy, setSortBy] = useState("created_at");
  const sortedTodos = [...filteredTodos];
  
  if(sortBy === "priority"){
    const priorityOrder ={ high: 3, medium: 2, low: 1 };
    sortedTodos.sort((a,b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (sortBy === "dueDate"){
    sortedTodos.sort((a,b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      return dateA - dateB;
    });
  } else {
    sortedTodos.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }
  sortedTodos.sort((a,b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
      
      {/* 🌟 1. 進捗表示エリア */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-bold text-gray-700">全体の進捗</span>
          <span className="text-indigo-600 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

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

        <div className="flex gap-2 text-sm">
            <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="border rounded px-2 py-1 flex-1">
                <option value="high">🔥 高</option>
                <option value="medium">📝 中</option>
                <option value="low">🌱 低</option>
            </select>
            {/* 🌟 タグ選択の追加 */}
            <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="border rounded px-2 py-1 flex-1">
                <option value="仕事">💼 仕事</option>
                <option value="プライベート">🏠 プライベート</option>
                <option value="学習">📚 学習</option>
            </select>
            <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="border rounded px-2 py-1 flex-1" />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 border-t pt-4">
          {/* ソートと表示切替は既存通り */}
          <div className="flex justify-start items-center text-sm">
              <label className="font-semibold text-gray-700 w-20">並べ替え：</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex border rounded px-2 py-1 bg-white flex-1 min-w-0">
                  <option value="created_at">作成日</option>
                  <option value="dueDate">期日</option>
                  <option value="priority">優先度</option>
              </select>
          </div>

          <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700 w-20">絞り込み：</span>
              <div className="flex gap-1 p-1 border rounded-lg bg-gray-50 flex-1 justify-around">
                  {['all','active','completed'].map((f) => (
                      <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1 rounded-md text-xs ${filterStatus === f ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>
                          {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了済み'}
                      </button>
                  ))}
              </div>
          </div>

          {/* 🌟 完了済み削除ボタン */}
          {completedTodos > 0 && (
            <button onClick={clearCompleted} className="text-xs text-red-500 hover:text-red-700 text-right mt-1 underline">
              完了済みをすべて削除
            </button>
          )}
      </div>

      <section className="border-t">
          <ul className="space-y-3 pt-6">
            <AnimatePresence>
              {sortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleDone={toggleDone}
                  deleteTodo={deleteTodo}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                  editingId={editingId}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  editingPriority={editingPriority}
                  setEditingPriority={setEditingPriority}
                  editingDueDate={editingDueDate}
                  setEditingDueDate={setEditingDueDate}
                  editingTag={editingTag}
                  setEditingTag={setEditingTag}
                />
              ))}
            </AnimatePresence>
          </ul>
      </section>
    </div>
  );
}
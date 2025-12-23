import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence } from 'framer-motion';

const getInitialTodos = () => {
  const data = localStorage.getItem("todos");
  try { return data ? JSON.parse(data) : []; } catch (e) { return []; }
};

export default function Todo({ user }) {
  const [todos, setTodos] = useState(getInitialTodos);
  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [tagInput, setTagInput] = useState("プライベート");

  // 🌟 フィルタ用ステート
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // --- 絞り込みロジック (複数条件) ---
  const displayedTodos = todos.filter(todo => {
    const matchStatus = filterStatus === "all" ? true : filterStatus === "completed" ? todo.done : !todo.done;
    const matchPriority = filterPriority === "all" ? true : todo.priority === filterPriority;
    const matchTag = filterTag === "all" ? true : todo.tag === filterTag;
    return matchStatus && matchPriority && matchTag;
  });

  // --- 並べ替えロジック ---
  const sortedTodos = [...displayedTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    }
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
  // 完了したものを下に（常に適用）
  sortedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  // 進捗計算
  const progress = todos.length === 0 ? 0 : Math.round((todos.filter(t => t.done).length / todos.length) * 100);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      done: false,
      created_at: new Date().toISOString(),
      priority: priorityInput,
      dueDate: dueDateInput || null,
      tag: tagInput,
    };
    setTodos([newTodo, ...todos]);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 🌟 入力エリア: カード形式でラベルを追加 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">＋</span>
          新規タスクを追加
        </h3>
        <div className="space-y-4">
          <input
            className="w-full text-lg border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="何をしますか？"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">優先度</label>
              <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-gray-50">
                <option value="high">🔴 高</option>
                <option value="medium">🟡 中</option>
                <option value="low">🔵 低</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">タグ</label>
              <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-gray-50">
                <option value="仕事">💼 仕事</option>
                <option value="プライベート">🏠 プライベート</option>
                <option value="学習">📚 学習</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">期日</label>
              <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-gray-50" />
            </div>
          </div>
          <button onClick={addTodo} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
            タスクを登録する
          </button>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="px-2">
        <div className="flex justify-between text-xs font-bold mb-2 text-gray-500">
          <span>進捗状況</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 🌟 フィルタ・ソートエリア */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-4 items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold">並べ替え:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-indigo-600 outline-none">
              <option value="created_at">作成順</option>
              <option value="dueDate">期日が近い順</option>
              <option value="priority">優先度順</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold">タグ:</span>
            <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="bg-transparent font-bold text-indigo-600 outline-none">
              <option value="all">すべて</option>
              <option value="仕事">仕事</option>
              <option value="プライベート">プライベート</option>
              <option value="学習">学習</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}>
              {s === 'all' ? '全部' : s === 'active' ? '未完了' : '完了'}
            </button>
          ))}
        </div>
      </div>

      {/* Todoリスト */}
      <ul className="space-y-3">
        <AnimatePresence>
          {sortedTodos.map((todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              toggleDone={(id) => setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t))}
              deleteTodo={(id) => setTodos(todos.filter(t => t.id !== id))}
              updateTodo={(id, newData) => setTodos(todos.map(t => t.id === id ? {...t, ...newData} : t))}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
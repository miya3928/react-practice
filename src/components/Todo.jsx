import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence, motion } from 'framer-motion';

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

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const displayedTodos = todos.filter(todo => {
    const matchStatus = filterStatus === "all" ? true : filterStatus === "completed" ? todo.done : !todo.done;
    const matchPriority = filterPriority === "all" ? true : todo.priority === filterPriority;
    const matchTag = filterTag === "all" ? true : todo.tag === filterTag;
    return matchStatus && matchPriority && matchTag;
  });

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
  sortedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

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

  const toggleDone = (id) => setTodos(todos.map(t => t.id === id ? {...t, done: !t.done} : t));
  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id));
  const updateTodo = (id, newData) => setTodos(todos.map(t => t.id === id ? {...t, ...newData} : t));

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* 🌟 左側：入力エリア */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50">
          <h3 className="text-xs font-black text-indigo-400 mb-4 uppercase tracking-widest">New Task</h3>
          <div className="space-y-5">
            <input
              className="w-full text-xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-3 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="何をする？"
            />
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400">優先度</label>
                <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border-none outline-none">
                  <option value="high">🔴 高い</option>
                  <option value="medium">🟡 普通</option>
                  <option value="low">🔵 低い</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400">タグ</label>
                <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border-none outline-none">
                  <option value="仕事">💼 仕事</option>
                  <option value="プライベート">🏠 プライベート</option>
                  <option value="学習">📚 学習</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400">期限</label>
                <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border-none outline-none" />
              </div>
            </div>
            <button onClick={addTodo} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
              タスクを作成
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 右側：進捗 ＆ リスト */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* 進捗バー */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-2xl font-black text-indigo-600">{progress}%</span>
              <span className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Progress</span>
            </div>
            <span className="text-xs font-bold text-gray-400">{todos.filter(t => t.done).length} / {todos.length} Done</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        </div>

        {/* フィルタ & リスト */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 bg-gray-100/50 p-4 rounded-2xl">
            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500 px-2">
              <div className="flex items-center gap-1">
                <span>並べ替え:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-indigo-600 outline-none">
                  <option value="created_at">作成順</option>
                  <option value="dueDate">期限順</option>
                  <option value="priority">重要度順</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span>優先度:</span>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-transparent text-indigo-600 outline-none">
                  <option value="all">すべて</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span>タグ:</span>
                <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="bg-transparent text-indigo-600 outline-none">
                  <option value="all">すべて</option>
                  <option value="仕事">仕事</option>
                  <option value="プライベート">プライベート</option>
                  <option value="学習">学習</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
                  {s === 'all' ? 'すべて' : s === 'active' ? '実行中' : '完了済'}
                </button>
              ))}
            </div>
          </div>

          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  toggleDone={toggleDone}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
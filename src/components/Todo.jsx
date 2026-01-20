import { useState, useEffect, useMemo } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from "../supabase";
import Calendar from 'react-calendar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import 'react-calendar/dist/Calendar.css';
import '../calendar-custom.css';

export default function Todo({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterByDate, setIsFilterByDate] = useState(false);
  
  // フィルタ・表示制御
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGenre, setFilterGenre] = useState("すべて");
  const [sortBy, setSortBy] = useState("due_date");
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  // 入力用
  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState("プライベート");

  useEffect(() => { fetchTodos(); }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (!error) setTodos(data);
    setLoading(false);
  };

  // --- CRUD Functions ---
  const addTodo = async () => {
    if (!input.trim()) return;
    const { data, error } = await supabase.from('todos').insert([{
      user_id: user.id, text: input.trim(), done: false,
      priority: priorityInput, due_date: dueDateInput || null, tag: tagInput,
    }]).select();
    if (!error) { setTodos([data[0], ...todos]); setInput(""); }
  };

  const toggleDone = async (todo) => {
    const { error } = await supabase.from('todos').update({ done: !todo.done }).eq('id', todo.id);
    if (!error) setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = async (id, newData) => {
    const dbData = { text: newData.text, priority: newData.priority, due_date: newData.dueDate || newData.due_date, tag: newData.tag };
    const { error } = await supabase.from('todos').update(dbData).eq('id', id);
    if (!error) setTodos(todos.map(t => t.id === id ? { ...t, ...newData } : t));
  };

  // --- Logic: Filtering & Sorting ---
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchStatus = filterStatus === "all" ? true : filterStatus === "completed" ? todo.done : !todo.done;
      const matchGenre = filterGenre === "すべて" ? true : todo.tag === filterGenre;
      const matchDate = isFilterByDate ? todo.due_date === selectedDate.toLocaleDateString('sv-SE') : true;
      return matchStatus && matchGenre && matchDate;
    }).sort((a, b) => {
      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
      }
      if (sortBy === "due_date") {
        return (a.due_date || "9999") > (b.due_date || "9999") ? 1 : -1;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [todos, filterStatus, filterGenre, sortBy, isFilterByDate, selectedDate]);

  const activeTodos = filteredTodos.filter(t => !t.done);
  const completedTodos = filteredTodos.filter(t => t.done);

  // 件数バッジ
  const counts = {
    all: todos.length,
    active: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length
  };

  // --- Calendar Helpers ---
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return "";
    const day = date.getDay();
    if (day === 0) return "tile-sunday-holiday"; // 日曜日
    if (day === 6) return "tile-saturday";      // 土曜日
    return "";
  };

  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toLocaleDateString('sv-SE');
    const dailyTasks = todos.filter(t => t.due_date === dateStr && !t.done);
    const count = dailyTasks.length;

    if (count === 0) return null;
    if (count >= 5) return <div className="task-badge">{count}</div>;

    const dotColor = count >= 3 ? "bg-orange-400" : "bg-indigo-400";
    return (
      <div className="task-dot-container">
        <div className={`task-dot ${dotColor}`} />
      </div>
    );
  };

  const chartData = [
    { name: '仕事', value: todos.filter(t => t.tag === '仕事').length, color: '#4f46e5' },
    { name: '学習', value: todos.filter(t => t.tag === '学習').length, color: '#a855f7' },
    { name: 'プライベート', value: todos.filter(t => t.tag === 'プライベート').length, color: '#22c55e' },
  ].filter(d => d.value > 0);

  const progress = todos.length === 0 ? 0 : Math.round((todos.filter(t => t.done).length / todos.length) * 100);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-2">
      <div className="flex-grow space-y-6 lg:w-2/3">
        {/* 入力フォーム */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4 pb-4 border-b border-gray-50 mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">優先度</span>
              <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none">
                <option value="high">🔴 高</option>
                <option value="medium">🟡 中</option>
                <option value="low">🔵 低</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">ジャンル</span>
              <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none">
                <option value="仕事">💼 仕事</option>
                <option value="学習">📚 学習</option>
                <option value="プライベート">🏠 プライベート</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">期限</span>
              <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <input className="flex-grow text-lg font-bold outline-none py-3" value={input} onChange={(e) => setInput(e.target.value)} placeholder="新しいタスクを入力..." onKeyDown={(e) => e.key === 'Enter' && addTodo()} />
            <button onClick={addTodo} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">追加</button>
          </div>
        </div>

        {/* フィルタ & ソートバー */}
        <div className="bg-white/50 p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['すべて', '仕事', '学習', 'プライベート'].map(g => (
              <button key={g} onClick={() => setFilterGenre(g)} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${filterGenre === g ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>{g}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase">ソート:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[10px] font-black text-indigo-600 outline-none cursor-pointer">
              <option value="due_date">期限順</option>
              <option value="priority">重要度順</option>
              <option value="created_at">新着順</option>
            </select>
          </div>
        </div>

        {/* タスクリストエリア */}
        <div className="space-y-4">
          <div className="flex gap-6 px-2">
            {[
              { id: 'all', label: 'すべて', count: counts.all },
              { id: 'active', label: '実行中', count: counts.active },
              { id: 'completed', label: '完了済', count: counts.completed },
            ].map((s) => (
              <button key={s.id} onClick={() => setFilterStatus(s.id)} className={`relative pb-2 text-xs font-black uppercase transition-all ${filterStatus === s.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                {s.label} <span className="ml-1 opacity-50">{s.count}</span>
                {filterStatus === s.id && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
            <ul className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} toggleDone={() => toggleDone(todo)} deleteTodo={() => deleteTodo(todo.id)} updateTodo={updateTodo} />
                ))}
              </AnimatePresence>
            </ul>

            {completedTodos.length > 0 && (
              <div className="space-y-3">
                <button onClick={() => setIsCompletedOpen(!isCompletedOpen)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase hover:text-gray-600 transition-colors">
                  <span>{isCompletedOpen ? '▼' : '▶'} 完了済みを表示 ({completedTodos.length})</span>
                  <div className="flex-grow h-[1px] bg-gray-100" />
                </button>
                <AnimatePresence>
                  {isCompletedOpen && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                      {completedTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} toggleDone={() => toggleDone(todo)} deleteTodo={() => deleteTodo(todo.id)} updateTodo={updateTodo} />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {loading && <p className="text-center text-gray-400 py-10">読み込み中...</p>}
          </div>
        </div>
      </div>

      {/* サイドバー */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm uppercase">Progress</h3>
            <span className="text-2xl font-black">{progress}%</span>
          </div>
          <div className="h-2 bg-indigo-400/50 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-xs font-black text-gray-400 mb-4 uppercase">Calendar</h3>
           <Calendar 
             onChange={(date) => { setSelectedDate(date); setIsFilterByDate(true); }} 
             value={selectedDate} 
             locale="ja-JP"
             formatDay={(locale, date) => date.getDate()} 
             tileContent={renderTileContent}
             tileClassName={getTileClassName}
             className="border-none w-full"
           />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 mb-2 uppercase">Genre Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
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

  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState("プライベート");

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => { fetchTodos(); }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (!error) setTodos(data);
    setLoading(false);
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    const { data, error } = await supabase.from('todos').insert([{
      user_id: user.id,
      text: input.trim(),
      done: false,
      priority: priorityInput,
      due_date: dueDateInput || null,
      tag: tagInput,
    }]).select();
    if (!error) {
      setTodos([data[0], ...todos]);
      setInput("");
    }
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
    const dbData = {
      text: newData.text,
      priority: newData.priority,
      due_date: newData.dueDate || newData.due_date,
      tag: newData.tag
    };
    const { error } = await supabase.from('todos').update(dbData).eq('id', id);
    if (!error) setTodos(todos.map(t => t.id === id ? { ...t, ...newData } : t));
  };

  // 円グラフ用データの計算
  const chartData = [
    { name: '仕事', value: todos.filter(t => t.tag === '仕事').length, color: '#4f46e5' },
    { name: '学習', value: todos.filter(t => t.tag === '学習').length, color: '#a855f7' },
    { name: 'プライベート', value: todos.filter(t => t.tag === 'プライベート').length, color: '#22c55e' },
  ].filter(d => d.value > 0);

  // カレンダーのバッジ/ドット描画
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toLocaleDateString('sv-SE');
    const dailyTasks = todos.filter(t => t.due_date === dateStr && !t.done);
    const count = dailyTasks.length;

    if (count === 0) return null;

    if (count >= 5) {
      return <div className="task-badge">{count}</div>;
    }

    const dotColor = count >= 3 ? "bg-orange-400" : "bg-indigo-400";
    return (
      <div className="task-dot-container">
        <div className={`task-dot ${dotColor}`} />
      </div>
    );
  };

  const displayedTodos = todos.filter(todo => {
    const matchStatus = filterStatus === "all" ? true : filterStatus === "completed" ? todo.done : !todo.done;
    if (isFilterByDate) {
      const selectedStr = selectedDate.toLocaleDateString('sv-SE'); 
      return matchStatus && todo.due_date === selectedStr;
    }
    return matchStatus;
  });

  const sortedTodos = [...displayedTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
  sortedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  const progress = todos.length === 0 ? 0 : Math.round((todos.filter(t => t.done).length / todos.length) * 100);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-2">
      <div className="flex-grow space-y-6 lg:w-2/3">
        {/* クイック入力フォーム（順序変更・調整済み） */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4 pb-4 border-b border-gray-50 mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">優先度</span>
              <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option value="high">🔴 高</option>
                <option value="medium">🟡 中</option>
                <option value="low">🔵 低</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">ジャンル</span>
              <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option value="仕事">💼 仕事</option>
                <option value="学習">📚 学習</option>
                <option value="プライベート">🏠 プライベート</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">期限</span>
              <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none hover:bg-gray-100 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <input
              className="flex-grow text-lg font-bold outline-none border-b-2 border-transparent focus:border-indigo-500 transition-all py-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="何を実行しますか？"
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
              追加
            </button>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <div className="flex gap-4">
                {['all', 'active', 'completed'].map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs font-black uppercase tracking-widest ${filterStatus === s ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}>
                    {s === 'all' ? 'すべて' : s === 'active' ? '実行中' : '完了済'}
                  </button>
                ))}
              </div>
              {isFilterByDate && (
                <button onClick={() => setIsFilterByDate(false)} className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">
                  📅 {selectedDate.toLocaleDateString()} のみ表示中 (解除)
                </button>
              )}
           </div>

          <ul className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-400 py-10">読み込み中...</p>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} toggleDone={() => toggleDone(todo)} deleteTodo={() => deleteTodo(todo.id)} updateTodo={updateTodo} />
                ))}
              </AnimatePresence>
            )}
          </ul>
        </div>
      </div>

      {/* 右側サイドバー：分析・統計 */}
      <div className="w-full lg:w-80 space-y-6">
        {/* 進捗カード */}
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm uppercase tracking-widest">Progress</h3>
            <span className="text-2xl font-black">{progress}%</span>
          </div>
          <div className="h-2 bg-indigo-400/50 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-white" />
          </div>
        </div>

        {/* カレンダーカード */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Calendar</h3>
           <Calendar 
             onChange={(date) => { setSelectedDate(date); setIsFilterByDate(true); }} 
             value={selectedDate} 
             locale="ja-JP"
             formatDay={(locale, date) => date.getDate()} 
             tileContent={renderTileContent}
             className="border-none w-full"
           />
        </div>

        {/* 円グラフ：ジャンル分析 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Genre Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
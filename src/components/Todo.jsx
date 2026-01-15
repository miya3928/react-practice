import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence, motion } from 'framer-motion';
import Calendar from 'react-calendar'; // 🌟 追加
import 'react-calendar/dist/Calendar.css'; // 🌟 スタイルを追加
import '../calendar-custom.css'; // 🌟 後ほど作るカスタムCSS
import { supabase } from "../supabase"; // 🌟 Supabaseをインポート

export default function Todo({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true); // 読み込み状態

  // 入力用ステート
  const [input, setInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("medium");
  const [dueDateInput, setDueDateInput] = useState("");
  const [tagInput, setTagInput] = useState("プライベート");

  // フィルタ・ソート用ステート
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  const [selectedDate, setSelectedDate] = useState(new Date()); // 🌟 カレンダー用

  // 🌟 1. 初期データの取得 (DBから読み込む)
  useEffect(() => {
    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data);
    }
    setLoading(false);
  };

  // 🌟 2. タスクの追加 (DBへ保存)
  const addTodo = async () => {
    if (!input.trim()) return;

    const newTodo = {
      user_id: user.id, // 🌟 ログインユーザーのIDをセット
      text: input.trim(),
      done: false,
      priority: priorityInput,
      due_date: dueDateInput || null,
      tag: tagInput,
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select(); // 追加したデータを取得

    if (error) {
      alert("追加に失敗しました: " + error.message);
    } else {
      setTodos([data[0], ...todos]); // ローカルの表示も更新
      setInput("");
    }
  };

  // 🌟 3. 完了状態の切り替え (DBを更新)
  const toggleDone = async (todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id);

    if (error) {
      alert("更新に失敗しました");
    } else {
      setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t));
    }
  };

  // 🌟 4. タスクの削除 (DBから削除)
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      alert("削除に失敗しました");
    } else {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  // 🌟 5. タスクの編集保存 (DBを更新)
  const updateTodo = async (id, newData) => {
    // DBのカラム名に合わせる (dueDate -> due_date)
    const dbData = {
      text: newData.text,
      priority: newData.priority,
      due_date: newData.dueDate || newData.due_date,
      tag: newData.tag
    };

    const { error } = await supabase
      .from('todos')
      .update(dbData)
      .eq('id', id);

    if (error) {
      alert("編集に失敗しました");
    } else {
      setTodos(todos.map(t => t.id === id ? { ...t, ...newData } : t));
    }
  };

  // --- フィルタ・ソートロジック (既存のものを維持) ---
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
    if (sortBy === "due_date") {
      return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
  sortedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  const progress = todos.length === 0 ? 0 : Math.round((todos.filter(t => t.done).length / todos.length) * 100);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-2">
      
      {/* --- メインエリア (左側) --- */}
      <div className="flex-grow space-y-6 lg:w-2/3">
        
        {/* クイック入力エリア（上部に配置） */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-grow text-lg font-bold outline-none px-4 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="新しいタスクをクイック追加..."
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo} className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
              追加
            </button>
          </div>
          {/* 詳細設定（折りたたみや簡易表示にしても良いですが、一旦そのまま） */}
          <div className="flex flex-wrap gap-4 mt-3 px-2 border-t pt-3 border-gray-50">
            <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} className="text-xs bg-gray-50 p-2 rounded-lg font-bold outline-none">
              <option value="high">🔴 高</option>
              <option value="medium">🟡 中</option>
              <option value="low">🔵 低</option>
            </select>
            <select value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="text-xs bg-gray-50 p-2 rounded-lg font-bold outline-none">
              <option value="仕事">💼 仕事</option>
              <option value="プライベート">🏠 🏠</option>
              <option value="学習">📚 学習</option>
            </select>
            <input type="date" value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} className="text-xs bg-gray-50 p-2 rounded-lg font-bold outline-none" />
          </div>
        </div>

        {/* フィルタ & タスクリスト */}
        <div className="space-y-4">
           {/* ...以前のフィルタ部分... */}
           <div className="flex gap-2">
              {['all', 'active', 'completed'].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}>
                  {s === 'all' ? 'すべて' : s === 'active' ? '実行中' : '完了済'}
                </button>
              ))}
           </div>

          <ul className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-400 py-10">読み込み中...</p>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedTodos.map((todo) => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    toggleDone={() => toggleDone(todo)}
                    deleteTodo={() => deleteTodo(todo.id)}
                    updateTodo={updateTodo}
                  />
                ))}
              </AnimatePresence>
            )}
          </ul>
        </div>
      </div>

      {/* --- サイドバーエリア (右側) --- */}
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
          <p className="mt-4 text-[10px] font-bold opacity-80">
            {todos.filter(t => t.done).length} / {todos.length} タスク完了
          </p>
        </div>

        {/* 🌟 カレンダー設置場所 */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest px-2">Calendar</h3>
           <Calendar 
             onChange={setSelectedDate} 
             value={selectedDate} 
             locale="ja-JP"
             formatDay={(locale, date) => date.getDate()} //  「日」を消して数字だけにする
             className="border-none w-full"
           />
        </div>

        {/* 🌟 分析の簡易表示（予定地） */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Stats</h3>
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">仕事</span>
                <span className="text-xs font-black text-indigo-600">{todos.filter(t => t.tag === '仕事').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">学習</span>
                <span className="text-xs font-black text-purple-600">{todos.filter(t => t.tag === '学習').length}</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
import { useState, useEffect } from "react";
import TodoItem from "./TodoItem.jsx";
import { AnimatePresence, motion } from 'framer-motion';
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
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* 左側：入力エリア */}
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
              タスクを保存
            </button>
          </div>
        </div>
      </div>

      {/* 右側：進捗 ＆ リスト */}
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
          {/* ...フィルタ部分は以前と同じなので省略せず含める... */}
          <div className="flex flex-col gap-4 bg-gray-100/50 p-4 rounded-2xl">
            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500 px-2">
              <div className="flex items-center gap-1">
                <span>並べ替え:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-indigo-600 outline-none">
                  <option value="created_at">作成順</option>
                  <option value="due_date">期限順</option>
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
    </div>
  );
}
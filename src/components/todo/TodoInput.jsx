import { useState } from "react";
import { supabase } from "../../supabase";

export default function TodoInput({ user, availableGenres, onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("プライベート");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const { data, error } = await supabase.from('todos').insert([{
      user_id: user.id, text: input.trim(), done: false,
      priority, due_date: dueDate, tag,
    }]).select();
    if (!error) {
      onAdd(data[0]);
      setInput("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-wrap gap-4 pb-4 border-b border-gray-50 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">優先度</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none">
            <option value="high">🔴 高</option>
            <option value="medium">🟡 中</option>
            <option value="low">🔵 低</option>
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">ジャンル</span>
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none">
            {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 mb-1 uppercase">期限</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-gray-50 p-2 rounded-xl text-xs font-bold outline-none" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 pt-2">
        <input className="flex-grow text-lg font-bold outline-none py-3" value={input} onChange={(e) => setInput(e.target.value)} placeholder="新しいタスクを入力..." onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        <button onClick={handleSubmit} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">追加</button>
      </div>
    </div>
  );
}
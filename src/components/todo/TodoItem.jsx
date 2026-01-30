import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TodoItem({ todo, toggleDone, deleteTodo, updateTodo }) {
  // 編集モードの状態管理
  const [isEditing, setIsEditing] = useState(false);

  // 編集用の一時データ：due_dateをdueDateとしてマッピング
  const [editData, setEditData] = useState({
    text: todo.text,
    priority: todo.priority,
    tag: todo.tag,
    dueDate: todo.due_date
  });

  // 保存処理：親コンポーネントのupdateTodoを呼び出す
  const handleSave = () => {
    updateTodo(todo.id, editData);
    setIsEditing(false);
  };

  // 日付表示の整形：今日の日付なら「今日」と表示する機能
// TodoItem.jsx 内の getRelativeDate 周辺を修正
const getRelativeStatus = (dateStr, isDone) => {
  if (!dateStr || isDone) return { text: dateStr, isOverdue: false };

    const today = new Date().toLocaleDateString('sv-SE');
  if (dateStr === today) return { text: "今日", isOverdue: false };
  if (dateStr < today) return { text: `期限切れ (${dateStr})`, isOverdue: true };

    return { text: dateStr, isOverdue: false };
};

  // デザイン設定：優先度に応じたアイコン
  const priorityDots = { high: '🔴', medium: '🟡', low: '🔵' };

  // デザイン設定：ジャンルに応じた色分け
  const tagColors = {
    '仕事': 'bg-blue-100 text-blue-600',
    'プライベート': 'bg-green-100 text-green-600',
    '学習': 'bg-purple-100 text-purple-600'
  };

  return (
    <motion.li 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group bg-white p-4 rounded-2xl border transition-all ${todo.done ? 'opacity-60 border-transparent shadow-none' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
    >
      {isEditing ? (
        /* --- 編集モードのレイアウト --- */
        <div className="space-y-3">
          <input
            className="w-full border-2 border-indigo-500 rounded-lg p-2 outline-none"
            value={editData.text}
            onChange={e => setEditData({...editData, text: e.target.value})}
          />
          <div className="flex flex-wrap gap-2">
            <select
              className="border rounded p-2 text-xs flex-1"
              value={editData.priority}
              onChange={e => setEditData({...editData, priority: e.target.value})}
            >
              <option value="high">🔴 高い</option>
              <option value="medium">🟡 普通</option>
              <option value="low">🔵 低い</option>
            </select>
            <input
              type="date"
              className="border rounded p-2 text-xs flex-1"
              value={editData.dueDate || ''}
              onChange={e => setEditData({...editData, dueDate: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold">保存</button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-bold">キャンセル</button>
          </div>
        </div>
      ) : (
        /* --- 通常表示モードのレイアウト --- */
        <div className="flex items-center gap-4">
          {/* 完了切り替えボタン */}
          <button onClick={() => toggleDone(todo.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${todo.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200'}`}>
            {todo.done && '✓'}
          </button>

          <div className="flex-grow">
            {/* タスク名と優先度 */}
            <div className="flex items-center gap-2">
              <span className={`font-bold ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.text}</span>
              <span className="text-xs">{priorityDots[todo.priority]}</span>
            </div>

            {/* ジャンルバッジと期限表示 */}
            <div className="flex gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${tagColors[todo.tag]}`}>
                {todo.tag}
              </span>

            {/* 期限表示機能：データベースのdue_dateを表示 */}
            {todo.due_date && (
              <span className={`text-[10px] font-bold ${
                getRelativeStatus(todo.due_date, todo.done).isOverdue 
                  ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded-md animate-pulse' // 期限切れは赤く、少し動かす
                  : 'text-gray-400'
              }`}>
                📅 {getRelativeStatus(todo.due_date, todo.done).text}
              </span>
              )}
            </div>
          </div>

          {/* 操作ボタン：ホバー時に表示 */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="bg-indigo-50 text-indigo-600 p-3 rounded-xl hover:bg-indigo-100 font-bold text-sm">
              編集
            </button>
            <button onClick={() => deleteTodo(todo.id)} className="bg-red-50 text-red-400 p-3 rounded-xl hover:bg-red-100 text-sm">
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.li>
  );
}
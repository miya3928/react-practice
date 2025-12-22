// TodoItem.jsx 
import { motion } from 'framer-motion';

export default function TodoItem({
  todo, toggleDone, deleteTodo, startEdit, saveEdit, cancelEdit,
  editingId, editingText, setEditingText,
  editingPriority, setEditingPriority,
  editingDueDate, setEditingDueDate,
  editingTag, setEditingTag
}) {
  const isEditing = editingId === todo.id;

  // タグの色分け設定
  const tagColors = {
    '仕事': 'bg-blue-100 text-blue-700',
    'プライベート': 'bg-green-100 text-green-700',
    '学習': 'bg-purple-100 text-purple-700'
  };

  return (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-3 border rounded-lg ${todo.done ? 'bg-gray-50' : 'bg-white shadow-sm'}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input className="border p-1 rounded" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
          <div className="flex gap-2">
            <select className="border p-1 rounded text-xs" value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)}>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <select className="border p-1 rounded text-xs" value={editingTag} onChange={(e) => setEditingTag(e.target.value)}>
              <option value="仕事">💼 仕事</option>
              <option value="プライベート">🏠 プライベート</option>
              <option value="学習">📚 学習</option>
            </select>
            <input type="date" className="border p-1 rounded text-xs" value={editingDueDate} onChange={(e) => setEditingDueDate(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button onClick={() => saveEdit(todo.id)} className="text-blue-500 text-sm">保存</button>
            <button onClick={cancelEdit} className="text-gray-500 text-sm">中止</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={todo.done} onChange={() => toggleDone(todo.id)} className="w-4 h-4" />
            <div className="flex flex-col">
              <span className={`${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.text}
              </span>
              <div className="flex gap-2 mt-1 items-center">
                {/* 🌟 タグ表示 */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tagColors[todo.tag] || 'bg-gray-100'}`}>
                  {todo.tag}
                </span>
                {todo.dueDate && (
                  <span className="text-[10px] text-gray-500 italic">📅 {todo.dueDate}</span>
                )}
                <span className="text-[10px]">{todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEdit(todo)} className="text-gray-400 hover:text-blue-500 text-sm">✎</button>
            <button onClick={() => deleteTodo(todo.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
          </div>
        </div>
      )}
    </motion.li>
  );
}
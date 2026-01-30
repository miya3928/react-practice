import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TodoItem from "./TodoItem"; // パスは適宜調整してください
import { supabase } from "../../supabase";

export default function TodoListArea({ todos, loading, filterStatus, setFilterStatus, counts, onUpdate }) {
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  const activeTodos = todos.filter(t => !t.done);
  const completedTodos = todos.filter(t => t.done);

  // TodoItemに渡す操作関数
  const toggleDone = async (id) => {
    const todo = todos.find(t => t.id === id);
    await supabase.from('todos').update({ done: !todo.done }).eq('id', id);
    onUpdate();
  };

  const deleteTodo = async (id) => {
    await supabase.from('todos').delete().eq('id', id);
    onUpdate();
  };

  const updateTodo = async (id, newData) => {
    const dbData = { text: newData.text, priority: newData.priority, due_date: newData.dueDate, tag: newData.tag };
    await supabase.from('todos').update(dbData).eq('id', id);
    onUpdate();
  };

  return (
    <div className="space-y-4">
      {/* ステータスタブ */}
      <div className="flex gap-6 px-2">
        {[{ id: 'all', label: 'すべて' }, { id: 'active', label: '実行中' }, { id: 'completed', label: '完了済' }].map((s) => (
          <button 
            key={s.id} 
            onClick={() => setFilterStatus(s.id)} 
            className={`relative pb-2 text-xs font-black uppercase transition-all ${filterStatus === s.id ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            {s.label} <span className="ml-1 opacity-50">{counts[s.id]}</span>
            {filterStatus === s.id && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
        <ul className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activeTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} toggleDone={toggleDone} deleteTodo={deleteTodo} updateTodo={updateTodo} />
            ))}
          </AnimatePresence>
        </ul>

        {completedTodos.length > 0 && (
          <div className="space-y-3">
            <button onClick={() => setIsCompletedOpen(!isCompletedOpen)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
              <span>{isCompletedOpen ? '▼' : '▶'} 完了済み ({completedTodos.length})</span>
              <div className="flex-grow h-[1px] bg-gray-100" />
            </button>
            <AnimatePresence>
              {isCompletedOpen && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                  {completedTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} toggleDone={toggleDone} deleteTodo={deleteTodo} updateTodo={updateTodo} />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
        {loading && <p className="text-center text-gray-400 py-10">読み込み中...</p>}
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from 'framer-motion';
import { supabase } from "../../supabase";

// 切り出したコンポーネントたちをインポート
import TodoInput from "./TodoInput";
import TodoFilter from "./TodoFilter";
import TodoListArea from "./TodoListArea";
import Progress from "./Progress";
import Calendar from "./Calendar";
import Analysis from "./Analysis";
import GenreSettings from "./GenreSettings";

export default function Todo({ user, activeTab }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterByDate, setIsFilterByDate] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGenre, setFilterGenre] = useState("すべて");
  const [sortBy, setSortBy] = useState("due_date");
  const [availableGenres, setAvailableGenres] = useState(['仕事', '学習', 'プライベート']);

  useEffect(() => { fetchTodos(); }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (!error) setTodos(data);
    setLoading(false);
  };

  // フィルタリングロジック（useMemoで最適化）
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchStatus = filterStatus === "all" ? true : filterStatus === "completed" ? todo.done : !todo.done;
      const matchGenre = filterGenre === "すべて" ? true : todo.tag === filterGenre;
      const matchDate = isFilterByDate ? todo.due_date === selectedDate.toLocaleDateString('sv-SE') : true;
      return matchStatus && matchGenre && matchDate;
    }).sort((a, b) => {
      if (sortBy === "priority") return { high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority];
      if (sortBy === "due_date") return (a.due_date || "9999") > (b.due_date || "9999") ? 1 : -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [todos, filterStatus, filterGenre, sortBy, isFilterByDate, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-2 mb-20 md:mb-0">
      
      {/* メインエリア (Todoリスト側) */}
      <div className={`${activeTab === 'todo' ? 'block' : 'hidden lg:block'} flex-grow space-y-6 lg:w-2/3`}>
        <Progress progress={calculateProgress(todos)} isMobile={true} />
        
        <TodoInput user={user} availableGenres={availableGenres} onAdd={(newTodo) => setTodos([newTodo, ...todos])} />
        
        <TodoFilter 
          availableGenres={availableGenres} 
          filterGenre={filterGenre} 
          setFilterGenre={setFilterGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <TodoListArea 
          todos={filteredTodos} 
          loading={loading}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          counts={{
            all: todos.length,
            active: todos.filter(t => !t.done).length,
            completed: todos.filter(t => t.done).length
          }}
          onUpdate={fetchTodos} // 再取得して最新化
        />
      </div>

      {/* サイドバーエリア (カレンダー・分析・設定) */}
      <div className="w-full lg:w-80 space-y-6">
        <Progress progress={calculateProgress(todos)} isMobile={false} />

        <Calendar
          activeTab={activeTab} 
          todos={todos} 
          selectedDate={selectedDate} 
          setSelectedDate={(date) => { setSelectedDate(date); setIsFilterByDate(true); }} 
        />

        <Analysis 
          activeTab={activeTab} 
          todos={todos} 
          availableGenres={availableGenres} 
        />

        <GenreSettings
          activeTab={activeTab} 
          availableGenres={availableGenres} 
          setAvailableGenres={setAvailableGenres} 
        />
      </div>
    </div>
  );
}

// ヘルパー関数
function calculateProgress(todos) {
  if (todos.length === 0) return 0;
  return Math.round((todos.filter(t => t.done).length / todos.length) * 100);
}
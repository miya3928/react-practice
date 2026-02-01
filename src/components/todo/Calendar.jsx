import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // ベースのスタイル
import '../../calendar-custom.css'; // パスに注意！2つ上の階層にある場合

export default function Calendar({ activeTab, todos, selectedDate, setSelectedDate }) {
  
  // 各日付の内容（ドットやバッジ）を描画する関数
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toLocaleDateString('sv-SE');
    
    // その日の未完了タスクを取得
    const dailyTasks = todos.filter(t => t.due_date === dateStr && !t.done);
    const count = dailyTasks.length;

    if (count === 0) return null;

    // 5個以上の場合は数字バッジ（CSSの .task-badge を使用）
    if (count >= 5) {
      return <div className="task-badge">{count}</div>;
    }

    // 1〜4個の場合はドットを表示（CSSの .task-dot-container と .task-dot を使用）
    return (
      <div className="task-dot-container">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className={`task-dot ${count >= 3 ? "bg-orange-400" : "bg-indigo-400"}`} 
          />
        ))}
      </div>
    );
  };

  // 土日の色を変えるためのクラスを付与する関数
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return "";
    const day = date.getDay();
    if (day === 0) return 'tile-sunday-holiday'; // 日曜日
    if (day === 6) return 'tile-saturday';       // 土曜日
    return "";
  };

  return (
    <div className={`${activeTab === 'calendar' ? 'block' : 'hidden lg:block'} bg-white p-6 rounded-3xl shadow-sm border border-gray-100`}>
      <h3 className="text-xs font-black text-gray-400 mb-4 uppercase">Calendar</h3>
      <CalendarComponent 
        onChange={setSelectedDate} 
        value={selectedDate} 
        locale="ja-JP" 
        formatDay={(l, d) => d.getDate()} 
        tileContent={renderTileContent}
        tileClassName={getTileClassName} // 土日のクラスを適用
        className="border-none w-full" 
      />
    </div>
  );
}
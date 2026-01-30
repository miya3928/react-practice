import CalendarComponent from 'react-calendar';

export default function Calendar({ activeTab, todos, selectedDate, setSelectedDate }) {
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = date.toLocaleDateString('sv-SE');
    const hasTasks = todos.some(t => t.due_date === dateStr && !t.done);
    return hasTasks ? (
      <div className="flex justify-center mt-1">
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
      </div>
    ) : null;
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
        className="border-none w-full" 
      />
    </div>
  );
}
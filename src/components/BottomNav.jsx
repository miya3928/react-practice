import { LayoutList, Calendar, PieChart, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'todo', label: 'タスク', icon: <LayoutList size={20} /> },
    { id: 'calendar', label: 'カレンダー', icon: <Calendar size={20} /> },
    { id: 'analysis', label: '分析', icon: <PieChart size={20} /> },
    { id: 'settings', label: '設定', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-3 pb-6 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-gray-400'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-bold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
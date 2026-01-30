import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Analysis({ activeTab, todos, availableGenres }) {
  const chartData = availableGenres.map(genre => ({
    name: genre,
    value: todos.filter(t => t.tag === genre).length,
    color: genre === '仕事' ? '#4f46e5' : genre === '学習' ? '#a855f7' : '#22c55e'
  })).filter(d => d.value > 0);

  return (
    <div className={`${activeTab === 'analysis' ? 'block' : 'hidden lg:block'} bg-white p-6 rounded-3xl shadow-sm border border-gray-100`}>
      <h3 className="text-xs font-black text-gray-400 mb-2 uppercase">Genre Analysis</h3>
      {(activeTab === 'analysis' || window.innerWidth >= 1024) && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
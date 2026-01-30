export default function TodoFilter({ availableGenres, filterGenre, setFilterGenre, sortBy, setSortBy }) {
  return (
    <div className="bg-white/50 p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['すべて', ...availableGenres].map(g => (
          <button 
            key={g} 
            onClick={() => setFilterGenre(g)} 
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
              filterGenre === g ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-gray-100'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-gray-400 uppercase">ソート:</span>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className="bg-transparent text-[10px] font-black text-indigo-600 outline-none cursor-pointer"
        >
          <option value="due_date">期限順</option>
          <option value="priority">重要度順</option>
          <option value="created_at">新着順</option>
        </select>
      </div>
    </div>
  );
}
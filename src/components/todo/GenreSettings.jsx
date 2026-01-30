import { PlusCircle, Settings2 } from 'lucide-react';

export default function GenreSettings({ activeTab, availableGenres, setAvailableGenres }) {
  const addGenre = () => {
    const input = document.getElementById('new-genre-input');
    if (input.value && !availableGenres.includes(input.value)) {
      setAvailableGenres([...availableGenres, input.value]);
      input.value = "";
    }
  };

  return (
    <div className={`${activeTab === 'settings' ? 'block' : 'hidden lg:block'} bg-white p-6 rounded-3xl shadow-sm border border-gray-100`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings2 size={16} className="text-gray-400" />
        <h3 className="text-xs font-black text-gray-400 uppercase">Manage Genres</h3>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input 
            id="new-genre-input"
            className="flex-grow bg-gray-50 p-2 rounded-xl text-xs outline-none" 
            placeholder="新ジャンル名..." 
          />
          <button onClick={addGenre} className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
            <PlusCircle size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableGenres.map(genre => (
            <span key={genre} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full flex items-center gap-2">
              {genre}
              <button onClick={() => setAvailableGenres(availableGenres.filter(g => g !== genre))} className="hover:text-red-500 text-gray-300">✕</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
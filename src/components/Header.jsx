export default function Header({ user, onLogout, onOpenProfile }) {
  return (
    <header className="bg-white shadow-sm border-b p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-black text-indigo-600 tracking-tighter">MY TODO</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenProfile} // 🌟 ここをクリックでプロフィール開く
              className="text-gray-700 text-sm font-bold hover:text-indigo-600 transition-colors"
            >
              👤 {user.name} さん
            </button>
            <button onClick={onLogout} className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-100">
              ログアウト
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">未ログイン</span>
        )}
      </div>
    </header>
  );
}
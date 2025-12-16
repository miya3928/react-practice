
export default function Header({ user, onLogout }) {
  return (
      <header className="bg-white shadow-md p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                  My Todo App
              </h1>
              {/* 🌟 ユーザー情報とログアウトボタン */}
              {user ? (
                  <div className="flex items-center gap-4">
                      <span className="text-gray-700 text-sm">
                          ようこそ, **{user.name}** さん
                      </span>
                      <button
                          onClick={onLogout}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-150"
                      >
                          ログアウト
                      </button>
                  </div>
              ) : (
                  <span className="text-gray-500 text-sm">未ログイン</span>
              )}
          </div>
      </header>
  );
}
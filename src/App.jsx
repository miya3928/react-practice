import { useState, useEffect } from 'react';
import './index.css';
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Todo from "./components/Todo.jsx";
import Profile from "./components/Profile.jsx"; // インポート

const getInitialUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

function App() {
  const [user, setUser] = useState(getInitialUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // 🌟 プロフィール表示フラグ

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleLogin = (userInfo) => setUser(userInfo);
  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🌟 ユーザー名クリックでプロフィールを開くように関数を渡す */}
      <Header user={user} onLogout={handleLogout} onOpenProfile={() => setIsProfileOpen(true)} />

      <Main className="flex-grow">
        {user ? <Todo user={user} /> : <Login onLogin={handleLogin} />}
      </Main>

      {/* 🌟 プロフィールをモーダルとして表示 */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >✕</button>
            <Profile user={user} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
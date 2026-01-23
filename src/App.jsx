// src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';
import { supabase } from "./supabase"; // 接続設定ファイル
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import Auth from "./components/Auth.jsx"; // 新しいAuthコンポーネント
import Todo from "./components/Todo.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Supabaseのログイン状態を監視
  useEffect(() => {
    // 現在のログインセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ログイン・ログアウトの変化をリッスン
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ログインユーザーがいれば情報を渡す、いなければ null */}
      {/* App.jsx の Header への渡し方 */}
      <Header
        user={session?.user ? {
          ...session.user,
          display_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
        } : null}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

        <Main>
          {session ? (
            // activeTab を Todo コンポーネントに渡す
            <Todo user={session.user} activeTab={activeTab} />
          ) : (
            <Auth />
          )}
        </Main>

        {/* プロフィールモーダル */}
        {isProfileOpen && session && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >✕</button>
              <Profile user={session.user} />
            </div>
          </div>
        )}

        {/* ログイン中のみボトムナビを表示 */}
      {session && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}

      <Footer className="hidden md:block" /> {/* PCのみ表示 */}
    </div>
  );
}

export default App;
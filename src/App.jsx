// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from "./supabase";
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import Auth from "./components/Auth.jsx";
import Todo from "./components/Todo.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  // 1. Stateはすべて一番上にまとめる
  const [session, setSession] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todo'); // ここで定義

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
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
      <Header
        user={session?.user ? {
          ...session.user,
          display_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
        } : null}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* pb-20 を入れることで、ボトムナビに隠れないようにする */}
      <div className="flex-grow pb-20 md:pb-0">
        <Main>
          {session ? (
            <Todo user={session.user} activeTab={activeTab} />
          ) : (
            <Auth />
          )}
        </Main>
      </div>

      {/* ログイン中かつスマホの時だけボトムナビを出す */}
      <AnimatePresence>
        {session && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* classNameをFooterに渡す */}
      <Footer className="hidden md:block" />
    </div>
  );
}

export default App;
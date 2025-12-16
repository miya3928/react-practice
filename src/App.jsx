import { useState, useEffect } from 'react'; // useEffect を追加
import './index.css';
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
// 🌟 新規インポート
import Login from "./components/Login.jsx";
import Todo from "./components/Todo.jsx";


// 💡 認証状態を localStorage から読み込むヘルパー関数
const getInitialUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};


function App() {
  // 🌟 1. ユーザー認証ステートの定義 (初期値は localStorage から)
  const [user, setUser] = useState(getInitialUser);

  // 🌟 2. ユーザー状態の永続化
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // ログイン処理
  const handleLogin = (userInfo) => {
    setUser(userInfo); // userInfo には { name: '...' } が入る
  };

  // ログアウト処理
  const handleLogout = () => {
    setUser(null);
  };

  // 3. 表示するメインコンテンツを決定
  const content = user ? (
    // ログイン済みの場合、Todoリストを表示
    <Todo user={user} />
  ) : (
    // 未ログインの場合、ログインフォームを表示
    <Login onLogin={handleLogin} />
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* user情報をHeaderに渡し、ログアウトボタンを表示可能にする */}
      <Header user={user} onLogout={handleLogout} />

      {/* Mainコンポーネントでコンテンツを表示 */}
      <Main className="flex-grow">
          {content}
      </Main>

      <Footer />
    </div>
  );
}

export default App;
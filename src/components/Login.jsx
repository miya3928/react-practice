import React from "react";
import { useState } from "react";

// 認証機能をProps
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ name: username });
    } else {
      alert("ユーザー名とパスワードを入力してください");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-xl rounded-lg border my-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-300"
                        placeholder="ユーザー名を入力"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-300"
                        placeholder="パスワードを入力"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                    ログイン
                </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-4">
                ※ ダミー認証です。
            </p>
    </div>
  );
}
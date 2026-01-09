import { useState } from 'react';
import { supabase } from '../supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (type) => {
    setLoading(true);
    const { error } = type === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else if (type === 'signup') alert('確認メールを送信しました！（設定によっては即ログイン可能です）');
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-black text-center text-indigo-600 mb-8 uppercase tracking-widest">Welcome</h2>
        <div className="space-y-4">
          <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button onClick={() => handleLogin('login')} disabled={loading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200">
            {loading ? '処理中...' : 'ログイン'}
          </button>
          <button onClick={() => handleLogin('signup')} disabled={loading} className="w-full text-indigo-600 font-bold py-2 text-sm">
            新規アカウント作成
          </button>
        </div>
      </div>
    </div>
  );
}
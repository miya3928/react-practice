import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Message from '/component/Message.jsx'
import Profile from '/component/Profile.jsx'

function App() {
  const [count, setCount] = useState(0)
  const items = ["りんご", "みかん", "ぶどう"];

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Todo追加処理
  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, input]);
    setInput("");
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <Profile />

      <h2>コンポーネント練習です</h2>
      <Message text="これは別ファイルのコンポーネントです！" />

      {/* リスト表示 */}
      <ul>
        {items.map((item) => (<li key={item}>{item}</li>))}
      </ul>

      {/* 入力フォーム */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>入力中の文字: {text}</p>

      {/* Todo 入力欄 */}
      <h2>Todoリスト</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo}>追加</button>

      {/* Todo一覧 */}
      <ul>
        {todos.map((t, index) => (
          <li key={index}>{t}</li>
        ))}
      </ul>
    </>
  )
}

export default App
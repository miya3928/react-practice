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
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <Profile />
      </div>
      <div>
        <h1>コンポーネント練習です</h1>
        <Message text="これは別ファイルのコンポーネントです！" />
      </div>
      <ul>
       {items.map((item) => (
         <li key={item}>{item}</li>
       ))}
      </ul>
      <input
       type="text"
       value={(Text)}
       onChange={(e) => setText(e.target.value)}
  />
      <p>入力中の文字: {text}</p>
    </>
  )
}

export default App

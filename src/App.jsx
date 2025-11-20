import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import Message from './components/Message.jsx'
import Profile from './components/Profile.jsx'

function App() {

  return (
    <>
      <Header />
      <Main />
      <Profile />

      <h2>コンポーネント練習です</h2>
      <Message text="これは別ファイルのコンポーネントです！" />

      <Footer />
    </>
  )
}

export default App
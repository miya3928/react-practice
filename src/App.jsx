import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Main className="flex-grow">
      </Main>
      <Footer />
    </div>
  )
}

export default App
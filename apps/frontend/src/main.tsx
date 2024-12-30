import { createRoot } from 'react-dom/client';
import './index.css';
import Chat from './pages/chat/Chat.tsx';
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Layout.tsx";
import Home from "./pages/home/Home.tsx";
import Start from "./pages/chat/Start.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/chat" element={<Start />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

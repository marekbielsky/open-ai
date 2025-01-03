import { createRoot } from 'react-dom/client';
import './index.css';
import Chat from './pages/chat/Chat.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './Layout.tsx';
import Home from './pages/home/Home.tsx';
import Start from './pages/chat/Start.tsx';
import Login from './pages/auth/Login.tsx';
import ProtectedLayout from './pages/auth/ProtectedLayout.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />

          <Route path="chat" element={<ProtectedLayout />}>
            <Route index element={<Start />} />
            <Route path=":chatId" element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

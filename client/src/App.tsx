import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { LanguageProvider } from './context/LanguageContext';
import { AdminPage } from './pages/AdminPage';
import { StorePage } from './pages/StorePage';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-bg" />
        <Header />
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

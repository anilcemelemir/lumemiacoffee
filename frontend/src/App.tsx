import { Routes, Route } from 'react-router';
import PublicSite from './pages/PublicSite';
import MenuPage from './pages/MenuPage';
import HikayemizPage from './pages/HikayemizPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { RequireAuth } from './components/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/hikayemiz" element={<HikayemizPage />} />
      <Route path="/admin-giris" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}

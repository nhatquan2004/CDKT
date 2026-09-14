import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import SelectTeamPage from './pages/player/SelectTeamPage';
import MapCheckinPage from './pages/player/MapCheckinPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#194D31',
              color: '#F5FAF6',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: '600',
              borderRadius: '12px',
              padding: '12px 18px',
              fontSize: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.15)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#194D31' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#194D31' },
            },
          }}
        />

        <Routes>
          {/* =============================== */}
          {/* 2 màn hình công khai (người chơi) */}
          {/* =============================== */}
          <Route path="/" element={<SelectTeamPage />} />
          <Route path="/map" element={<MapCheckinPage />} />

          {/* =============================== */}
          {/* Route admin ẩn — /btc-admin */}
          {/* =============================== */}
          <Route path="/btc-admin/login" element={<AdminLoginPage />} />

          {/* Các route admin được bảo vệ bằng JWT */}
          <Route
            path="/btc-admin/submissions"
            element={
              <ProtectedRoute>
                <AdminSubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/btc-admin/locations"
            element={
              <ProtectedRoute>
                <AdminLocationsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect /btc-admin → submissions */}
          <Route path="/btc-admin" element={<Navigate to="/btc-admin/submissions" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocationEditForm from '../../components/admin/LocationEditForm';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminLocationsPage = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/locations');
      setLocations(data);
    } catch {
      toast.error('Không thể tải danh sách điểm!');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdated = (updated) => {
    setLocations((prev) => prev.map((loc) => (loc._id === updated._id ? updated : loc)));
  };

  const handleLogout = () => {
    logout();
    navigate('/btc-admin/login', { replace: true });
    toast.success('Đã đăng xuất thành công!');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#194D31] text-white sticky top-0 z-40 shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide leading-tight">BTC Dashboard</h1>
              <p className="text-[11px] text-emerald-200/80 font-medium">Cuộc Đua Kỳ Thú 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-white/80">{adminUser?.username || 'Ban Tổ Chức'}</span>
            </div>
            <button
              id="btn-logout-loc"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/30 border border-white/15 px-3 py-2 rounded-lg font-semibold transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-6">
          <Link
            to="/btc-admin/submissions"
            id="tab-submissions-nav"
            className="flex items-center gap-2 py-3.5 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-[#194D31] transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Minh chứng check-in</span>
          </Link>

          <Link
            to="/btc-admin/locations"
            id="tab-locations-nav"
            className="flex items-center gap-2 py-3.5 text-sm font-bold border-b-2 border-[#194D31] text-[#194D31] transition-colors"
          >
            <svg className="w-4 h-4 text-[#194D31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Quản lý 6 điểm check-in</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Thiết lập các điểm check-in</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Tùy chỉnh tên điểm và nội dung thử thách mà các đội cần thực hiện khi đến vị trí.
            </p>
          </div>
          <button
            onClick={fetchLocations}
            className="p-2 rounded-lg text-gray-500 hover:text-[#194D31] hover:bg-emerald-50 transition-colors"
            title="Làm mới"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200/70">
            <div className="w-8 h-8 border-3 border-[#194D31] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-gray-500">Đang tải danh sách điểm...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {locations.map((loc) => (
              <LocationEditForm key={loc._id} location={loc} onUpdated={handleLocationUpdated} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLocationsPage;

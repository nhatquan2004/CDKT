import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SubmissionCard from '../../components/admin/SubmissionCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSubmissionsPage = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTeam, setFilterTeam] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    fetchSubmissions();

    // Polling mỗi 5s — chỉ gọi API khi tab đang được hiển thị, silent=true để không flash spinner
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSubmissions(true);
      }
    }, 5000);

    // Refresh ngay khi BTC quay lại tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchSubmissions(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const fetchSubmissions = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get('/submissions');
      setSubmissions(data);
    } catch {
      if (!silent) toast.error('Không thể tải danh sách minh chứng!');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/btc-admin/login', { replace: true });
    toast.success('Đã đăng xuất thành công!');
  };

  const filtered = submissions.filter((s) => {
    const matchTeam = filterTeam ? s.team?.name === filterTeam : true;
    const matchLoc = filterLocation ? s.location?.index === parseInt(filterLocation) : true;
    return matchTeam && matchLoc;
  });

  const uniqueTeams = [...new Set(submissions.map((s) => s.team?.name).filter(Boolean))].sort();
  const uniqueLocations = [...new Set(submissions.map((s) => s.location?.index).filter(Boolean))].sort((a, b) => a - b);

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
              id="btn-logout"
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
            id="tab-submissions"
            className="flex items-center gap-2 py-3.5 text-sm font-bold border-b-2 border-[#194D31] text-[#194D31] transition-colors"
          >
            <svg className="w-4 h-4 text-[#194D31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Minh chứng check-in</span>
          </Link>

          <Link
            to="/btc-admin/locations"
            id="tab-locations"
            className="flex items-center gap-2 py-3.5 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-[#194D31] transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#194D31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Quản lý 6 điểm check-in</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng minh chứng</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{submissions.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#194D31]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Số team đã nộp</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{uniqueTeams.length} <span className="text-xs text-gray-400 font-normal">/ 10</span></p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Điểm đã check-in</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{uniqueLocations.length} <span className="text-xs text-gray-400 font-normal">/ 6</span></p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              Danh sách ({filtered.length} kết quả)
            </span>
            <button
              onClick={fetchSubmissions}
              className="p-1.5 rounded-lg text-gray-500 hover:text-[#194D31] hover:bg-emerald-50 transition-colors"
              title="Làm mới"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              id="filter-team"
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#194D31] focus:ring-1 focus:ring-[#194D31] transition-all"
            >
              <option value="">Tất cả team</option>
              {uniqueTeams.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              id="filter-location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#194D31] focus:ring-1 focus:ring-[#194D31] transition-all"
            >
              <option value="">Tất cả điểm</option>
              {uniqueLocations.map((l) => (
                <option key={l} value={l}>Điểm {l}</option>
              ))}
            </select>

            {(filterTeam || filterLocation) && (
              <button
                onClick={() => { setFilterTeam(''); setFilterLocation(''); }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-2"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200/70">
            <div className="w-8 h-8 border-3 border-[#194D31] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-gray-500">Đang tải dữ liệu minh chứng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200/70 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800">Chưa có minh chứng nào phù hợp</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Khi các đội thực hiện check-in và gửi ảnh chụp, dữ liệu sẽ ngay lập tức được hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filtered.map((sub) => (
              <SubmissionCard key={sub._id} submission={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSubmissionsPage;

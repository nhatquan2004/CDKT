import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CLOUDS_BG = '/clouds_bg.jpg';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', {
        username: form.username,
        password: form.password,
      });
      login(data.token, data.admin);
      toast.success(`Chào mừng, ${data.admin.username}!`);
      navigate('/btc-admin/submissions', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 overflow-hidden bg-slate-900">
      {/* Nền ảnh mây chụp từ trên cao chân thực (Photographic Clouds) kèm hiệu ứng trôi êm dịu */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none scale-105"
        style={{
          backgroundImage: `url('${CLOUDS_BG}')`,
          animation: 'cloudsFloat 35s ease-in-out infinite alternate',
        }}
      />

      {/* Lớp phủ điện ảnh tinh tế */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 via-transparent to-slate-900/30 pointer-events-none" />

      {/* Style animation chuyển động mây mượt mà */}
      <style>{`
        @keyframes cloudsFloat {
          0% { transform: scale(1.05) translate(0px, 0px); }
          50% { transform: scale(1.10) translate(-15px, -8px); }
          100% { transform: scale(1.05) translate(15px, 8px); }
        }
      `}</style>

      {/* Card kính mờ Frosted Glassmorphism đẳng cấp */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-white/40 backdrop-blur-2xl bg-white/25 sm:bg-white/30 transition-all">
        {/* Header / Icon */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-white/45 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-center mb-4 text-[#194D31]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight text-center">
            Welcome back
          </h1>
          <p className="text-xs text-gray-700 font-semibold mt-1 text-center">
            Cổng quản trị BTC – Cuộc Đua Kỳ Thú 2026
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5"
            >
              Tên đăng nhập
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập..."
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/70 hover:bg-white/85 focus:bg-white text-gray-900 placeholder-gray-500 border border-white/70 focus:border-[#194D31] focus:ring-2 focus:ring-[#194D31]/20 outline-none text-sm font-medium transition-all shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu..."
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/70 hover:bg-white/85 focus:bg-white text-gray-900 placeholder-gray-500 border border-white/70 focus:border-[#194D31] focus:ring-2 focus:ring-[#194D31]/20 outline-none text-sm font-medium transition-all shadow-xs pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-admin-login"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#194D31] hover:bg-[#123824] active:scale-[0.99] text-white font-black text-sm tracking-wide transition-all shadow-[0_10px_25px_rgba(25,77,49,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-gray-700 font-medium">
          Dành riêng cho Ban Tổ Chức Cuộc Đua Kỳ Thú
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;

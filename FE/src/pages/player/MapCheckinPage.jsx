import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPin from '../../components/player/MapPin';
import CheckinPanel from '../../components/player/CheckinPanel';
import api from '../../services/api';

const MapCheckinPage = () => {
  const navigate = useNavigate();
  const mapImage = encodeURI('/MÀN 2.png');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [completedLocations, setCompletedLocations] = useState(new Set());

  const teamId = localStorage.getItem('selectedTeamId');
  const teamName = localStorage.getItem('selectedTeamName');

  // Fetch completed locations từ server — source of truth thay vì localStorage
  const fetchCompleted = useCallback(async () => {
    if (!teamId) return;
    try {
      const { data } = await api.get(`/submissions/my/${teamId}`);
      setCompletedLocations(new Set(data)); // data = mảng locationId strings
    } catch (err) {
      console.error('Lỗi sync completed locations:', err);
    }
  }, [teamId]);

  useEffect(() => {
    if (!teamId) { navigate('/', { replace: true }); return; }

    // Fetch locations và completed state song song
    const fetchAll = async () => {
      try {
        const [locRes] = await Promise.all([
          api.get('/locations'),
          fetchCompleted(),
        ]);
        setLocations(locRes.data);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    // Auto-refresh completed state mỗi 10s — đảm bảo đồng bộ với server
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCompleted();
      }
    }, 10000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchCompleted();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [teamId, navigate, fetchCompleted]);

  // Sau khi nộp thành công: cập nhật state ngay + đồng bộ lại từ server
  const handleCheckinSuccess = async (locationId) => {
    // Cập nhật UI tức thì (optimistic update)
    setCompletedLocations((prev) => new Set([...prev, locationId]));
    // Sau đó đồng bộ lại từ server để đảm bảo chính xác
    await fetchCompleted();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F5FAF6]">
        <div className="w-12 h-12 border-4 border-[#236640] border-t-transparent rounded-full animate-spin" />
        <p className="text-[rgba(15,43,26,0.50)] font-medium">Đang tải bản đồ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAF6]">
      {/* Header sang trọng & cao cấp */}
      <header className="bg-gradient-to-r from-[#0d2a19] via-[#143e26] to-[#0d2a19] text-[#F5FAF6] px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.30)] z-30 flex-shrink-0 border-b border-emerald-900/40">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
          {/* Nút Quay lại bên trái */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-semibold text-emerald-100 border border-white/15 backdrop-blur-sm shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Quay lại</span>
          </button>

          {/* Tiêu đề trung tâm */}
          <div className="text-center flex-1 px-1">
            <h1 className="font-black text-sm sm:text-base leading-tight tracking-wide text-white uppercase drop-shadow-sm">
              Bản Đồ Check-in
            </h1>
            <p className="text-[10px] text-emerald-300/80 font-semibold tracking-wider uppercase mt-0.5">
              Cuộc Đua Kỳ Thú 2026
            </p>
          </div>

          {/* Badge Team sang trọng bên phải */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C8A951]/25 to-[#E5C97A]/25 border border-[#C8A951]/60 shadow-[0_2px_8px_rgba(200,169,81,0.2)] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A951] shadow-[0_0_8px_#C8A951] animate-pulse" />
            <span className="font-black text-xs text-amber-100 tracking-wider uppercase">{teamName}</span>
          </div>
        </div>
      </header>

      {/* Thanh tiến độ đồng bộ phong cách cao cấp */}
      <div className="bg-[#0b2415] border-b border-emerald-950 px-4 py-2 flex-shrink-0 shadow-inner">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider">Tiến độ</span>
            <span className="text-xs font-black text-[#C8A951] bg-[#C8A951]/15 px-2 py-0.5 rounded-md border border-[#C8A951]/30">
              {completedLocations.size}/{locations.length} điểm
            </span>
          </div>
          <div className="flex-1 max-w-[130px] sm:max-w-[160px] h-2 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#C8A951] to-[#f3dfa2] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(200,169,81,0.6)]"
              style={{ width: `${(completedLocations.size / (locations.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Khu vực bản đồ */}
      <div className="flex-1 relative overflow-auto">
        <div className="relative w-full max-w-lg mx-auto">
          <img
            src={mapImage}
            alt="Bản đồ Check-in TP. Hồ Chí Minh"
            className="w-full h-auto block rounded-b-2xl shadow-sm"
          />
          {locations.map((loc) => (
            <MapPin
              key={loc._id} location={loc}
              isCompleted={completedLocations.has(loc._id)}
              isSelected={selectedLocation?._id === loc._id}
              onClick={setSelectedLocation}
            />
          ))}
        </div>

        {!selectedLocation && (
          <div className="max-w-lg mx-auto px-4 pt-4">
            <div className="flex items-start gap-3 bg-[rgba(200,169,81,0.12)] border border-[rgba(200,169,81,0.28)] rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-amber-200/50 flex items-center justify-center flex-shrink-0 text-amber-800">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0F2B1A] leading-relaxed">
                <strong>HÃY BẤM VÀO ĐIỂM CHECK IN</strong> TRÊN MAP ĐỂ NHẬN THÔNG TIN VỀ ĐIỂM CHECK IN!
              </p>
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C8A951] border-2 border-white shadow-sm flex items-center justify-center text-xs font-black text-[#0F2B1A]">1</div>
                <span className="text-xs font-medium text-[rgba(15,43,26,0.60)]">Chưa check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#236640] border-2 border-white shadow-sm flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[rgba(15,43,26,0.60)]">Đã hoàn thành</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedLocation && (
        <CheckinPanel
          location={selectedLocation} teamId={teamId} teamName={teamName}
          onClose={() => setSelectedLocation(null)} onSuccess={handleCheckinSuccess}
        />
      )}
    </div>
  );
};

export default MapCheckinPage;

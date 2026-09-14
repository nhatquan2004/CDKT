import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPin from '../../components/player/MapPin';
import CheckinPanel from '../../components/player/CheckinPanel';
import api from '../../services/api';

const MapCheckinPage = () => {
  const navigate = useNavigate();
  const mapImage = '/Screenshot 2026-09-14 205627.png';
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [completedLocations, setCompletedLocations] = useState(new Set());

  const teamId = localStorage.getItem('selectedTeamId');
  const teamName = localStorage.getItem('selectedTeamName');

  useEffect(() => {
    if (!teamId) { navigate('/', { replace: true }); return; }

    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/locations');
        setLocations(data);
      } catch (err) {
        console.error('Lỗi tải locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();

    const savedCompleted = localStorage.getItem(`completed_${teamId}`);
    if (savedCompleted) setCompletedLocations(new Set(JSON.parse(savedCompleted)));
  }, [teamId, navigate]);

  const handleCheckinSuccess = (locationId) => {
    const updated = new Set([...completedLocations, locationId]);
    setCompletedLocations(updated);
    localStorage.setItem(`completed_${teamId}`, JSON.stringify([...updated]));
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
      {/* Header */}
      <header className="bg-[#236640] text-[#F5FAF6] px-4 py-3 shadow-[0_4px_16px_rgba(35,102,64,0.35)] z-30 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-base leading-tight flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Bản Đồ Check-in</span>
            </h1>
            <p className="text-xs text-[rgba(245,250,246,0.70)] font-medium">Cuộc Đua Kỳ Thú 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[rgba(245,250,246,0.18)] border border-[rgba(245,250,246,0.28)] rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#C8A951] animate-pulse" />
              <span className="font-black text-xs">{teamName}</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[rgba(245,250,246,0.65)] hover:text-white underline font-medium"
            >
              Đổi team
            </button>
          </div>
        </div>
      </header>

      {/* Tiến độ */}
      <div className="bg-[rgba(35,102,64,0.06)] border-b border-[rgba(35,102,64,0.10)] px-4 py-2 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <p className="text-xs font-bold text-[#0F2B1A]">
            Đã check-in: {completedLocations.size}/{locations.length} điểm
          </p>
          <div className="w-32 h-2 bg-[rgba(35,102,64,0.12)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C8A951] rounded-full transition-all duration-500"
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
                <strong>Bấm vào các pin màu vàng</strong> trên bản đồ để xem nhiệm vụ và nộp minh chứng check-in!
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

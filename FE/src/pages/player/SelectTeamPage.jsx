import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamButton from '../../components/player/TeamButton';
import api from '../../services/api';

const POSTER_BG = '/789216604_1493878392773215_2787463602002314415_n.jpg';

const SelectTeamPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get('/teams');
        setTeams(data);
      } catch (err) {
        setError('Không thể tải danh sách team. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();

    const savedTeamId = localStorage.getItem('selectedTeamId');
    const savedTeamName = localStorage.getItem('selectedTeamName');
    if (savedTeamId && savedTeamName) {
      setSelectedTeam({ _id: savedTeamId, name: savedTeamName });
    }
  }, []);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    localStorage.setItem('selectedTeamId', team._id);
    localStorage.setItem('selectedTeamName', team.name);
  };

  const handleContinue = () => {
    if (selectedTeam) navigate('/map');
  };

  return (
    /* Nền bên ngoài trên desktop giữ màu trắng / neutral (#F5FAF6) */
    <div className="min-h-screen w-full bg-[#F5FAF6] flex justify-center items-start sm:items-center">
      {/* 
        Khung ở giữa:
        - Rộng hơn: max-w-2xl (hoặc max-w-[680px])
        - Nền là ảnh poster 7892166... co giãn tự động theo kích thước màn hình
        - Trên mobile: co giãn tự động 100%, chữ & nút thu nhỏ đồng bộ
      */}
      <div
        className="w-full max-w-2xl min-h-screen sm:min-h-[92vh] relative flex flex-col justify-between px-3.5 sm:px-8 py-5 sm:py-8 bg-cover bg-center bg-no-repeat shadow-sm transition-all duration-300"
        style={{
          backgroundImage: `url('${POSTER_BG}')`,
        }}
      >
        {/* Lớp phủ mờ hơn một chút (dịu mắt, làm mờ ảnh nền nhẹ nhàng) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(245,250,246,0.72) 0%, rgba(245,250,246,0.62) 50%, rgba(245,250,246,0.78) 100%)',
          }}
        />

        {/* Nội dung bên trong khung - co giãn kích thước theo màn hình */}
        <div className="relative z-10 flex flex-col justify-between flex-1 h-full">
          {/* Header */}
          <header className="text-center mb-3 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#236640] text-[#F5FAF6] text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 shadow-[0_4px_16px_rgba(35,102,64,0.30)]">
              <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span>SEASON 8 – 2026</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl text-[#236640] leading-tight mb-0.5 sm:mb-1 drop-shadow-sm font-black">
              Cuộc Đua Kỳ Thú
            </h1>
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[rgba(15,43,26,0.65)] uppercase mb-3 sm:mb-5">
              The Amazing Race – Season 8
            </p>

            <div className="bg-[#236640] text-[#F5FAF6] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_6px_24px_rgba(35,102,64,0.30)] mb-1">
              <h2 className="text-sm sm:text-xl font-black tracking-wide uppercase">
                NỘP MINH CHỨNG CHECK IN
              </h2>
            </div>
          </header>

          <p className="text-center font-black text-[#0F2B1A] text-xs sm:text-base tracking-widest mb-2 sm:mb-4 uppercase drop-shadow-sm">
            HÃY CHỌN TEAM CỦA BẠN
          </p>

          {/* Grid danh sách 10 Teams - tự co giãn theo điện thoại */}
          <div className="flex-1 my-1 sm:my-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 py-10 sm:py-16">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#236640] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#0F2B1A] font-semibold text-xs sm:text-sm">Đang tải danh sách team...</p>
              </div>
            ) : error ? (
              <div className="bg-white/90 border border-red-300 rounded-2xl p-4 sm:p-6 text-center shadow-md">
                <p className="text-red-700 font-bold text-xs sm:text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs sm:text-sm underline text-[#236640] font-bold"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-4">
                {teams.map((team) => (
                  <TeamButton
                    key={team._id}
                    team={team}
                    isSelected={selectedTeam?._id === team._id}
                    onClick={handleSelectTeam}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Nút tiếp tục */}
          <div className="sticky bottom-3 sm:bottom-4 mt-2 sm:mt-4">
            <button
              id="btn-continue"
              onClick={handleContinue}
              disabled={!selectedTeam}
              className={`
                w-full py-3 sm:py-4 rounded-full font-black text-sm sm:text-base tracking-wide transition-all duration-200
                ${selectedTeam
                  ? 'bg-[#236640] text-[#F5FAF6] shadow-[0_6px_24px_rgba(35,102,64,0.40)] hover:bg-[#1A4D30] hover:scale-[1.01] active:scale-100'
                  : 'bg-[rgba(35,102,64,0.18)] text-[rgba(35,102,64,0.45)] cursor-not-allowed'
                }
              `}
            >
              {selectedTeam ? `${selectedTeam.name} — Tiếp tục →` : 'Chọn team để tiếp tục'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTeamPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamButton from '../../components/player/TeamButton';
import { useTeams } from '../../context/TeamContext';

const POSTER_BG = encodeURI('/NỀN MÀN 1.png');

const SelectTeamPage = () => {
  const navigate = useNavigate();
  const { teams, teamsLoading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
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
        className="w-full max-w-2xl min-h-screen sm:min-h-[92vh] relative flex flex-col px-3.5 sm:px-8 pb-6 bg-cover bg-center bg-no-repeat shadow-sm transition-all duration-300"
        style={{
          backgroundImage: `url('${POSTER_BG}')`,
        }}
      >

        {/* Toàn bộ nội dung đẩy lên gần chạm biển gỗ READY? và không che cờ Chợ Bến Thành */}
        <div className="relative z-10 flex flex-col items-center gap-0" style={{ marginTop: '14%' }}>

          {/* Tiêu đề RẤT nhỏ — chỉ để nhận diện, không cạnh tranh với banner */}
          <h1 className="font-body font-semibold text-[11px] sm:text-xs text-[#144728]/80 tracking-[0.25em] uppercase text-center">
            CUỘC ĐUA KỲ THÚ 2026
          </h1>

          {/* Banner vệt sơn — to rõ, căn giữa, là điểm nhấn chính */}
          <div className="pb-4 sm:pb-5">
            <img
              src="/banner_checkin.png"
              alt="Nộp Minh Chứng Check In"
              className="w-full max-w-[280px] sm:max-w-[360px] h-auto drop-shadow-[0_4px_16px_rgba(35,102,64,0.30)] select-none pointer-events-none"
            />
          </div>

          {/* Grid 10 Team */}
          <div className="w-full">
            {teamsLoading ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-12 sm:h-14 rounded-2xl bg-[#236640]/10 animate-pulse" />
                ))}
              </div>
            ) : teams.length === 0 ? (
              <div className="bg-white/90 border border-red-300 rounded-2xl p-4 text-center shadow-md">
                <p className="text-red-700 font-bold text-xs sm:text-sm">Không thể tải danh sách team. Vui lòng thử lại!</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-xs underline text-[#236640] font-bold">Thử lại</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
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

          {/* Nút TIẾP THEO — cách team một khoảng hợp lý */}
          <div className="flex justify-center pt-4 sm:pt-5">
            <button
              id="btn-continue"
              onClick={handleContinue}
              disabled={!selectedTeam}
              className={`
                min-w-[180px] sm:min-w-[210px] px-8 py-2.5 sm:py-3 rounded-full font-black text-sm tracking-wider transition-all duration-200 shadow-md
                ${selectedTeam
                  ? 'bg-[#154c2e] text-white shadow-[0_4px_16px_rgba(21,76,46,0.35)] hover:bg-[#0f3822] hover:scale-105 active:scale-95'
                  : 'bg-[rgba(35,102,64,0.18)] text-[rgba(35,102,64,0.45)] cursor-not-allowed'
                }
              `}
            >
              {selectedTeam ? 'TIẾP THEO' : 'Chọn team'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectTeamPage;

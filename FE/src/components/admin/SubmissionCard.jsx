const SubmissionCard = ({ submission }) => {
  const { team, location, imageUrl, submittedAt } = submission;

  const fullImageUrl = imageUrl;

  const formatTime = (date) => {
    try {
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    } catch {
      return date;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      {/* Image container */}
      <a
        href={fullImageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-[4/3] bg-gray-100 overflow-hidden relative"
      >
        <img
          src={fullImageUrl}
          alt={`Minh chứng ${team?.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.opacity = '0.25';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
            Xem ảnh gốc
          </span>
        </div>
      </a>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="bg-[#236640] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {team?.name || 'Chưa rõ team'}
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-300/60 text-[11px] font-semibold px-2 py-0.5 rounded-md">
              Điểm {location?.index}
            </span>
          </div>

          <h4 className="text-xs font-bold text-gray-900 truncate mb-1" title={location?.title}>
            {location?.title || `Điểm ${location?.index}`}
          </h4>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center text-[11px] text-gray-500 font-medium">
          <svg className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="truncate">{formatTime(submittedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;

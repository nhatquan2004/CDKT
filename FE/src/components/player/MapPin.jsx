const MapPin = ({ location, isCompleted, isSelected, onClick }) => {
  return (
    <button
      id={`map-pin-${location.index}`}
      onClick={() => onClick(location)}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      title={location.title || `Điểm ${location.index}`}
    >
      {/* Vòng glow xung quanh pin */}
      {!isCompleted && (
        <span
          className="absolute inset-0 rounded-full map-pin-glow"
          style={{ background: 'rgba(200,169,81,0.35)', margin: '-6px' }}
        />
      )}

      {/* Pin chính */}
      <span
        className={`
          relative flex items-center justify-center
          w-10 h-10 rounded-full font-black text-sm
          border-2 border-[#F5FAF6]
          shadow-[0_4px_16px_rgba(0,0,0,0.25)]
          transition-all duration-200
          ${isCompleted
            ? 'bg-[#236640] text-white'
            : isSelected
              ? 'bg-[#1A4D30] text-white scale-125'
              : 'bg-[#C8A951] text-[#0F2B1A] map-pin-active'
          }
        `}
      >
        {isCompleted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : location.index}
      </span>

      {/* Label hover */}
      <span className="
        absolute bottom-full mb-2 left-1/2 -translate-x-1/2
        px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap
        bg-[#0F2B1A] text-[#F5FAF6]
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none shadow-lg
      ">
        {location.title || `Điểm ${location.index}`}
      </span>
    </button>
  );
};

export default MapPin;

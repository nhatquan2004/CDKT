const TeamButton = ({ team, isSelected, onClick }) => {
  return (
    <button
      id={`team-btn-${team.code}`}
      onClick={() => onClick(team)}
      className={`
        team-btn relative w-full py-2.5 sm:py-3.5 md:py-4 px-2 sm:px-3 rounded-xl sm:rounded-2xl
        font-black text-xs sm:text-sm md:text-base tracking-wide
        transition-all duration-200 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#236640]
        ${isSelected
          ? 'bg-[#236640] text-[#F5FAF6] shadow-[0_6px_20px_rgba(35,102,64,0.40)] scale-[1.03] border-2 border-[#C8A951]'
          : 'bg-[#F5FAF6]/95 text-[#236640] border-2 border-[rgba(35,102,64,0.25)] hover:border-[#236640] hover:bg-white hover:scale-[1.02] shadow-sm backdrop-blur-sm'
        }
      `}
    >
      <span
        className={`
          absolute top-1 sm:top-1.5 right-1.5 sm:right-2 text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center
          ${isSelected ? 'bg-[rgba(245,250,246,0.25)] text-[#F5FAF6]' : 'bg-[rgba(35,102,64,0.12)] text-[#236640]'}
        `}
      >
        {team.name.split(' ')[1]}
      </span>
      <span className="block">{team.name}</span>
    </button>
  );
};

export default TeamButton;

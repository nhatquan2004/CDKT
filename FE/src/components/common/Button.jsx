const Button = ({
  children, onClick, type = 'button',
  variant = 'primary', disabled = false, loading = false, className = '', ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full px-6 py-3 transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary: `bg-[#236640] text-[#F5FAF6] shadow-[0_4px_16px_rgba(35,102,64,0.30)]
              hover:bg-[#1A4D30] hover:scale-105 active:scale-100
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              focus-visible:ring-[#236640]`,
    outline: `bg-[rgba(35,102,64,0.08)] border-2 border-[#236640] text-[#236640]
              hover:bg-[rgba(35,102,64,0.15)] hover:scale-105 active:scale-100
              disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-[#236640]`,
    ghost: `text-[#236640] hover:bg-[rgba(35,102,64,0.08)] rounded-xl px-4 py-2
            disabled:opacity-50 disabled:cursor-not-allowed`,
  };

  return (
    <button
      type={type} onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : children}
    </button>
  );
};

export default Button;

const Input = ({ label, id, type = 'text', placeholder = '', value, onChange, required = false, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-[#236640]">
          {label}
          {required && <span className="text-[#C8A951] ml-1">*</span>}
        </label>
      )}
      <input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required={required}
        className="
          w-full px-4 py-3 rounded-xl
          bg-[#F5FAF6] text-[#0F2B1A]
          border-2 border-[rgba(35,102,64,0.25)]
          placeholder-[rgba(15,43,26,0.35)]
          focus:outline-none focus:border-[#236640] focus:ring-2 focus:ring-[rgba(35,102,64,0.15)]
          transition-all duration-200 font-medium
        "
        {...props}
      />
    </div>
  );
};

export default Input;

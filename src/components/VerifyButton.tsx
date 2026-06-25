interface Props {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export default function VerifyButton({ onClick, disabled, isLoading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center h-[42px] px-8 rounded-full font-sans font-semibold text-[13px] uppercase tracking-[0.2em]
        transition-all duration-500 relative overflow-hidden group shadow-[0_4px_16px_var(--glass-shadow)] backdrop-blur-md
        ${disabled || isLoading 
           ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-primary/30 cursor-not-allowed' 
           : 'bg-gradient-to-r from-[var(--mesh-c2)] to-[var(--mesh-c3)] text-white border border-white/20 hover:scale-105 hover:shadow-[0_0_20px_var(--mesh-c2)] active:scale-95'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Checking</span>
        </span>
      ) : (
        <span className="relative z-10 font-bold uppercase tracking-widest text-[11px]">
          Check Pulse
        </span>
      )}
    </button>
  )
}

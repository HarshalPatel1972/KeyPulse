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
        flex items-center justify-center h-[42px] px-8 rounded-full font-sans font-bold text-[14px] uppercase tracking-widest
        transition-all duration-150 relative overflow-hidden group
        ${disabled || isLoading 
           ? 'bg-primary/20 text-primary/30 border-b-4 border-border-primary cursor-not-allowed' 
           : 'bg-accent text-white border-b-4 border-accent-shadow hover:bg-[#40C4FF] active:border-b-0 active:translate-y-1 active:mt-1'
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

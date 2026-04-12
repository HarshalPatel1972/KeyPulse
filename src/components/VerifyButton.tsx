interface Props {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
  activeTheme?: string
}

export default function VerifyButton({ onClick, disabled, isLoading, activeTheme }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-4 rounded-none font-heading font-bold text-[15px] tracking-[0.05em] uppercase
        transition-all duration-300 relative overflow-hidden group active-scale
        ${disabled || isLoading 
          ? 'bg-black/[0.04] text-black/20' 
          : 'cursor-pointer hover:bg-black/5 active:scale-[0.98] text-white'
        }
      `}
      style={{
        background: !disabled && !isLoading 
          ? 'linear-gradient(135deg, var(--accent-btn-from), var(--accent-btn-to), var(--accent-btn-from))' 
          : undefined,
        backgroundSize: '200% auto',
      }}
    >
      {!disabled && !isLoading && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full"></div>
      )}
      
      {isLoading ? (
        <span className="flex items-center justify-center gap-3 text-black/40">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-10"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-black/10 border-t-black/40 animate-spin"></span>
          </span>
          <span className="animate-pulse">Checking Pulse...</span>
        </span>
      ) : (
        <span className="relative z-10">
          Check pulse
        </span>
      )}
    </button>
  )
}

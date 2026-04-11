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
        w-full mt-6 py-4 rounded-2xl font-heading font-bold text-[15px] tracking-[0.05em] uppercase
        transition-all duration-300 relative overflow-hidden group
        ${disabled || isLoading 
          ? 'bg-white/[0.04] text-white/20 border border-white/5 cursor-not-allowed' 
          : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(124,58,237,0.1)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]'
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
        <span className="flex items-center justify-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white/20 border-t-white animate-spin"></span>
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

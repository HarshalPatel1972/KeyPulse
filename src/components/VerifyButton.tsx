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
        w-full py-4 rounded-2xl font-heading font-medium text-[16px] tracking-wide
        transition-all duration-500 relative overflow-hidden group active-scale
        ${disabled || isLoading 
          ? 'bg-white/10 text-white/30' 
          : 'bg-[#F6F4E8] text-[#DC9B9B] hover:scale-[1.02] shadow-2xl hover:shadow-[#F6F4E8]/20'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-[#DC9B9B]/20 border-t-[#DC9B9B] animate-spin"></span>
          </span>
          <span className="animate-pulse">Placing...</span>
        </span>
      ) : (
        <span className="relative z-10">
          Check pulse
        </span>
      )}
    </button>
  )
}

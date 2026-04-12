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
        transition-all duration-500 relative overflow-hidden group active-scale shadow-[0_5px_15px_rgba(66,72,116,0.08)] hover:shadow-[0_10px_25px_rgba(66,72,116,0.15)]
        ${disabled || isLoading 
          ? 'bg-primary/5 text-primary/20' 
          : 'bg-indigo-deep dark:bg-periwinkle text-lavender dark:text-indigo-deep hover:bg-blue-soft hover:text-indigo-deep hover:scale-[1.02] active:scale-[0.98]'
        }
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-black/10 border-t-black/40 animate-spin"></span>
          </span>
          <span className="animate-pulse">Checking...</span>
        </span>
      ) : (
        <span className="relative z-10 font-bold uppercase tracking-widest text-[14px]">
          Check pulse
        </span>
      )}
    </button>
  )
}

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
      className="w-full mt-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-150
        bg-primary text-base hover:bg-primary/90 active:scale-[0.99]
        disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-base/30 border-t-base rounded-full animate-spin" />
          Checking...
        </span>
      ) : (
        'Check pulse'
      )}
    </button>
  )
}

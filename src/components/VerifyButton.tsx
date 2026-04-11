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
      className="w-full mt-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.99]"
      style={{
        background: disabled || isLoading
          ? 'var(--bg-elevated)'
          : 'linear-gradient(135deg, var(--accent-btn-from), var(--accent-btn-to))',
        color: disabled || isLoading ? 'var(--text-hint)' : '#ffffff',
        border: `1px solid ${disabled || isLoading ? 'var(--border)' : 'transparent'}`,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.02em',
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }}
          />
          Checking...
        </span>
      ) : (
        'Check pulse'
      )}
    </button>
  )
}

interface Props {
  disabled: boolean
  isLoading: boolean
}

export default function VerifyButton({ disabled, isLoading }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="btn-pulse h-12 w-full px-7 font-sans text-[15px] tracking-tight sm:w-auto sm:min-w-44"
    >
      <span className="btn-fill" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {isLoading ? 'Listening' : 'Check pulse'}
        {isLoading && <span className="caret inline-block h-2 w-2 bg-current" />}
      </span>
    </button>
  )
}

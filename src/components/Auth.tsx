export function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
}: {
  actionText: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  status: 'pending' | 'idle' | 'success' | 'error'
  afterSubmit?: React.ReactNode
}) {
  return (
    <div>
      <div>
        <h1>{actionText}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(e)
          }}
        >
          <div>
            <label htmlFor="email">
              Username
            </label>
            <input
              type="email"
              name="email"
              id="email"
            />
          </div>
          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? '...' : actionText}
          </button>
          {afterSubmit ? afterSubmit : null}
        </form>
      </div>
    </div>
  )
}

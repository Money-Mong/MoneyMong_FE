import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useGoogleCallback } from '@/hooks/useAuth'

export const Route = createFileRoute('/auth/callback')({
  component: CallbackComponent,
})

function CallbackComponent() {
  const navigate = useNavigate()
  const { mutate: googleCallback, isPending, isError, error } = useGoogleCallback()

  useEffect(() => {
    // URL에서 code 파라미터 추출
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      // Google OAuth 콜백 처리
      googleCallback(
        {
          code,
          redirect_uri: window.location.origin + '/auth/callback',
        },
        {
          onSuccess: () => {
            // useGoogleCallback의 onSuccess에서 이미 홈으로 리다이렉트됨
            // 여기서는 추가 처리 불필요
          },
          onError: (err) => {
            console.error('Login failed:', err)
            // 에러 발생 시 3초 후 홈으로 이동
            setTimeout(() => {
              navigate({ to: '/' })
            }, 3000)
          },
        }
      )
    } else {
      // code가 없으면 에러
      console.error('No authorization code found')
      setTimeout(() => {
        navigate({ to: '/' })
      }, 2000)
    }
  }, [googleCallback, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {isPending ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing login...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </>
        ) : isError ? (
          <>
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Login failed</p>
            <p className="text-gray-500 text-sm mt-2">
              {error?.message || 'An error occurred'}
            </p>
            <p className="text-gray-400 text-xs mt-2">Redirecting to home...</p>
          </>
        ) : null}
      </div>
    </div>
  )
}

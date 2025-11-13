import { useMe, useLogout } from '@/hooks/useAuth'

export function Header() {
  const { data: user, isLoading } = useMe()
  const { mutate: logout } = useLogout()

  const handleLogin = () => {
    // Google OAuth 로그인 시작
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    window.location.href = `${API_BASE_URL}/api/v1/auth/google/login`
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">💰 MoneyMong</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

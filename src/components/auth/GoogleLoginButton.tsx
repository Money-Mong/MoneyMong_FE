/**
 * Google 로그인 버튼 컴포넌트
 *
 * Google OAuth 인증 플로우를 시작하는 버튼
 * 클릭 시 백엔드 OAuth URL로 리다이렉트
 */

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // TODO: 환경변수에서 백엔드 URL 가져오기
    // VITE_API_BASE_URL 사용 권장
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

    // Google OAuth 인증 URL로 리다이렉트
    // 백엔드에서 Google로 리다이렉트 후 /callback으로 돌아옴
    window.location.href = `${backendUrl}/api/v1/auth/google/login`
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
    >
      {/* TODO: Google 로고 SVG 추가 (선택사항)
       * Google Fonts Material Icons 또는 직접 SVG 삽입
       * 예: <GoogleIcon />
       */}
      <span className="text-gray-700 font-medium">Google로 로그인</span>
    </button>
  )
}

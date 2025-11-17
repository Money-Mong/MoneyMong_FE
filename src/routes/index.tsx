import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { ReportGallery } from '@/components/document/ReportGallery'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { data: user, isLoading } = useMe()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">MoneyMong</h1>
          <p className="text-lg text-gray-600">AI 기반 금융 리포트 요약 및 대화 플랫폼</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            시작하기
          </h2>
          <GoogleLoginButton />
        </div>
      </div>
    )
  }

  // 로그인한 경우 문서 목록 표시
  return (
    <div className="p-8">
      <ReportGallery />
    </div>
  )
}

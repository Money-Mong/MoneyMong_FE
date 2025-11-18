/**
 * Header - 상단 네비게이션 바
 *
 * Linear 스타일 적용:
 * - 미니멀한 디자인
 * - 절제된 색상
 */

import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useMe, useLogout } from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { data: user } = useMe()
  const { mutate: logout } = useLogout({
    onSuccess: () => {
      toast.success('로그아웃되었습니다')
    },
    onError: () => {
      toast.error('로그아웃 중 오류가 발생했습니다')
    },
  })

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">MoneyMong</h1>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Beta
            </span>
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-slate-700 font-medium">{user.username}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

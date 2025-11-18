/**
 * Root Layout - 전체 애플리케이션 레이아웃
 *
 * 구조:
 * - Header (상단 고정)
 * - Sidebar (햄버거 메뉴로 토글) + Main Content
 */

import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { useMe } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Menu, X } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { data: user } = useMe()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors closeButton />

      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Hamburger Menu Button (모바일만) */}
        {user && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed left-4 bottom-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center md:hidden"
            aria-label="메뉴 열기"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}

        {/* Overlay (모바일에서 사이드바 열렸을 때, Header 아래에만) */}
        {user && isSidebarOpen && (
          <div
            className="fixed inset-0 top-[65px] bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {user && (
          <div
            className={`
              fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{ top: '65px' }} // Header 높이만큼 아래에서 시작
          >
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

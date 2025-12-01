/**
 * PdfViewer Component
 *
 * `react-pdf`를 사용하여 PDF 파일을 렌더링하는 컴포넌트입니다.
 * 페이지 네비게이션, 로딩 및 오류 상태를 처리합니다.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MoveHorizontal, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

// 사용자님이 public 폴더에 수동으로 복사한 워커 파일을 직접 참조합니다.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * 임시: s3:// URI를 https:// 객체 URL로 변환합니다.
 * DB에 s3:// 주소로 저장되어 있을 경우 클라이언트에서 변환하기 위함입니다.
 * @param s3Uri s3:// 로 시작하는 S3 URI
 * @param region AWS S3 리전 (고정값)
 * @returns 변환된 https:// 객체 URL 또는 원본 s3Uri
 */
function convertS3UriToHttpsUrl(s3Uri: string, region: string): string {
  if (!s3Uri.startsWith('s3://')) {
    return s3Uri // s3:// 형식이 아니면 그대로 반환
  }

  const parts = s3Uri.substring(5).split('/') // "s3://" 제거 후 '/'로 분리
  const bucketName = parts[0]
  const key = parts.slice(1).join('/') // 나머지 부분을 key로 사용

  // 버킷 이름과 키가 유효한지 간단히 확인
  if (!bucketName || !key) {
    console.warn('유효하지 않은 S3 URI 형식입니다:', s3Uri)
    return s3Uri
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
}


interface PdfViewerProps {
  fileUrl: string
}

type ViewMode = 'fit-page' | 'fit-width' | 'manual'

export function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('fit-page')
  const [scale, setScale] = useState(1.0)

  // Container dimensions (only for calculation, not re-render trigger)
  const containerRef = useRef<HTMLDivElement>(null)
  const containerDimensions = useRef({ width: 800, height: 600 })

  // Original PDF page dimensions (set once per page)
  const [pageWidth, setPageWidth] = useState<number>(0)

  // 임시 변환 함수 호출 (리전은 ap-northeast-2로 고정)
  const displayFileUrl = convertS3UriToHttpsUrl(fileUrl, 'ap-northeast-2')

  // Update container dimensions without triggering re-render
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        containerDimensions.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        }
      }
    }

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)
    updateDimensions() // Initial measurement

    return () => observer.disconnect()
  }, [])

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages)
    setPageNumber(1)
  }

  // Called when a page is successfully loaded
  const onPageLoadSuccess = useCallback((page: PDFPageProxy) => {
    const viewport = page.getViewport({ scale: 1.0 })
    setPageWidth(viewport.width)
  }, [])

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  function goToNextPage() {
    if (numPages) {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages))
    }
  }

  // Zoom Handlers
  const handleZoomIn = () => {
    setViewMode('manual')
    setScale(prev => Math.min(prev + 0.25, 3.0))
  }

  const handleZoomOut = () => {
    setViewMode('manual')
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleFitPage = () => {
    setViewMode('fit-page')
    setScale(1.0)
  }

  const handleFitWidth = () => {
    setViewMode('fit-width')
    setScale(1.0)
  }

  // Calculate scale for rendering
  const getCalculatedScale = (): number => {
    if (viewMode === 'manual') {
      return scale
    }

    if (!pageWidth || pageWidth === 0) {
      return 1.0 // Default until page loads
    }

    const container = containerDimensions.current
    const padding = 48 // Total padding: p-4 (16px * 2) + scrollbar space

    if (viewMode === 'fit-width') {
      return (container.width - padding) / pageWidth
    }

    if (viewMode === 'fit-page') {
      const paddingVertical = 48
      return Math.min(
        (container.width - padding) / pageWidth,
        (container.height - paddingVertical) / (pageWidth * 1.414) // A4 비율 근사치
      )
    }

    return 1.0
  }

  const calculatedScale = getCalculatedScale()

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>
  )

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-full p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
      <p>오류: {message}</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Toolbar - Fixed at top */}
      <div className="flex-shrink-0 flex items-center justify-between p-2 bg-white border-b border-slate-200 shadow-sm">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
            title="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-600 min-w-[3rem] text-center">
            {pageNumber} / {numPages || '-'}
          </span>
          <button
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
            title="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-2">
          <button
            onClick={handleFitPage}
            className={clsx(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'fit-page' ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-100"
            )}
            title="페이지 맞춤"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitWidth}
            className={clsx(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'fit-width' ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-100"
            )}
            title="너비 맞춤"
          >
            <MoveHorizontal className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            title="축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-600 min-w-[3rem] text-center">
            {viewMode === 'manual' ? `${Math.round(scale * 100)}%` : viewMode === 'fit-page' ? 'Fit' : 'Width'}
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            title="확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className="flex-1 overflow-auto bg-slate-100" ref={containerRef}>
        <div className={clsx(
          "p-4",
          viewMode === 'fit-page' ? "min-h-full flex items-center justify-center" : "flex justify-start"
        )}>
          <div className="mx-auto">
            <Document
              file={displayFileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<LoadingSpinner />}
              error={<ErrorMessage message="PDF 파일을 불러올 수 없습니다." />}
              onLoadError={(error) => console.error('PDF 로딩 오류:', error)}
            >
              <Page
                pageNumber={pageNumber}
                scale={calculatedScale}
                onLoadSuccess={onPageLoadSuccess}
                className="shadow-lg"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * PdfViewer Component
 *
 * `react-pdf`를 사용하여 PDF 파일을 렌더링하는 컴포넌트입니다.
 * 페이지 네비게이션, 로딩 및 오류 상태를 처리합니다.
 */
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { PDFDocumentProxy } from 'pdfjs-dist'

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

export function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  // 임시 변환 함수 호출 (리전은 ap-northeast-2로 고정)
  const displayFileUrl = convertS3UriToHttpsUrl(fileUrl, 'ap-northeast-2')


  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages)
    setPageNumber(1) // 새 문서가 로드되면 1페이지로 리셋
  }

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  function goToNextPage() {
    if (numPages) {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages))
    }
  }

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
      {/* PDF Document */}
      <div className="flex-1 overflow-y-auto">
        <Document
          file={displayFileUrl} // 변환된 URL 사용
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LoadingSpinner />}
          error={<ErrorMessage message="PDF 파일을 불러올 수 없습니다." />}
          onLoadError={(error) => console.error('PDF 로딩 오류:', error)}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>

      {/* Pagination Controls */}
      {numPages && (
        <div className="flex items-center justify-center p-2 bg-slate-100 border-t border-slate-200">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
          >
            이전
          </button>
          <p className="mx-4 text-sm text-slate-800">
            {pageNumber} / {numPages}
          </p>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

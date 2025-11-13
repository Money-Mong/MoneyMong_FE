import { createFileRoute } from '@tanstack/react-router'
import { useDocuments } from '@/hooks/useDocuments'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { data: documents, isLoading, error } = useDocuments()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading documents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MoneyMong - Documents</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc) => (
          <div
            key={doc.id}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
            <p className="text-sm text-gray-600 mb-2">by {doc.author}</p>
            <p className="text-xs text-gray-500">{doc.published_date}</p>
            <div className="mt-4">
              <span
                className={`inline-block px-2 py-1 text-xs rounded ${
                  doc.importance === 'high'
                    ? 'bg-red-100 text-red-800'
                    : doc.importance === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {doc.importance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

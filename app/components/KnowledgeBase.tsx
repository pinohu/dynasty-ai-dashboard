import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/Card';
import { useKnowledgeBase } from '@/hooks/useAPI';

export const KnowledgeBase: React.FC = () => {
  const { data: kb, isLoading, error } = useKnowledgeBase();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="h-10 animate-pulse"></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="h-64 animate-pulse"></Card>
          <Card className="md:col-span-2 h-64 animate-pulse"></Card>
        </div>
      </div>
    );
  }

  if (error || !kb) {
    return (
      <Card variant="outlined" className="border-red-300">
        <div className="text-red-600 dark:text-red-400">
          ⚠️ Failed to load knowledge base
        </div>
      </Card>
    );
  }

  const docs = kb.docs || [];
  const filteredDocs = docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDocData = selectedDoc
    ? docs.find((d) => d.id === selectedDoc) || null
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Knowledge Base
      </h1>

      {/* Memory Section */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Memory
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last Updated: {new Date(kb.memory.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-96">
            <ReactMarkdown
              className="prose dark:prose-invert max-w-none text-sm"
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-2" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs"
                    {...props}
                  />
                ),
              }}
            >
              {kb.memory.content}
            </ReactMarkdown>
          </div>
        </div>
      </Card>

      {/* Documentation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documentation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar: Categories & Search */}
          <div className="space-y-4">
            {/* Search */}
            <Card>
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Card>

            {/* Document List */}
            <Card variant="elevated" className="p-0 max-h-96 overflow-y-auto">
              {filteredDocs.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No documents found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocs.map((doc) => (
                    <li key={doc.id}>
                      <button
                        onClick={() => setSelectedDoc(doc.id)}
                        className={`w-full text-left px-6 py-4 transition-colors ${
                          selectedDocData?.id === doc.id
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {doc.category}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Stats */}
            <Card>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Total Docs
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {docs.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Categories
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {new Set(docs.map((d) => d.category)).size}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            {selectedDocData ? (
              <Card variant="elevated">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDocData.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Category: <span className="font-mono">{selectedDocData.category}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-y-auto max-h-96">
                    <ReactMarkdown
                      className="prose dark:prose-invert max-w-none"
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-inside mb-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-inside mb-2" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {selectedDocData.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </Card>
            ) : (
              <Card variant="outlined" className="h-96 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a document to view its content
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import { OpenAPISpec } from '@/types/openapi';
import { Globe, Mail, ExternalLink } from 'lucide-react';

interface OverviewViewProps {
  spec: OpenAPISpec;
}

export function OverviewView({ spec }: OverviewViewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{spec.info.title}</h1>
          <p className="text-xl text-slate-600">Version {spec.info.version}</p>
        </div>

        {spec.info.description && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{spec.info.description}</p>
          </div>
        )}

        {spec.info.contact && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              {spec.info.contact.name && (
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-semibold">Name:</span>
                  <span>{spec.info.contact.name}</span>
                </div>
              )}
              {spec.info.contact.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${spec.info.contact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {spec.info.contact.email}
                  </a>
                </div>
              )}
              {spec.info.contact.url && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Globe className="w-4 h-4" />
                  <a
                    href={spec.info.contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {spec.info.contact.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {spec.servers && spec.servers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Servers</h2>
            <div className="space-y-4">
              {spec.servers.map((server, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="font-mono text-sm text-blue-600 mb-2">{server.url}</div>
                  {server.description && (
                    <p className="text-sm text-slate-600">{server.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {spec.tags && spec.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.tags.map((tag) => (
                <div
                  key={tag.name}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 mb-1">{tag.name}</h3>
                  {tag.description && (
                    <p className="text-sm text-slate-600">{tag.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-2">Getting Started</h2>
          <p className="text-blue-800 text-sm">
            Use the sidebar navigation to explore available endpoints, schemas, and security configurations.
            Each section provides detailed documentation including parameters, request/response examples, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

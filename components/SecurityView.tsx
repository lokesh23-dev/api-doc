'use client';

import { SecurityScheme } from '@/types/openapi';
import { Shield, Key, Lock } from 'lucide-react';

interface SecurityViewProps {
  name: string;
  scheme: SecurityScheme;
}

export function SecurityView({ name, scheme }: SecurityViewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
          </div>
          {scheme.description && (
            <p className="text-lg text-slate-600 leading-relaxed">{scheme.description}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Configuration</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-700">Type</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
                    {scheme.type}
                  </span>
                </div>
              </div>
            </div>

            {scheme.scheme && (
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-700">Scheme</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-mono">
                      {scheme.scheme}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {scheme.bearerFormat && (
              <div className="border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-700">Bearer Format</span>
                <p className="mt-1 text-sm text-slate-600 font-mono">{scheme.bearerFormat}</p>
              </div>
            )}

            {scheme.name && (
              <div className="border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-700">Parameter Name</span>
                <p className="mt-1 text-sm text-slate-600 font-mono">{scheme.name}</p>
              </div>
            )}

            {scheme.in && (
              <div className="border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-700">Location</span>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm">
                    {scheme.in}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {scheme.flows && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">OAuth2 Flows</h2>
            <div className="space-y-6">
              {Object.entries(scheme.flows).map(([flowName, flow]) => (
                <div key={flowName} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 capitalize">
                    {flowName}
                  </h3>
                  <div className="space-y-3 text-sm">
                    {flow.authorizationUrl && (
                      <div>
                        <span className="font-semibold text-slate-700">Authorization URL: </span>
                        <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {flow.authorizationUrl}
                        </code>
                      </div>
                    )}
                    {flow.tokenUrl && (
                      <div>
                        <span className="font-semibold text-slate-700">Token URL: </span>
                        <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {flow.tokenUrl}
                        </code>
                      </div>
                    )}
                    {flow.refreshUrl && (
                      <div>
                        <span className="font-semibold text-slate-700">Refresh URL: </span>
                        <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {flow.refreshUrl}
                        </code>
                      </div>
                    )}
                    {flow.scopes && Object.keys(flow.scopes).length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block mb-2">Scopes:</span>
                        <div className="space-y-2">
                          {Object.entries(flow.scopes).map(([scope, description]) => (
                            <div
                              key={scope}
                              className="bg-slate-50 px-3 py-2 rounded-md"
                            >
                              <code className="text-slate-900 font-semibold">{scope}</code>
                              <p className="text-slate-600 mt-1">{description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scheme.openIdConnectUrl && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">OpenID Connect</h2>
            <div>
              <span className="text-sm font-semibold text-slate-700">Discovery URL: </span>
              <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {scheme.openIdConnectUrl}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

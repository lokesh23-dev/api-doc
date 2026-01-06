'use client';

import { ParsedEndpoint, Parameter, SchemaObject } from '@/types/openapi';
import { Copy, Check, Play } from 'lucide-react';
import { useState } from 'react';

interface EndpointViewProps {
  endpoint: ParsedEndpoint;
}

const METHOD_STYLES: Record<string, string> = {
  get: 'bg-blue-100 text-blue-700 border-blue-200',
  post: 'bg-green-100 text-green-700 border-green-200',
  put: 'bg-orange-100 text-orange-700 border-orange-200',
  delete: 'bg-red-100 text-red-700 border-red-200',
  patch: 'bg-purple-100 text-purple-700 border-purple-200',
  options: 'bg-gray-100 text-gray-700 border-gray-200',
  head: 'bg-gray-100 text-gray-700 border-gray-200',
  trace: 'bg-gray-100 text-gray-700 border-gray-200',
};

type CodeLang = 'http' | 'curl' | 'js' | 'python';

/* ------------------ CodeBlock ------------------ */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-2 top-2 p-2 bg-slate-700 rounded opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
      </button>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ------------------ SchemaRenderer ------------------ */
function SchemaRenderer({ schema }: { schema: SchemaObject }) {
  if (schema.$ref) {
    return <span className="font-mono text-blue-600">{schema.$ref.split('/').pop()}</span>;
  }

  if (schema.type === 'object' && schema.properties) {
    return (
      <ul className="list-disc pl-5 text-sm">
        {Object.entries(schema.properties).map(([key, val]) => (
          <li key={key}>
            <span className="font-mono">{key}</span>: {val.type || 'object'}
          </li>
        ))}
      </ul>
    );
  }

  return <span className="font-mono">{schema.type || 'any'}</span>;
}

/* ------------------ MAIN COMPONENT ------------------ */
export function EndpointView({ endpoint }: EndpointViewProps) {
  const { method, path, operation } = endpoint;

  const params: Parameter[] = operation.parameters || [];
  const requestBodySchema = operation.requestBody?.content?.['application/json']?.schema;

  /* ------------------ Execute State ------------------ */
  const [token, setToken] = useState('');
  const [body, setBody] = useState(
    operation.requestBody?.content?.['application/json']?.example
      ? JSON.stringify(operation.requestBody.content['application/json'].example, null, 2)
      : '{}'
  );
  const [lang, setLang] = useState<CodeLang>('http');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

const API_HOST = process.env.PUBLIC_HOST || window.location.origin;

const fullUrl = `${API_HOST}${path}`;

  /* ------------------ Execute API ------------------ */
  const execute = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(fullUrl, {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: method !== 'get' ? body : undefined,
      });

      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (e: any) {
      setResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Code Snippets ------------------ */
  const snippets: Record<CodeLang, string> = {
    http: `${method.toUpperCase()} ${path} HTTP/1.1
Host: ${new URL(fullUrl).host}
Authorization: Bearer ${token || 'YOUR_TOKEN'}
Content-Type: application/json

${body}`,
    curl: `curl -X ${method.toUpperCase()} "${fullUrl}" \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`,
    js: `fetch("${fullUrl}", {
  method: "${method.toUpperCase()}",
  headers: {
    "Authorization": "Bearer ${token || 'YOUR_TOKEN'}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${body})
}).then(res => res.json()).then(console.log);`,
    python: `import requests

response = requests.${method}(
  "${fullUrl}",
  headers={"Authorization": "Bearer ${token || 'YOUR_TOKEN'}"},
  json=${body}
)
print(response.json())`,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8 space-y-8">

        {/* ---------- Header ---------- */}
        <div>
          <span className={`px-4 py-2 rounded border font-bold uppercase ${METHOD_STYLES[method]}`}>
            {method}
          </span>
          <h1 className="text-3xl font-bold mt-3">{path}</h1>
          {operation.summary && <p className="text-slate-600 mt-1">{operation.summary}</p>}
        </div>

        {/* ---------- Request Body ---------- */}
        {requestBodySchema && (
          <div className="bg-white p-6 border rounded">
            <h2 className="text-xl font-bold mb-3">Request Body</h2>
            <SchemaRenderer schema={requestBodySchema} />
            <textarea
              rows={6}
              className="w-full mt-3 p-3 border rounded font-mono text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        )}

        {/* ---------- TRY IT OUT (NEW ADDON) ---------- */}
        <div className="bg-white p-6 border rounded">
          <h2 className="text-xl font-bold mb-4">Try it out</h2>

          <input
            type="password"
            placeholder="Bearer token"
            className="w-full mb-4 p-2 border rounded"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          {/* Language Tabs */}
          <div className="flex gap-2 mb-3">
            {(['http', 'curl', 'js', 'python'] as CodeLang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded text-sm ${
                  lang === l ? 'bg-blue-600 text-white' : 'bg-slate-100'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <CodeBlock code={snippets[lang]} />

          <button
            onClick={execute}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Play size={16} />
            {loading ? 'Executing…' : 'Test it'}
          </button>

          {response && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Response</h3>
              <CodeBlock code={JSON.stringify(response, null, 2)} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

'use client';

import { SchemaObject } from '@/types/openapi';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SchemaViewProps {
  name: string;
  schema: SchemaObject;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-300" />
        )}
      </button>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderSchemaProperties(schema: SchemaObject): JSX.Element | null {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return (
      <div className="text-blue-600 font-mono text-sm bg-blue-50 px-3 py-2 rounded-md">
        Reference: {refName}
      </div>
    );
  }

  if (schema.type === 'object' && schema.properties) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Property</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Required</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Object.entries(schema.properties).map(([propName, propSchema]) => (
              <tr key={propName} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-sm text-slate-900 font-medium">
                  {propName}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-700 w-fit">
                      {propSchema.$ref ? propSchema.$ref.split('/').pop() : propSchema.type || 'any'}
                      {propSchema.format && ` (${propSchema.format})`}
                    </span>
                    {propSchema.enum && (
                      <span className="text-xs text-slate-500">
                        Enum: {propSchema.enum.join(', ')}
                      </span>
                    )}
                    {propSchema.type === 'array' && propSchema.items && (
                      <span className="text-xs text-slate-500">
                        Array of {propSchema.items.$ref ? propSchema.items.$ref.split('/').pop() : propSchema.items.type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {schema.required?.includes(propName) && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      Required
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {propSchema.description || '-'}
                  {propSchema.default !== undefined && (
                    <div className="mt-1 text-xs text-slate-500">
                      Default: <code className="bg-slate-100 px-1 py-0.5 rounded">{JSON.stringify(propSchema.default)}</code>
                    </div>
                  )}
                  {propSchema.example !== undefined && (
                    <div className="mt-1 text-xs text-slate-500">
                      Example: <code className="bg-slate-100 px-1 py-0.5 rounded">{JSON.stringify(propSchema.example)}</code>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (schema.type === 'array' && schema.items) {
    return (
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-slate-700 mb-2">
          <span className="font-semibold">Array of:</span>
        </p>
        {renderSchemaProperties(schema.items)}
      </div>
    );
  }

  if (schema.allOf || schema.oneOf || schema.anyOf) {
    const compositionType = schema.allOf ? 'allOf' : schema.oneOf ? 'oneOf' : 'anyOf';
    const schemas = schema.allOf || schema.oneOf || schema.anyOf || [];

    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">
          {compositionType === 'allOf' && 'Must match all of:'}
          {compositionType === 'oneOf' && 'Must match one of:'}
          {compositionType === 'anyOf' && 'Can match any of:'}
        </p>
        {schemas.map((subSchema, index) => (
          <div key={index} className="pl-4 border-l-2 border-slate-300">
            {renderSchemaProperties(subSchema)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold text-slate-700">Type: </span>
          <span className="font-mono text-slate-900">{schema.type || 'any'}</span>
        </div>
        {schema.format && (
          <div>
            <span className="font-semibold text-slate-700">Format: </span>
            <span className="font-mono text-slate-900">{schema.format}</span>
          </div>
        )}
        {schema.enum && (
          <div>
            <span className="font-semibold text-slate-700">Enum: </span>
            <span className="font-mono text-slate-900">{schema.enum.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SchemaView({ name, schema }: SchemaViewProps) {
  const generateExample = (schema: SchemaObject): any => {
    if (schema.example) return schema.example;
    if (schema.$ref) return `Reference to ${schema.$ref.split('/').pop()}`;

    if (schema.type === 'object' && schema.properties) {
      const example: any = {};
      Object.entries(schema.properties).forEach(([key, prop]) => {
        example[key] = generateExample(prop);
      });
      return example;
    }

    if (schema.type === 'array' && schema.items) {
      return [generateExample(schema.items)];
    }

    if (schema.enum) return schema.enum[0];
    if (schema.default !== undefined) return schema.default;

    switch (schema.type) {
      case 'string':
        return schema.format === 'email' ? 'user@example.com' : 'string';
      case 'number':
      case 'integer':
        return 0;
      case 'boolean':
        return true;
      default:
        return null;
    }
  };

  const example = generateExample(schema);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{name}</h1>
          {schema.description && (
            <p className="text-lg text-slate-600 leading-relaxed">{schema.description}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Schema Definition</h2>
          {renderSchemaProperties(schema)}
        </div>

        {example && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Example</h2>
            <CodeBlock code={JSON.stringify(example, null, 2)} />
          </div>
        )}
      </div>
    </div>
  );
}

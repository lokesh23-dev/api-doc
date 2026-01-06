'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Sidebar } from '@/components/Sidebar';
import { EndpointView } from '@/components/EndpointView';
import { SchemaView } from '@/components/SchemaView';
import { SecurityView } from '@/components/SecurityView';
import { OverviewView } from '@/components/OverviewView';
import { OpenAPIParser } from '@/lib/openapi-parser';
import { OpenAPISpec, TreeNode } from '@/types/openapi';

export default function Home() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const parser = new OpenAPIParser();
      const parsedSpec = await parser.parseFile(file);
      const docTree = parser.buildTree();

      setSpec(parsedSpec);
      setTree(docTree);

      const overviewNode = docTree.children?.find((n) => n.id === 'introduction')?.children?.[0];
      if (overviewNode) {
        setSelectedNode(overviewNode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
  };

  if (!spec || !tree) {
    return <FileUpload onFileSelect={handleFileSelect} error={error} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!selectedNode) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <p className="text-slate-500">Select an item from the sidebar</p>
        </div>
      );
    }

    if (selectedNode.data?.type === 'overview') {
      return <OverviewView spec={spec} />;
    }

    if (selectedNode.type === 'endpoint' && selectedNode.data?.endpoint) {
      return <EndpointView endpoint={selectedNode.data.endpoint} />;
    }

    if (selectedNode.type === 'schema' && selectedNode.data) {
      return <SchemaView name={selectedNode.data.name} schema={selectedNode.data.schema} />;
    }

    if (selectedNode.type === 'security' && selectedNode.data) {
      return <SecurityView name={selectedNode.data.name} scheme={selectedNode.data.scheme} />;
    }

    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Content not available</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar tree={tree} selectedId={selectedNode?.id || null} onSelect={handleNodeSelect} />
      {renderContent()}
    </div>
  );
}

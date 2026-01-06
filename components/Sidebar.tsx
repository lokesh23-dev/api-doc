'use client';

import { useState, useMemo } from 'react';
import { TreeNode } from '@/types/openapi';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Shield,
  Search,
  Book,
} from 'lucide-react';

interface SidebarProps {
  tree: TreeNode;
  selectedId: string | null;
  onSelect: (node: TreeNode) => void;
}

const METHOD_COLORS = {
  get: 'bg-blue-100 text-blue-700',
  post: 'bg-green-100 text-green-700',
  put: 'bg-orange-100 text-orange-700',
  delete: 'bg-red-100 text-red-700',
  patch: 'bg-purple-100 text-purple-700',
  options: 'bg-gray-100 text-gray-700',
  head: 'bg-gray-100 text-gray-700',
  trace: 'bg-gray-100 text-gray-700',
};

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  selectedId: string | null;
  onSelect: (node: TreeNode) => void;
  expandedNodes: Set<string>;
  toggleExpanded: (id: string) => void;
  searchTerm: string;
}

function TreeNodeItem({
  node,
  level,
  selectedId,
  onSelect,
  expandedNodes,
  toggleExpanded,
  searchTerm,
}: TreeNodeItemProps) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const isVisible = useMemo(() => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const labelMatch = node.label.toLowerCase().includes(searchLower);

    if (labelMatch) return true;

    const childMatches = (n: TreeNode): boolean => {
      if (n.label.toLowerCase().includes(searchLower)) return true;
      return n.children?.some(childMatches) || false;
    };

    return node.children?.some(childMatches) || false;
  }, [node, searchTerm]);

  if (!isVisible) return null;

  const handleClick = () => {
    if (hasChildren) {
      toggleExpanded(node.id);
    }
    if (node.type !== 'folder' && node.type !== 'root') {
      onSelect(node);
    }
  };

  const renderIcon = () => {
    if (node.type === 'folder' || node.type === 'root') {
      return isExpanded ? (
        <ChevronDown className="w-4 h-4 text-slate-500" />
      ) : (
        <ChevronRight className="w-4 h-4 text-slate-500" />
      );
    }

    if (node.type === 'schema') {
      return <FileText className="w-4 h-4 text-slate-500" />;
    }

    if (node.type === 'security') {
      return <Shield className="w-4 h-4 text-slate-500" />;
    }

    if (node.method) {
      return (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
            METHOD_COLORS[node.method]
          }`}
        >
          {node.method}
        </span>
      );
    }

    return <Book className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md
          transition-colors duration-150
          ${
            isSelected
              ? 'bg-blue-100 text-blue-900 font-medium'
              : 'text-slate-700 hover:bg-slate-100'
          }
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren && node.type === 'folder' && <Folder className="w-4 h-4 text-slate-400" />}
        {renderIcon()}
        <span className="text-sm truncate flex-1">{node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              toggleExpanded={toggleExpanded}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ tree, selectedId, onSelect }: SidebarProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['introduction', 'endpoints'])
  );
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="h-screen w-80 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-3">{tree.label}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tree.children?.map((child) => (
          <TreeNodeItem
            key={child.id}
            node={child}
            level={0}
            selectedId={selectedId}
            onSelect={onSelect}
            expandedNodes={expandedNodes}
            toggleExpanded={toggleExpanded}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}

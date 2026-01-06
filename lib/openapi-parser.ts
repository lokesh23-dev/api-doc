import yaml from 'js-yaml';
import {
  OpenAPISpec,
  ParsedEndpoint,
  TreeNode,
  HTTPMethod,
  PathItem,
} from '@/types/openapi';

export class OpenAPIParser {
  private spec: OpenAPISpec | null = null;

  async parseFile(file: File): Promise<OpenAPISpec> {
    const text = await file.text();
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
        this.spec = yaml.load(text) as OpenAPISpec;
      } else if (fileName.endsWith('.json')) {
        this.spec = JSON.parse(text);
      } else {
        throw new Error('Unsupported file format. Please use .yaml, .yml, or .json');
      }

      this.validateSpec();
      return this.spec!;
    } catch (error) {
      throw new Error(`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateSpec(): void {
    if (!this.spec) {
      throw new Error('No spec loaded');
    }

    if (!this.spec.openapi || !this.spec.openapi.startsWith('3.')) {
      throw new Error('Only OpenAPI 3.x specifications are supported');
    }

    if (!this.spec.info) {
      throw new Error('Invalid spec: missing info object');
    }

    if (!this.spec.paths) {
      throw new Error('Invalid spec: missing paths object');
    }
  }

  getEndpoints(): ParsedEndpoint[] {
    if (!this.spec) return [];

    const endpoints: ParsedEndpoint[] = [];
    const methods: HTTPMethod[] = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];

    Object.entries(this.spec.paths).forEach(([path, pathItem]) => {
      methods.forEach((method) => {
        const operation = pathItem[method];
        if (operation) {
          endpoints.push({
            id: `${method}-${path}`,
            path,
            method,
            operation,
            tags: operation.tags || ['Untagged'],
          });
        }
      });
    });

    return endpoints;
  }

  buildTree(): TreeNode {
    if (!this.spec) {
      return { id: 'root', label: 'API Documentation', type: 'root', children: [] };
    }

    const root: TreeNode = {
      id: 'root',
      label: this.spec.info.title || 'API Documentation',
      type: 'root',
      children: [],
    };

    const children: TreeNode[] = [];

    const introNode: TreeNode = {
      id: 'introduction',
      label: 'Introduction',
      type: 'folder',
      children: [
        {
          id: 'overview',
          label: 'Overview',
          type: 'endpoint',
          data: { type: 'overview', spec: this.spec },
        },
      ],
    };
    children.push(introNode);

    const endpointsNode = this.buildEndpointsTree();
    if (endpointsNode.children && endpointsNode.children.length > 0) {
      children.push(endpointsNode);
    }

    if (this.spec.components?.schemas) {
      const schemasNode = this.buildSchemasTree();
      children.push(schemasNode);
    }

    if (this.spec.components?.securitySchemes) {
      const securityNode = this.buildSecurityTree();
      children.push(securityNode);
    }

    root.children = children;
    return root;
  }

  private buildEndpointsTree(): TreeNode {
    const endpoints = this.getEndpoints();
    const tagGroups = new Map<string, ParsedEndpoint[]>();

    endpoints.forEach((endpoint) => {
      endpoint.tags.forEach((tag) => {
        if (!tagGroups.has(tag)) {
          tagGroups.set(tag, []);
        }
        tagGroups.get(tag)!.push(endpoint);
      });
    });

    const children: TreeNode[] = Array.from(tagGroups.entries()).map(([tag, tagEndpoints]) => {
      const tagChildren: TreeNode[] = tagEndpoints.map((endpoint) => ({
        id: endpoint.id,
        label: `${endpoint.method.toUpperCase()} ${endpoint.path}`,
        type: 'endpoint',
        method: endpoint.method,
        data: { endpoint },
      }));

      return {
        id: `tag-${tag}`,
        label: tag,
        type: 'folder',
        children: tagChildren,
      };
    });

    return {
      id: 'endpoints',
      label: 'Endpoints',
      type: 'folder',
      children,
    };
  }

  private buildSchemasTree(): TreeNode {
    if (!this.spec?.components?.schemas) {
      return { id: 'schemas', label: 'Schemas', type: 'folder', children: [] };
    }

    const children: TreeNode[] = Object.keys(this.spec.components.schemas).map((schemaName) => ({
      id: `schema-${schemaName}`,
      label: schemaName,
      type: 'schema',
      data: {
        name: schemaName,
        schema: this.spec!.components!.schemas![schemaName],
      },
    }));

    return {
      id: 'schemas',
      label: 'Schemas',
      type: 'folder',
      children,
    };
  }

  private buildSecurityTree(): TreeNode {
    if (!this.spec?.components?.securitySchemes) {
      return { id: 'security', label: 'Security', type: 'folder', children: [] };
    }

    const children: TreeNode[] = Object.keys(this.spec.components.securitySchemes).map((schemeName) => ({
      id: `security-${schemeName}`,
      label: schemeName,
      type: 'security',
      data: {
        name: schemeName,
        scheme: this.spec!.components!.securitySchemes![schemeName],
      },
    }));

    return {
      id: 'security',
      label: 'Security',
      type: 'folder',
      children,
    };
  }

  getSpec(): OpenAPISpec | null {
    return this.spec;
  }
}

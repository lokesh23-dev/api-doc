export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: PathItem;
  };
  components?: {
    schemas?: {
      [key: string]: SchemaObject;
    };
    securitySchemes?: {
      [key: string]: SecurityScheme;
    };
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  security?: Array<{
    [key: string]: string[];
  }>;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  options?: Operation;
  head?: Operation;
  trace?: Operation;
  summary?: string;
  description?: string;
  parameters?: Parameter[];
}

export interface Operation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: {
    [statusCode: string]: Response;
  };
  security?: Array<{
    [key: string]: string[];
  }>;
  deprecated?: boolean;
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: SchemaObject;
  example?: any;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: {
    [mediaType: string]: {
      schema?: SchemaObject;
      example?: any;
      examples?: {
        [key: string]: {
          summary?: string;
          value?: any;
        };
      };
    };
  };
}

export interface Response {
  description: string;
  content?: {
    [mediaType: string]: {
      schema?: SchemaObject;
      example?: any;
      examples?: {
        [key: string]: {
          summary?: string;
          value?: any;
        };
      };
    };
  };
  headers?: {
    [key: string]: {
      description?: string;
      schema?: SchemaObject;
    };
  };
}

export interface SchemaObject {
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  properties?: {
    [key: string]: SchemaObject;
  };
  required?: string[];
  items?: SchemaObject;
  enum?: any[];
  example?: any;
  default?: any;
  $ref?: string;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  additionalProperties?: boolean | SchemaObject;
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: {
    [key: string]: {
      authorizationUrl?: string;
      tokenUrl?: string;
      refreshUrl?: string;
      scopes?: {
        [key: string]: string;
      };
    };
  };
  openIdConnectUrl?: string;
}

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'trace';

export interface ParsedEndpoint {
  id: string;
  path: string;
  method: HTTPMethod;
  operation: Operation;
  tags: string[];
}

export interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'endpoint' | 'schema' | 'security' | 'root';
  children?: TreeNode[];
  data?: any;
  method?: HTTPMethod;
}

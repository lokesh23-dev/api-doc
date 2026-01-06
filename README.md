# OpenAPI Documentation Viewer

A modern, GitBook-inspired API documentation viewer for OpenAPI 3.x specifications built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Modern GitBook-style UI** - Clean, professional documentation layout with excellent typography and spacing
- **OpenAPI 3.x Support** - Full support for OpenAPI 3.x specifications in YAML and JSON formats
- **Interactive Sidebar** - Collapsible tree navigation with folders for endpoints, schemas, and security
- **Search Functionality** - Filter and search through endpoints and schemas
- **Detailed Documentation** - Comprehensive views for:
  - API Overview with metadata
  - Endpoints with parameters, request/response examples
  - Schema definitions with property tables
  - Security schemes and authentication flows
- **Drag & Drop Upload** - Easy file upload with drag and drop support
- **Syntax Highlighting** - Beautiful code blocks with copy-to-clipboard functionality
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Type-Safe** - Built with TypeScript for reliability and better developer experience

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload OpenAPI Spec**
   - Drag and drop your OpenAPI file (`.yaml`, `.yml`, or `.json`)
   - Or click to browse and select a file
   - A sample API spec is included at `public/sample-api.yaml` for testing

2. **Navigate Documentation**
   - Use the sidebar to browse through:
     - Introduction and overview
     - Endpoints organized by tags
     - Schema definitions
     - Security configurations
   - Click on any item to view detailed documentation

3. **Search and Filter**
   - Use the search bar in the sidebar to quickly find endpoints or schemas
   - Search filters the tree in real-time

4. **Copy Examples**
   - Hover over code blocks to see the copy button
   - Click to copy request/response examples to clipboard

## Project Structure

```
├── app/
│   ├── page.tsx          # Main application component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── FileUpload.tsx    # File upload with drag & drop
│   ├── Sidebar.tsx       # Navigation tree component
│   ├── EndpointView.tsx  # Endpoint documentation view
│   ├── SchemaView.tsx    # Schema documentation view
│   ├── SecurityView.tsx  # Security scheme documentation
│   └── OverviewView.tsx  # API overview page
├── lib/
│   └── openapi-parser.ts # OpenAPI parsing logic
├── types/
│   └── openapi.ts        # TypeScript type definitions
└── public/
    └── sample-api.yaml   # Sample OpenAPI specification
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **js-yaml** - YAML parsing library
- **Lucide React** - Beautiful icon library

## Features in Detail

### File Upload Component
- Drag and drop support
- File type validation
- Error handling with friendly messages
- Beautiful empty state with instructions

### Sidebar Navigation
- Hierarchical tree structure
- Collapsible folders
- HTTP method badges with color coding
- Active item highlighting
- Real-time search filtering
- Smooth animations and transitions

### Endpoint Documentation
- Method and path header with colored badges
- Summary and description
- Parameters table (path, query, header)
- Request body schema visualization
- Response documentation with status codes
- Syntax-highlighted examples with copy functionality
- Deprecated endpoint warnings

### Schema Documentation
- Property tables with types and descriptions
- Required field indicators
- Nested schema support
- Reference resolution
- Array and composition schema handling
- Example generation

### Security Documentation
- Security scheme types (Bearer, API Key, OAuth2, etc.)
- Configuration details
- OAuth2 flow documentation with scopes
- OpenID Connect support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by GitBook's documentation interface
- Built with modern React and Next.js best practices
- Designed for developers who appreciate clean, readable documentation

# Schema Builder Component

A React component for dynamically building JSON schemas with support for nested objects and arrays.

## Features

- Support for various field types: string, number, boolean, float, objectId, nested objects, arrays, date, object, and any
- Dynamic field addition, deletion, and toggling
- Nested object support with unlimited nesting levels
- Array support with configurable item types
- Real-time JSON preview

## Project Structure

```
src/
├── components/
│   └── SchemaBuilder/
│       ├── ArrayField.tsx
│       ├── FieldRow.tsx
│       ├── index.ts
│       ├── JsonPreview.tsx
│       ├── NestedField.tsx
│       └── SchemaBuilder.tsx
├── App.tsx
├── index.css
└── main.tsx
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

```jsx
import { SchemaBuilder } from './components/SchemaBuilder';

const App = () => {
  const handleSchemaChange = (schema) => {
    console.log('Schema updated:', schema);
  };

  // Optional: provide an initial schema
  const initialSchema = {
    name: 'string',
    age: 'number',
    isActive: 'boolean'
  };

  return (
    <SchemaBuilder 
      initialSchema={initialSchema} 
      onChange={handleSchemaChange} 
    />
  );
};

export default App;
```

## Components

- **SchemaBuilder**: Main component that manages the form state and renders the field rows and JSON preview
- **FieldRow**: Renders a single field with its controls
- **NestedField**: Handles nested object fields
- **ArrayField**: Handles array type fields
- **JsonPreview**: Displays the JSON schema

## Supported Field Types

- `string`: String values
- `number`: Numeric values
- `boolean`: Boolean values (true/false)
- `float`: Floating-point numbers
- `objectId`: MongoDB ObjectId strings
- `nested`: Objects with nested fields
- `array`: Arrays of any supported type
- `date`: Date values
- `object`: Simple object structures
- `any`: Any type of value

## Props

### SchemaBuilder

| Prop | Type | Description |
|------|------|-------------|
| initialSchema | object | Optional initial schema to populate the builder |
| onChange | function | Callback function that receives the updated schema |
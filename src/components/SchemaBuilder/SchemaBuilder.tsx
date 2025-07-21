import { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Button, Card, Col, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldRow from './FieldRow';
import JsonPreview from './JsonPreview';
import { useTheme } from '../../context/ThemeContext';

interface SchemaBuilderProps {
  initialSchema?: Record<string, any>;
  onChange?: (schema: Record<string, any>) => void;
}

const SchemaBuilder = ({ initialSchema = {}, onChange }: SchemaBuilderProps) => {
  const { theme } = useTheme();
  const { control, watch } = useForm({
    defaultValues: {
      fields: Object.keys(initialSchema).length > 0 
        ? convertSchemaToFields(initialSchema)
        : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const [schema, setSchema] = useState<Record<string, any>>({});
  const watchFields = watch();
  
  // Check if any field is empty (for Add Field button validation)
  const fieldsData = useWatch({
    control,
    name: 'fields',
    defaultValue: []
  });
  
  const hasEmptyFields = fieldsData.some(
    (field: any) => !field.name || !field.type
  );

  // No longer automatically adding a field when empty

  useEffect(() => {
    const newSchema = generateSchemaFromFields(watchFields.fields || []);
    setSchema(newSchema);
    onChange?.(newSchema);
  }, [watchFields, onChange]);

  // Convert initial schema to form fields structure
  function convertSchemaToFields(schema: Record<string, any>, path = ''): any[] {
    if (!schema || Object.keys(schema).length === 0) {
      return [{ name: '', type: 'string', enabled: true }];
    }
    return Object.entries(schema).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Handle nested object
        return {
          name: key,
          type: 'nested',
          enabled: true,
          fields: convertSchemaToFields(value, `${path}${key}.`)
        };
      } else if (Array.isArray(value)) {
        // Handle array
        if (value.length > 0 && typeof value[0] === 'object') {
          return {
            name: key,
            type: 'array',
            enabled: true,
            itemType: 'nested',
            itemFields: {
              fields: convertSchemaToFields(value[0], `${path}${key}[0].`)
            }
          };
        } else {
          const itemType = value.length > 0 ? typeof value[0] : 'string';
          return {
            name: key,
            type: 'array',
            enabled: true,
            itemType: itemType === 'object' ? 'nested' : itemType
          };
        }
      } else {
        // Handle primitive types
        return {
          name: key,
          type: typeof value === 'string' ? value : typeof value,
          enabled: true
        };
      }
    });
  }

  // Generate schema from form fields
  function generateSchemaFromFields(fields: any[]): Record<string, any> {
    return fields.reduce((acc: Record<string, any>, field) => {
      if (field.enabled && field.name) {
        if (field.type === 'nested' && field.fields) {
          acc[field.name] = generateSchemaFromFields(field.fields);
        } else if (field.type === 'array') {
          if (field.itemType === 'nested' && field.itemFields?.fields) {
            acc[field.name] = [generateSchemaFromFields(field.itemFields.fields)];
          } else {
            acc[field.name] = [getDefaultValueForType(field.itemType || 'string')];
          }
        } else {
          acc[field.name] = getDefaultValueForType(field.type);
        }
      }
      return acc;
    }, {});
  }

  const getDefaultValueForType = (type: string): any => {
    return type;
  };

  // Simple remove function
  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Row gutter={24} className={`schema-builder-container ${theme}-theme`}>
      <Col xs={24} lg={12}>
        <Card 
          title="Schema Fields" 
          className="schema-fields-card"
          bordered={false}
        >
          <div className="schema-fields-container">
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                control={control}
                index={index}
                remove={handleRemove}
                append={append}
              />
            ))}
          </div>
          <Button 
            className="add-field-button"
            onClick={() => append({ name: '', type: '', enabled: true })}
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            disabled={hasEmptyFields}
          >
            Add New Field
          </Button>
          {hasEmptyFields && (
            <div className="validation-message">
              Please complete all field names and types before adding a new field
            </div>
          )}
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <JsonPreview schema={schema} />
      </Col>
    </Row>
  );
};

export default SchemaBuilder;
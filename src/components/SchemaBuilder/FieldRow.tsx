import { Control, Controller, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input, Select, Switch, Space, Divider, Tooltip, Button } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import NestedField from './NestedField';
import ArrayField from './ArrayField';
import { useTheme } from '../../context/ThemeContext';

interface FieldRowProps {
  control: Control<any>;
  index: number;
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<any, "fields">;
  nestingLevel?: number;
  parentPath?: string;
}

const fieldTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'float', label: 'Float' },
  { value: 'objectId', label: 'ObjectId' },
  { value: 'nested', label: 'Nested Object' },
  { value: 'array', label: 'Array' },
  { value: 'date', label: 'Date' },
  { value: 'object', label: 'Object' },
  { value: 'any', label: 'Any' },
];

const FieldRow = ({ 
  control, 
  index, 
  remove, 
  nestingLevel = 0,
  parentPath = 'fields'
}: FieldRowProps) => {
  const { theme } = useTheme();
  const fieldPath = `${parentPath}[${index}]`;
  
  return (
    <div className={`schema-builder__field-row ${theme}-theme`}>
      <Space className="field-row-content" align="center">
        <Controller
          control={control}
          name={`${fieldPath}.name`}
          render={({ field }) => (
            <Input 
              {...field} 
              placeholder="Field name" 
              className="field-name-input"
              prefix={<EditOutlined className="field-icon" />}
              maxLength={50}
              style={{ color: theme === 'dark' ? 'white' : 'inherit' }}
              onChange={(e) => {
                // Only allow alphanumeric and underscore characters
                const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                field.onChange(value);
              }}
            />
          )}
        />
        
        <Controller
          control={control}
          name={`${fieldPath}.type`}
          render={({ field }) => (
            <Select 
              {...field} 
              options={fieldTypes}
              className="field-type-select"
              placeholder="Select type"
              showSearch
              dropdownClassName={`field-type-dropdown ${theme}-theme`}
              style={{ color: theme === 'dark' ? 'white' : 'inherit' }}
            />
          )}
        />
        
        <Tooltip title="Enable/Disable Field">
          <Controller
            control={control}
            name={`${fieldPath}.enabled`}
            render={({ field }) => (
              <Switch 
                checked={field.value} 
                onChange={field.onChange}
                className="field-toggle"
              />
            )}
          />
        </Tooltip>
        
        <Tooltip title="Delete Field">
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => remove(index)}
            className="delete-field-button"
            size="small"
          />
        </Tooltip>
      </Space>
      
      <Controller
        control={control}
        name={`${fieldPath}.type`}
        render={({ field }) => (
          <>
            {field.value === 'nested' && (
              <div className="schema-builder__nested-content">
                <NestedField 
                  control={control} 
                  parentPath={fieldPath} 
                  nestingLevel={nestingLevel + 1} 
                />
              </div>
            )}
            
            {field.value === 'array' && (
              <div className="schema-builder__nested-content">
                <ArrayField 
                  control={control} 
                  parentPath={fieldPath} 
                  nestingLevel={nestingLevel + 1} 
                />
              </div>
            )}
          </>
        )}
      />
      
      {nestingLevel === 0 && <Divider className="schema-builder__divider" />}
    </div>
  );
};

export default FieldRow;
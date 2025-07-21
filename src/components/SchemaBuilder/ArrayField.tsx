import { useEffect } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Select, Typography } from 'antd';
import NestedField from './NestedField';
import { useTheme } from '../../context/ThemeContext';

interface ArrayFieldProps {
  control: Control<any>;
  parentPath: string;
  nestingLevel: number;
}

const { Text } = Typography;

const fieldTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'float', label: 'Float' },
  { value: 'objectId', label: 'ObjectId' },
  { value: 'nested', label: 'Nested Object' },
  { value: 'date', label: 'Date' },
  { value: 'object', label: 'Object' },
  { value: 'any', label: 'Any' },
];

const ArrayField = ({ control, parentPath, nestingLevel }: ArrayFieldProps) => {
  const { theme } = useTheme();
  // Watch for item type changes
  const itemType = useWatch({
    control,
    name: `${parentPath}.itemType`,
    defaultValue: 'string'
  });
  
  // Set default item type if not already set
  useEffect(() => {
    if (!itemType) {
      // Use setValue from form methods instead of directly from control
      const formMethods = control._formState?.controllerRef?.current;
      if (formMethods) {
        formMethods.setValue(`${parentPath}.itemType`, 'string');
      }
    }
  }, [control, parentPath, itemType]);

  return (
    <div className={`array-field-wrapper ${theme}-theme nesting-level-${nestingLevel % 3}`}>
      <div className="array-field-header">
        <span className="array-field-title">Array Items</span>
      </div>
      <div className="array-field-type-selector">
        <Text strong className="array-field-label">Item Type:</Text>
        <Controller
          control={control}
          name={`${parentPath}.itemType`}
          defaultValue="string"
          render={({ field }) => (
            <Select 
              {...field} 
              options={fieldTypes}
              className="array-field-select"
              showSearch
              style={{ color: theme === 'dark' ? 'white' : 'inherit' }}
              dropdownClassName={`field-type-dropdown ${theme}-theme`}
            />
          )}
        />
      </div>
      
      {itemType === 'nested' && (
        <div className="array-nested-container">
          <div className="array-nested-header">
            <span className="array-nested-title">Nested Array Items</span>
          </div>
          <NestedField 
            control={control} 
            parentPath={`${parentPath}.itemFields`} 
            nestingLevel={nestingLevel + 1}
          />
        </div>
      )}
    </div>
  );
};

export default ArrayField;
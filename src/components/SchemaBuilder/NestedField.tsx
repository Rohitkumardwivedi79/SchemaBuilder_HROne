import { Control, useFieldArray } from 'react-hook-form';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldRow from './FieldRow';
import { useTheme } from '../../context/ThemeContext';

interface NestedFieldProps {
  control: Control<any>;
  parentPath: string;
  nestingLevel: number;
}

const NestedField = ({ control, parentPath, nestingLevel }: NestedFieldProps) => {
  const { theme } = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${parentPath}.fields`,
  });

  // No longer automatically adding a field when empty

  // Simple remove function
  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className={`nested-field-wrapper ${theme}-theme nesting-level-${nestingLevel % 3}`}>
      <div className="nested-field-header">
        <span className="nested-field-title">Nested Fields</span>
      </div>
      <div className="nested-fields-container">
        {fields.map((field, index) => (
          <FieldRow
            key={field.id}
            control={control}
            index={index}
            remove={handleRemove}
            append={append}
            nestingLevel={nestingLevel + 1}
            parentPath={`${parentPath}.fields`}
          />
        ))}
      </div>
      
      <Button
        onClick={() => append({ name: '', type: '', enabled: true })}
        type="primary"
        ghost
        icon={<PlusOutlined />}
        className="nested-field-button"
        size="small"
      >
        Add Field
      </Button>
    </div>
  );
};

export default NestedField;
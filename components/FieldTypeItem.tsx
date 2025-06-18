
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { FieldType } from '@/types/form';

interface FieldTypeItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const FieldTypeItem: React.FC<FieldTypeItemProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD_TYPE',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 border rounded-md bg-white cursor-move transition-all ${
        isDragging ? 'opacity-50 border-blue-400' : 'hover:border-primary hover:shadow-sm'
      }`}
    >
      <div className="mr-3 text-blue-600">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default FieldTypeItem;

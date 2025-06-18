// components/SortableField.tsx
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface SortableFieldProps {
  id: string;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const ItemType = 'FIELD';

const SortableField: React.FC<SortableFieldProps> = ({ id, index, moveField, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="cursor-move">
      {children}
    </div>
  );
};

export default SortableField;

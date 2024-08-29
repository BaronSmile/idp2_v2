import React, { useState, useEffect, useRef } from 'react';
import { Button, InputRef, Input, Modal } from 'antd';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeName: string) => void;
  initialName?: string;
  mode: 'add' | 'edit';
}

const NodeModal: React.FC<IProps> = ({ isOpen, onClose, onSubmit, initialName = '', mode }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      // Устанавливаем фокус на input после открытия модального окна
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialName]);

  const handleSubmit = () => {
    onSubmit(name);
    setName('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setName('');
        onClose();
      }}
      footer={[
        <Button key={name} disabled={!name} onClick={handleSubmit}>
          {mode === 'add' ? 'Добавить' : 'Сохранить'}
        </Button>,
      ]}
    >
      <Input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        style={{ marginTop: '2em' }}
      />
    </Modal>
  );
};

export default NodeModal;

import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (treeName: string) => void;
}

const NodeModal: React.FC<IProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key={name}
          disabled={!name}
          onClick={() => {
            onSubmit(name);
            onClose();
          }}
        >
          Добавить
        </Button>,
      ]}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Чтобы предотвратить стандартное поведение нажатия клавиши Enter в поле ввода
            onSubmit(name);
            onClose();
          }
        }}
        style={{ marginTop: '2em' }}
      />
    </Modal>
  );
};

export default NodeModal;

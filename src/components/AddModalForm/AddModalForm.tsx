import React from 'react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import './AddModalForm.scss';

interface IProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Option } = Select;

const AddModalForm: React.FC<IProps> = ({ modalOpen, setModalOpen }) => {
  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    console.log('FORM:', values);
    setModalOpen(false);
  };

  const handleNumberChange = (value: number | null) => {
    const levelValue = value && value <= 50 ? 'easy' : value && value <= 100 ? 'medium' : 'hard';
    form.setFieldsValue({ level: levelValue });
  };

  const handleSelectChange = (value: string) => {
    let pointValue;
    if (value === 'easy') {
      pointValue = 50;
    } else if (value === 'medium') {
      pointValue = 100;
    } else if (value === 'hard') {
      pointValue = 150;
    }
    form.setFieldsValue({ point: pointValue });
  };

  return (
    <Modal
      title={'Создание задачи'}
      open={modalOpen}
      footer={null}
      className={'add_form'}
      onCancel={() => setModalOpen(false)}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        className="form_task"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item name="title" label="Задача">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input />
        </Form.Item>
        <Form.Item name="point" label="Оценка">
          <InputNumber max={150} min={1} onChange={handleNumberChange} />
        </Form.Item>
        <Form.Item name="level" label="Уровень">
          <Select onChange={handleSelectChange}>
            <Option value="easy">Легкий</Option>
            <Option value="medium">Средний</Option>
            <Option value="hard">Тяжелый</Option>
          </Select>
        </Form.Item>
        <Form.Item className="form_btn">
          <Button htmlType="submit">Создать</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModalForm;

import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import './AddModalForm.scss';
import { useCreateTask } from '../../services/mutations.ts';

interface IProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Option } = Select;

const AddModalForm: React.FC<IProps> = ({ modalOpen, setModalOpen }) => {
  const [form] = Form.useForm();
  const createTaskMutation = useCreateTask();

  useEffect(() => {
    form.resetFields();
  }, [modalOpen]);

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };

  const onFinish = (values: any) => {
    createTaskMutation.mutate(values);
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
        {...formLayout}
        onFinish={onFinish}
        initialValues={{
          point: 10,
          level: 'easy',
        }}
      >
        <Form.Item
          name={'title'}
          label={'Название задачи'}
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input placeholder={'Название задачи'} />
        </Form.Item>
        <Form.Item
          name={'description'}
          label={'Описание задачи'}
          rules={[{ required: true, message: 'Это поле обязательно' }]}
        >
          <Input.TextArea placeholder={'Описание задачи'} />
        </Form.Item>
        <Form.Item name={'point'} label={'Количество баллов'}>
          <InputNumber max={150} min={1} defaultValue={10} onChange={handleNumberChange} />
        </Form.Item>
        <Form.Item name="level" label="Уровень">
          <Select defaultValue={'easy'} onChange={handleSelectChange}>
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

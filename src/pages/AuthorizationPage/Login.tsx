import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useLogin } from '../../services/mutations.ts';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  updateAuthStatus: () => void;
}

const Login: React.FC<LoginProps> = ({ updateAuthStatus }) => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        if (data.success && data.token) {
          message.success('Вы успешно вошли в систему');
          updateAuthStatus();
          navigate('/tasks');
        } else {
          message.error(data.message || 'Произошла ошибка при входе');
        }
      },
      onError: (error) => {
        message.error('Произошла ошибка при попытке входа');
        console.error('Ошибка входа:', error);
      },
    });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="username"
        label="Имя пользователя"
        rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Пароль"
        rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;

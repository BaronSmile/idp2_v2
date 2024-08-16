import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRegister } from '../../services/mutations.ts';
import { getUser } from '../../services/api.ts';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Пожалуйста, введите имя пользователя!')
    .test('unique-username', 'Имя пользователя уже занято', async (value) => {
      if (!value) return true;
      try {
        const users = await getUser(value);
        // return !users.some((user: any) => user.username === value);
        return users.length === 0;
      } catch (error) {
        return true;
      }
    }),
  password: Yup.string()
    .required('Пожалуйста, введите пароль!')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: Yup.string()
    .required('Пожалуйста, подтвердите пароль!')
    .oneOf([Yup.ref('password')], 'Пароли не совпадают!'),
});

const Register: React.FC = () => {
  const registerMutation = useRegister();

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = (
    values: { username: string; password: string; confirmPassword: string },
    { resetForm }: { resetForm: () => void },
  ) => {
    const { confirmPassword, ...userData } = values;

    registerMutation.mutate(userData, {
      onSuccess: (data) => {
        if (data.success) {
          message.success('Вы успешно зарегистрировались');
          resetForm();
        } else {
          message.error(data.message || 'Произошла ошибка при регистрации');
        }
      },
      onError: (error) => {
        message.error('Произошла ошибка при регистрации');
        console.error('Ошибка регистрации:', error);
      },
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit, errors, touched }) => (
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Имя пользователя"
            validateStatus={errors.username && touched.username ? 'error' : ''}
            help={<ErrorMessage name="username" />}
          >
            <Field name="username" as={Input} />
          </Form.Item>
          <Form.Item
            label="Пароль"
            validateStatus={errors.password && touched.password ? 'error' : ''}
            help={<ErrorMessage name="password" />}
          >
            <Field name="password" as={Input.Password} />
          </Form.Item>
          <Form.Item
            label="Подтвердите пароль"
            validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
            help={<ErrorMessage name="confirmPassword" />}
          >
            <Field name="confirmPassword" as={Input.Password} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default Register;

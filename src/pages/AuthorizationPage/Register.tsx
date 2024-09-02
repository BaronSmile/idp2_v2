import React, { useState, useCallback } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRegister } from '../../services/mutations.ts';
import { checkUsernameUniqueness, login } from '../../services/api.ts';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  updateAuthStatus: () => void;
}

const Register: React.FC<RegisterProps> = ({ updateAuthStatus }) => {
  const registerMutation = useRegister();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const navigate = useNavigate();

  const debouncedCheckUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length > 0) {
        setIsCheckingUsername(true);
        try {
          const isUnique = await checkUsernameUniqueness(username);
          if (!isUnique) {
            setUsernameError('Имя пользователя уже занято');
          } else {
            setUsernameError(null);
          }
        } catch (error) {
          console.error('Ошибка при проверке имени пользователя:', error);
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameError(null);
      }
    }, 1000),
    [],
  );

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Пожалуйста, введите имя пользователя!'),
    password: Yup.string()
      .required('Пожалуйста, введите пароль!')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: Yup.string()
      .required('Пожалуйста, подтвердите пароль!')
      .oneOf([Yup.ref('password')], 'Пароли не совпадают!'),
  });

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = (
    values: { username: string; password: string; confirmPassword: string },
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>,
  ) => {
    if (usernameError) {
      setSubmitting(false);
      return;
    }

    const { confirmPassword, ...userData } = values;

    registerMutation.mutate(userData, {
      onSuccess: async (data) => {
        if (data.success) {
          message.success('Вы успешно зарегистрировались');
          resetForm();
          setUsernameError(null);

          // Автоматический вход после успешной регистрации
          const loginResponse = await login(userData.username, userData.password);
          if (loginResponse.success && loginResponse.token) {
            localStorage.setItem('token', loginResponse.token);
            updateAuthStatus();
            navigate('/tasks');
          } else {
            message.error(loginResponse.message || 'Произошла ошибка при входе');
          }
        } else {
          message.error(data.message || 'Произошла ошибка при регистрации');
        }
        setSubmitting(false);
      },
      onError: (error) => {
        message.error('Произошла ошибка при регистрации');
        console.error('Ошибка регистрации:', error);
        setSubmitting(false);
      },
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit, errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Имя пользователя"
            validateStatus={(errors.username && touched.username) || usernameError ? 'error' : ''}
            help={usernameError || <ErrorMessage name="username" />}
          >
            <Input
              name="username"
              onChange={(e) => {
                const username = e.target.value;
                setFieldValue('username', username, false);
                debouncedCheckUsername(username);
              }}
            />
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
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting || isCheckingUsername || !!usernameError || !isValid || !dirty}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default Register;

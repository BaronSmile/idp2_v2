import React, { useState } from 'react';
import { Tabs } from 'antd';
import Login from './Login';
import Register from './Register';

interface AuthPageProps {
  updateAuthStatus: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ updateAuthStatus }) => {
  const [isLogin, setIsLogin] = useState(true);

  const items = [
    {
      key: '1',
      label: 'Вход',
      children: <Login updateAuthStatus={updateAuthStatus} />,
    },
    {
      key: '2',
      label: 'Регистрация',
      children: <Register updateAuthStatus={updateAuthStatus} />,
    },
  ];

  return (
    <Tabs
      activeKey={isLogin ? '1' : '2'}
      onChange={(key) => setIsLogin(key === '1')}
      items={items}
    />
  );
};

export default AuthPage;

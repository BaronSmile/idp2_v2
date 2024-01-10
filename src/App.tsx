import { ConfigProvider } from 'antd';
import AppRouter from './providers/router/AppRouter.tsx';

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorBgBase: '#4dd7a2',
            algorithm: true,
          },
          Table: {
            colorBgBase: '#1c2536',
            algorithm: true,
          },
          Modal: {
            colorBgBase: '#292862',
            algorithm: true,
          },
          Input: {
            colorTextBase: '#000',
            algorithm: true,
          },
          Select: {
            colorTextBase: '#000',
            algorithm: true,
          },
          Tooltip: {
            colorTextBase: '#000',
            algorithm: true,
          },
        },
        token: {
          colorTextBase: '#fff',
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;

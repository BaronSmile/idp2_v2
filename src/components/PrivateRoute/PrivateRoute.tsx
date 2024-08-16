import { Navigate, Outlet } from 'react-router-dom';

interface IPrivateRouteProps {
  isAuth: boolean;
}

const PrivateRoute = ({ isAuth }: IPrivateRouteProps) => {
  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;

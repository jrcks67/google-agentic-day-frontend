import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '../hooks/useAuth';

const ProtectedRoutes = () => {
  // Temporarily bypass authentication for demo purposes
  // const { data: isAuthenticated, isLoading, error } = useIsAuthenticated();

  // Show loading indicator while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // Redirect to login if not authenticated
  // if (error || !isAuthenticated) {
  //   return <Navigate to="/signin" replace />;
  // }

  // Render child routes directly for demo
  return <Outlet />;
};

export default ProtectedRoutes;

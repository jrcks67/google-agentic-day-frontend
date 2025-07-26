import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '../hooks/useAuth';

const ProtectedRoutes = () => {
  // const { data: isAuthenticated, isLoading, error } = useIsAuthenticated();

  // console.log('ProtectedRoutes - Auth status:', { isAuthenticated, isLoading, error });

  // // Show loading indicator while checking authentication
  // if (isLoading) {
  //   console.log('ProtectedRoutes - Showing loading spinner');
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // // Redirect to login if not authenticated
  // if (error || !isAuthenticated) {
  //   console.log('ProtectedRoutes - Redirecting to signin:', { error, isAuthenticated });
  //   return <Navigate to="/signin" replace />;
  // }

  // // Render protected content
  // console.log('ProtectedRoutes - Rendering protected content');
  return <Outlet />;
};

export default ProtectedRoutes;

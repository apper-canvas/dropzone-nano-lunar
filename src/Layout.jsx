import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
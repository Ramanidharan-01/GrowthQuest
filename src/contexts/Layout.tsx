// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
      {/* Optional: shared header / nav here */}
      <Outlet /> {/* This is essential for nested routing to work */}
    </div>
  );
};

export default Layout;

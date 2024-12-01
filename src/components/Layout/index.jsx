import { Outlet, useLocation } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';
import Header from './Header';
import DashboardMenu from './DashboardMenu';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return <DashboardMenu />;
  }

  return (
    <div className="min-h-screen">
      <MobileSidebar />
      <Header />
      <main className="pt-28 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card glass-card-dark p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
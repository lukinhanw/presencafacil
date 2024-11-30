import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-8">
          <div className="glass-card glass-card-dark p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
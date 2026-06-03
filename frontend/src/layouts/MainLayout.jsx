import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import MobileBottomNav from '../components/layout/MobileBottomNav.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1 lg:pl-[292px]">
          <Navbar />
          <main className="min-w-0 px-4 pb-24 pt-7 sm:px-8 lg:px-12 lg:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

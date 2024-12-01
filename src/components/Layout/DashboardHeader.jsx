import ThemeToggle from '../ThemeToggle';
import UserMenu from './UserMenu';

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 glass-card-alt bg-opacity-50 h-[50px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-md text-gray-700 dark:text-gray-300">
            8Bits Company
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
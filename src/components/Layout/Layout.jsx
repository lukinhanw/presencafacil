import { Outlet, useLocation } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';
import Header from './Header';
import NavigationBar from './NavigationBar';
import Dashboard from '../../pages/dashboard';

export default function Layout() {
	const location = useLocation();
	const isHome = location.pathname === '/';

	return (
		<div className="min-h-screen bg-gradient-to-br from-[var(--background-start)] to-[var(--background-end)]">
			<MobileSidebar />
			<Header />
			{isHome ? (
				<div className="pt-16 mt-1">
					<Dashboard />
				</div>
			) : (
				<div className="pt-16 mt-1">
					<NavigationBar />
					<main className="container mx-auto px-4 py-6">
						<div className="glass-card glass-card-dark p-6">
							<Outlet />
						</div>
					</main>
				</div>
			)}
		</div>
	);
}
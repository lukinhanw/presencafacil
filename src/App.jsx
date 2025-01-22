import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/login';
import Unauthorized from './pages/unauthorized';
import Trainings from './pages/trainings';
import Employees from './pages/employees';
import Instructors from './pages/instructors';
import Classes from './pages/classes';
import ClassInstance from './pages/classInstance';
import Join from './pages/join';
import Support from './pages/support';
import Profile from './pages/profile';
import Reports from './pages/reports';

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/unauthorized" element={<Unauthorized />} />
			<Route path="/aulas/:id/convite/:token" element={<Join />} />
			<Route path="/" element={
				<ProtectedRoute>
					<Layout />
				</ProtectedRoute>
			}>
				<Route path="treinamentos" element={<Trainings />} />
				<Route path="colaboradores" element={<Employees />} />
				<Route path="instrutores" element={<Instructors />} />
				<Route path="aulas">
					<Route index element={<Classes />} />
					<Route path=":id" element={<ClassInstance />} />
				</Route>
				<Route path="suporte" element={<Support />} />
				<Route path="perfil" element={<Profile />} />
				<Route
					path="/relatorios"
					element={
						<ProtectedRoute roles={['ADMIN_ROLE']}>
							<Reports />
						</ProtectedRoute>
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Classes from './pages/classes';
import ClassDetails from './pages/classDetails';
import Trainings from './pages/trainings';
import Instructors from './pages/instructors';
import Join from './pages/join';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/aulas/:id/convite/:token" element={<Join />} />
            
            <Route path="/" element={
                <PrivateRoute>
                    <Layout />
                </PrivateRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="aulas" element={<Classes />} />
                <Route path="aulas/:id" element={<ClassDetails />} />
                <Route path="treinamentos" element={<Trainings />} />
                <Route path="instrutores" element={<Instructors />} />
            </Route>
        </Routes>
    );
} 
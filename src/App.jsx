import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Trainings from './pages/Trainings';
import Employees from './pages/Employees';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="treinamentos" element={<Trainings />} />
        <Route path="colaboradores" element={<Employees />} />
        {/* Other routes will be added here */}
      </Route>
    </Routes>
  );
}

export default App;
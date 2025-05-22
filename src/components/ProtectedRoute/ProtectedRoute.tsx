// src/components/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Define las props que este componente puede recibir
interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'professional'; // Rol requerido para acceder a esta ruta
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  // Obtiene el token de autenticación y el rol del usuario desde localStorage
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // 'admin' o 'professional'

  // Si no hay token, el usuario no está autenticado, redirige al login
  if (!authToken) {
    console.log("Acceso denegado: No se encontró authToken. Redirigiendo a /login.");
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un rol requerido y el rol del usuario no coincide, redirige
  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Acceso denegado: Rol '${userRole}' no autorizado para la ruta. Rol requerido: '${requiredRole}'.`);
    // Puedes redirigir a una página de "Acceso Denegado" o a un dashboard por defecto
    // Por ahora, si no es admin y trata de acceder a /admin, lo enviamos al login.
    // Si es un profesional intentando acceder a una ruta de admin, lo redirigimos a su propio dashboard.
    if (userRole === 'professional') {
        return <Navigate to="/professional/dashboard" replace />;
    }
    return <Navigate to="/login" replace />; // O a una página de error/acceso denegado
  }

  // Si el token existe y el rol es válido (o no se requiere un rol específico), permite el acceso
  return <Outlet />;
};

export default ProtectedRoute;

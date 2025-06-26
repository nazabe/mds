// src/components/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Define las props que este componente puede recibir
interface ProtectedRouteProps {
  // Los roles requeridos DEBEN ser en MAYÚSCULAS para coincidir con el backend y localStorage
  requiredRole?: 'ADMIN' | 'PROFESSIONAL' | 'USER'; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  // Obtiene el token de autenticación y el rol del usuario desde localStorage
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // Ej: "ADMIN"

  // Si no hay token, el usuario no está autenticado, redirige al login
  if (!authToken) {
    console.log("Acceso denegado: No se encontró authToken. Redirigiendo a /login.");
    return <Navigate to="/login" replace />;
  }

  // Si se especifica un rol requerido y el rol del usuario NO coincide
  // userRole (ej. "ADMIN") vs requiredRole (ej. "ADMIN")
  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Acceso denegado: Rol '${userRole}' no autorizado para la ruta. Rol requerido: '${requiredRole}'.`);
    
    // Redireccionamiento basado en el rol REAL del usuario
    // Si el usuario es un PROFESIONAL e intenta acceder a una ruta de ADMIN, lo enviamos a su dashboard.
    if (userRole === 'PROFESSIONAL') {
      return <Navigate to="/professional/dashboard" replace />;
    } 
    // Si el usuario es ADMIN e intenta acceder a una ruta que no le corresponde (o si el rol requerido
    // es otro y no coincide), lo enviamos a su dashboard de admin para evitar el bucle.
    else if (userRole === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    // Para cualquier otro rol no autorizado o caso por defecto, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si no hay rol requerido, o si el userRole COINCIDE con el requiredRole,
  // entonces permite el acceso a la ruta.
  return <Outlet />;
};

export default ProtectedRoute;

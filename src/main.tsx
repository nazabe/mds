// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilos globales

// Importa tus componentes de página específicos
import App from './App.tsx';
import BookingPage from './components/BookingPage/BookingPage.tsx';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.tsx';
import ProfessionalManagement from './components/ProfessionalManagement/ProfessionalManagement.tsx';
import ServiceManagement from './components/ServiceManagement/ServiceManagement.tsx';
import AppointmentManagement from './components/AppointmentManagement/AppointmentManagement.tsx'; // Importa el componente AppointmentManagement
import ProfessionalDashboard from './components/ProfessionalDashboard/ProfessionalDashboard.tsx';
import MyAppointments from './components/MyAppointments/MyAppointments.tsx';

// Importa los componentes de Layout y ProtectedRoute
import Layout from './components/Layout/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';

// Importa las herramientas de enrutamiento necesarias
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// --- Configuración del Router con Layout y Basename ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "reservar",
        element: <BookingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    // Ruta para el dashboard de ADMINISTRADOR y sus sub-rutas, PROTEGIDA con rol 'admin'
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin" />, // Requiere rol 'admin'
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "dashboard/professionals",
        element: <ProfessionalManagement />,
      },
      {
        path: "dashboard/services",
        element: <ServiceManagement />,
      },
      {
        path: "dashboard/appointments", // Ruta para la gestión de turnos
        element: <AppointmentManagement />, // Asocia el componente AppointmentManagement
      },
    ],
  },
  {
    // Ruta para el dashboard de PROFESIONAL y sus sub-rutas, PROTEGIDA con rol 'professional'
    path: "/professional",
    element: <ProtectedRoute requiredRole="professional" />, // Requiere rol 'professional'
    children: [
      {
        path: "dashboard",
        element: <ProfessionalDashboard />,
      },
      {
        path: "dashboard/my-appointments",
        element: <MyAppointments />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - Página no encontrada</div>,
  },
], {
  basename: "/mds/",
});
// --- Fin Configuración del Router ---


// --- Renderizado de la Aplicación ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

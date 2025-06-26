// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilos globales

// Importa tus componentes de página específicos
import App from './App.tsx'; // Tu componente principal de la página de inicio
import BookingPage from './components/BookingPage/BookingPage.tsx';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.tsx';
import ProfessionalManagement from './components/ProfessionalManagement/ProfessionalManagement.tsx';
import ServiceManagement from './components/ServiceManagement/ServiceManagement.tsx';
import AppointmentManagement from './components/AppointmentManagement/AppointmentManagement.tsx';
import ProfessionalDashboard from './components/ProfessionalDashboard/ProfessionalDashboard.tsx';
import MyAppointments from './components/MyAppointments/MyAppointments.tsx';

// Importa el CartProvider y CartPage
import { CartProvider } from './components/Cart/CartContext.tsx';
import CartPage from './components/Cart/CartPage.tsx'; // Importa la página del carrito

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
        element: <App />, // App.tsx es tu página de inicio principal
      },
      {
        path: "reservar",
        element: <BookingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      // Rutas para Mercado Pago (success, pending, failure)
      // No necesitan ser protegidas por rol, ya que MP redirige al usuario final
      {
        path: "pago-exitoso", // Coincide con mercadopago.success.url en backend (sin el /mds/)
        element: <div>¡Pago Exitoso! Gracias por tu compra.</div>, // Componente real para mostrar mensaje de éxito
      },
      {
        path: "pago-pendiente", // Coincide con mercadopago.pending.url en backend
        element: <div>Tu pago está pendiente. Te notificaremos cuando se confirme.</div>, // Componente para pago pendiente
      },
      {
        path: "pago-fallido", // Coincide con mercadopago.failure.url en backend
        element: <div>¡El pago ha fallado! Por favor, intenta de nuevo.</div>, // Componente para pago fallido
      },
    ],
  },
  
  {
    // Ruta para el dashboard de ADMINISTRADOR y sus sub-rutas, PROTEGIDA con rol 'ADMIN'
    path: "/admin",
    // ¡IMPORTANTE: requiredRole debe ser "ADMIN" en MAYÚSCULAS!
    element: <ProtectedRoute requiredRole="ADMIN" />, 
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
        path: "dashboard/appointments",
        element: <AppointmentManagement />,
      },
    ],
  },
  {
    // Ruta para el dashboard de PROFESIONAL y sus sub-rutas, PROTEGIDA con rol 'PROFESSIONAL'
    path: "/professional",
    // ¡IMPORTANTE: requiredRole debe ser "PROFESSIONAL" en MAYÚSCULAS!
    element: <ProtectedRoute requiredRole="PROFESSIONAL" />, 
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
    path: "*", // Catch-all para rutas no definidas
    element: <div>404 - Página no encontrada</div>,
  },
], {
  // Asegúrate de que el basename sea consistente con cómo despliegas tu frontend
  // Si tu app React se sirve desde http://localhost:5173/mds/, esto es correcto.
  // Si se sirve desde http://localhost:5173/, quítalo o déjalo vacío: basename: "/",
  basename: "/mds/", 
});
// --- Fin Configuración del Router ---


// --- Renderizado de la Aplicación envolviendo RouterProvider con CartProvider ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envuelve RouterProvider con CartProvider para que el contexto esté disponible globalmente */}
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);

import React from 'react';
import { Outlet } from 'react-router-dom'; // Importa Outlet
import Header from '../Header/Header'; // Importa el componente Header
// Importa el futuro componente Footer
import Footer from '../Footer/Footer'; // Asegúrate de crear este archivo y componente

// El componente Layout envuelve el contenido de las rutas y añade elementos globales
const Layout: React.FC = () => {
  return (
    <> {/* Usamos un Fragment para envolver sin añadir un div extra */}
      {/* Renderiza el Header, visible en todas las rutas que usen este Layout */}
      <Header />

      {/* El Outlet renderiza el componente de la ruta actual (App, BookingPage, etc.) */}
      {/* Añadimos un div con flexGrow para que el contenido principal ocupe el espacio y empuje el footer hacia abajo */}
      <div style={{ flexGrow: 1 }}>
          <Outlet />
      </div>


      {/* Renderiza el Footer. Este componente será visible en todas las rutas que usen este Layout. */}
      <Footer /> {/* Renderiza el componente Footer */}
    </>
  );
};

export default Layout; // Exporta el componente Layout

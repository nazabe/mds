import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import styles from './Header.module.css'; // Importa los estilos del Header
// Importa los iconos que necesites para los enlaces de navegación
import { FaHome, FaCalendarAlt, FaSignInAlt, FaHeart } from 'react-icons/fa'; // Ejemplo de iconos

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Contenedor del Logo/Título a la izquierda */}
      <div className={styles.logoContainer}>
        {/* Usamos un ícono y texto para el título del sitio, basado en la imagen y tu branding */}
         <FaHeart className={styles.logoIcon} /> {/* Puedes usar FaHeart o buscar otro ícono adecuado */}
        <span className={styles.siteTitle}>Spa Sentirse Bien</span>
      </div>

      {/* Contenedor de los enlaces de navegación a la derecha */}
      <nav className={styles.nav}>
        {/* Enlace a la página de Inicio */}
        <Link to="/" className={styles.navLink}>
           <FaHome className={styles.navIcon} /> Inicio
        </Link>
        {/* Enlace a la página de Reserva de Turno */}
        <Link to="/reservar" className={styles.navLink}>
           <FaCalendarAlt className={styles.navIcon} /> Reservar Turno
        </Link>
        {/* Enlace a la página de Iniciar Sesión (la crearemos después) */}
        {/* Puedes estilizar este Link para que parezca un botón si quieres */}
        <Link to="/login" className={styles.navLink}> {/* Apunta a la ruta /login */}
           <FaSignInAlt className={styles.navIcon} /> Iniciar Sesión
        </Link>
      </nav>
    </header>
  );
};

export default Header; // Exporta el componente Header
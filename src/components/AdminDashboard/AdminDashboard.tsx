// src/components/AdminDashboard/AdminDashboard.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { FaSignOutAlt, FaUserMd, FaCalendarAlt, FaConciergeBell } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    console.log("Sesión de administrador cerrada. Redirigiendo a /login.");
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Panel de Administración</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.logoutIcon} /> Cerrar Sesión
        </button>
      </div>

      {/* Sección de Navegación Rápida para Admin */}
      <div className={styles.adminNavigation}>
        <Link to="/admin/dashboard/professionals" className={styles.navCard}>
          <FaUserMd className={styles.navIcon} />
          <span>Gestionar Profesionales</span>
        </Link>
        <Link to="/admin/dashboard/services" className={styles.navCard}>
          <FaConciergeBell className={styles.navIcon} />
          <span>Gestionar Servicios</span>
        </Link>
        {/* Asegúrate de que esta ruta coincida con la definida en main.tsx */}
        <Link to="/admin/dashboard/appointments" className={styles.navCard}>
          <FaCalendarAlt className={styles.navIcon} />
          <span>Gestionar Turnos</span>
        </Link>
      </div>

      <div className={styles.dashboardContentPlaceholder}>
        <p>Bienvenido, Administrador. Desde aquí podrás gestionar todos los aspectos del spa.</p>
        <p>Selecciona una opción del menú de navegación.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

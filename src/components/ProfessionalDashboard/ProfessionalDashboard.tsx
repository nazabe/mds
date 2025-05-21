// src/components/ProfessionalDashboard/ProfessionalDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfessionalDashboard.module.css';
import { FaSignOutAlt, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [professionalName, setProfessionalName] = useState<string>('Profesional');

  useEffect(() => {
    // Recuperar el email del profesional del localStorage (guardado en LoginPage)
    const userEmail = localStorage.getItem('userEmailForProfessional');
    if (userEmail) {
      // Simular la búsqueda del nombre del profesional por su email
      // En un sistema real, esto se haría con una llamada a tu backend
      const mockProfessionals = [
        { email: 'ana.felicidad@spa.com', name: 'Dra. Ana Felicidad' },
        { email: 'dra.lopez@spa.com', name: 'Dra. López' },
        { email: 'dr.garcia@spa.com', name: 'Dr. García' },
        { email: 'lic.perez@spa.com', name: 'Lic. Pérez' },
      ];
      const foundProf = mockProfessionals.find(p => p.email === userEmail);
      if (foundProf) {
        setProfessionalName(foundProf.name);
      }
    }
  }, []);

  const handleLogout = () => {
    // Eliminar el token y el rol del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmailForProfessional'); // También eliminamos el email
    console.log("Sesión de profesional cerrada. Redirigiendo a /login.");
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Panel de Profesional</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.logoutIcon} /> Cerrar Sesión
        </button>
      </div>

      <div className={styles.professionalNavigation}>
        <Link to="/professional/dashboard/my-appointments" className={styles.navCard}>
          <FaCalendarAlt className={styles.navIcon} />
          <span>Ver Mis Turnos</span>
        </Link>
        {/* Aquí podrías añadir más opciones específicas para profesionales */}
        <div className={styles.navCard}>
          <FaUserCircle className={styles.navIcon} />
          <span>Mi Perfil ({professionalName})</span>
        </div>
      </div>

      <div className={styles.dashboardContentPlaceholder}>
        <p>Bienvenido, {professionalName}. Desde aquí podrás gestionar tus turnos y ver tu información.</p>
        <p>Selecciona una opción del menú de navegación.</p>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;

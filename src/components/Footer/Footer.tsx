import React from 'react';
import styles from './Footer.module.css'; // Importa los estilos de este componente
// Importa los iconos necesarios para el footer (teléfono, email, ubicación, reloj, redes sociales)
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
    FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp // Iconos de redes sociales y contacto
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    // La etiqueta <footer> es semántica para el pie de página del sitio
    <footer className={styles.footer}>
      {/* Contenedor principal del contenido del footer (para centrar y dar padding) */}
      <div className={styles.footerContent}>

        {/* Contenedor para las columnas (Contacto, Horarios, Síguenos) */}
        <div className={styles.footerColumns}>

          {/* Columna 1: Contacto */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Contacto</h3>
            {/* Ítem de Teléfono */}
            <div className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <a href="tel:+543624567880" className={styles.contactLink}>+54 3624567880</a> {/* Enlace de teléfono */}
            </div>
            {/* Ítem de Email */}
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <a href="mailto:Info@gestorspa.com" className={styles.contactLink}>Info@gestorspa.com</a> {/* Enlace de email */}
            </div>
            {/* Ítem de Ubicación */}
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span className={styles.contactText}>Av. San Martin 123, Ciudad de Resistencia</span> {/* Texto de dirección */}
            </div>
          </div> {/* Fin Columna Contacto */}

          {/* Columna 2: Horarios */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Horarios</h3>
            {/* Ítem de Horario Lunes a Sábados */}
            <div className={styles.hoursItem}>
              <FaClock className={styles.hoursIcon} />
              <span className={styles.hoursText}>Lunes a Sábados: 9:00-20:00</span> {/* Texto de horario */}
            </div>
            {/* Ítem de Horario Domingos */}
            <div className={styles.hoursItem}>
              <FaClock className={styles.hoursIcon} /> {/* Puedes usar el mismo ícono o uno diferente si prefieres */}
              <span className={styles.hoursText}>Domingos: Cerrado</span> {/* Texto de horario */}
            </div>
          </div> {/* Fin Columna Horarios */}

          {/* Columna 3: Síguenos */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Síguenos</h3>
            <p className={styles.followUsText}>Mantente al día con nuestras últimas novedades y promociones</p> {/* Texto descriptivo */}
            {/* Contenedor de iconos de redes sociales */}
            <div className={styles.socialIcons}>
              {/* Enlaces a perfiles sociales (reemplaza con tus URLs reales) */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className={styles.socialIcon} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className={styles.socialIcon} />
              </a>
              <a href="https://wa.me/5491123152163" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className={styles.socialIcon} />
              </a>
            </div> {/* Fin socialIcons */}
          </div> {/* Fin Columna Síguenos */}

        </div> {/* Fin footerColumns */}

        {/* Línea separadora antes del copyright */}
        <div className={styles.copyrightSeparator}></div>

        {/* Sección de Copyright */}
        <div className={styles.copyright}>
          {/* Puedes poner tu nombre o el de la empresa */}
          © 2025 GestorSpa. Todos los derechos reservados. {/* Texto de copyright */}
        </div> {/* Fin copyright */}
        <div className={styles.copyright}>
          {/* Puedes poner tu nombre o el de la empresa */}
          Desarrollado por VirtualCoders Team. {/* Texto de copyright */}
        </div> {/* Fin copyright */}

      </div> {/* Fin footerContent */}
    </footer> // Fin footer
  );
};

export default Footer; // Exporta el componente Footer

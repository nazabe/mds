import { Link } from 'react-router-dom';
import { useRef } from 'react'; // React ya está importado
import { FaMapMarkerAlt, FaArrowRight, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './App.module.css';
import { ChatbotIcon } from './components/chatbot/chatbot'; // Asegúrate que la ruta sea correcta

function App() {

  const servicesScrollRef = useRef<HTMLDivElement>(null); // Especificamos que la referencia es para un div

    const scrollLeft = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollBy({
        left: -300, // Ajusta la cantidad de scroll (en píxeles)
        behavior: 'smooth', // Animación suave
      });
    }
  };

  // Función para hacer scroll a la derecha en la sección de Servicios
  const scrollRight = () => {
    if (servicesScrollRef.current) {
      servicesScrollRef.current.scrollBy({
        left: 300, // Ajusta la cantidad de scroll (en píxeles)
        behavior: 'smooth', // Animación suave
      });
    }
  };

  // const scrollServices = (direction) => { // Eliminamos tipado para JS puro
  //   servicesScrollRef.current?.scrollBy({
  //     left: direction === 'left' ? -300 : 300,
  //     behavior: 'smooth',
  //   });
  // };

  // ... (tu código existente de contactItems y serviceCards se mantiene igual)
  const contactItems = [
    {
      icon: <FaPhone className={styles.contactIcon} />,
      text: <>
        Inquiries & appointments at <a href="tel:+5491123152163">+54 911 23 152163</a>
        {' '}(<a href="https://wa.me/5491123152163" target="_blank" rel="noopener noreferrer">WhatsApp</a>)
      </>,
    },
    {
      icon: <FaMapMarkerAlt className={styles.contactIcon} />,
      text: <>
        Located at Av. Rep Argentina & Humberto Primo, Resistencia - Chaco
        {' '}(<a href="https://www.google.com/maps/search/?api=1&query=Santa+Fe+718,+Resistencia,+Chaco" target="_blank" rel="noopener noreferrer">Open in Maps</a>)
      </>,
    },
  ];

  const serviceCards = [
    { src: '/mds/images/services/woman-567021_1280.jpg', title: 'Masaje Anti-stress' },
    { src: '/mds/images/services/massage-2768832_1280.jpg', title: 'Masaje Descontracturante' },
    { src: '/mds/images/services/people-3184615_1280.jpg', title: 'Masaje con Piedras Calientes' },
    { src: '/mds/images/services/massage-3795693_1280.jpg', title: 'Masaje Circulatorio' },
    { src: '/mds/images/services/face-2722810_1280.jpg', title: 'Lifting de Pestaña' },
    { src: '/mds/images/services/ai-generated-8270432_1280.jpg', title: 'Depilación Facial' },
  ];


  return (
    <div className={styles.App}> {/* Asumo que tienes un styles.App, si no, usa solo 'App' */}
      <main className={styles.hero}>
        {/* ... (tu contenido de hero se mantiene igual) ... */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>Reserva turnos con los mejores profesionales de la Belleza</h1>
          <p className={styles.heroDescription}>Descubre la belleza con nosotros. ¡Reserva tu turno hoy mismo!</p>
          <Link to="/reservar" className={styles.heroCtaButton}>
            Reservá tu turno <FaArrowRight />
          </Link>
        </div>
      </main>

      <section id="quienes-somos" className={styles.aboutUsSection}>
        {/* ... (tu contenido de aboutUsSection se mantiene igual) ... */}
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionHeading}>Sobre Nosotros</h2>
          <div className={styles.aboutUsContentColumns}>
            <div className={styles.aboutUsLeftColumn}>
              <p className={styles.sectionText}>Bienvenidos a Sentirse Bien, un espacio para reconectar con vos mismo, donde el bienestar es prioridad.</p>
              <p className={styles.sectionText}>En @zentitebienfisioterapia combinamos terapias modernas y tradicionales. Masajes energéticos, limpiezas faciales profundas y mucho más.</p>
              <p className={styles.sectionText}>Creamos un ambiente íntimo y personalizado. Cada cuerpo habla, y lo escuchamos.</p>
              <ul className={styles.questionsList}>
                <li>¿Desconectar del estrés?</li>
                <li>¿Buscar un momento para vos?</li>
                <li>¿Regalar bienestar?</li>
              </ul>
              <p className={styles.sectionText}>En Sentirse Bien lo vas a encontrar.</p>
            </div>

            <div className={styles.aboutUsRightColumn}>
              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.8613488754554!2d-58.36822492425079!3d-34.809429972881176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32ca981f47a07%3A0x164bdc6890dda77c!2sAvenida%20Rep%C3%BAblica%20Argentina%20Y%20Humberto%20Primo!5e0!3m2!1ses-419!2sar!4v1745555820613!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del Spa"
                ></iframe>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Santa+Fe+718,+Resistencia,+Chaco"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openInMapsButton}
              >
                Abrir en Maps <FaArrowRight />
              </a>
            </div>
          </div>
          <p className={styles.sectionText} style={{ textAlign: 'center', marginTop: '30px' }}>
            Estamos ansiosos por verte. Porque no se trata solo de verse bien... se trata de sentirse bien.
          </p>
        </div>
      </section>

      <section id="profesionales" className={styles.servicesSection}>
        {/* ... (tu contenido de servicesSection se mantiene igual) ... */}
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionHeading}>Nuestros Servicios</h2>
          <div className={styles.scrollWrapper}>
            <div className={styles.servicesScrollContainer} ref={servicesScrollRef}>
              {serviceCards.map((service, i) => (
                <div className={styles.serviceCard} key={i}>
                  <img src={service.src} alt={`Imagen de ${service.title}`} className={styles.serviceImage} />
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                </div>
              ))}
            </div>
            
            <div className={styles.scrollArrowsWrapper}>
                {/* Flecha Izquierda para Scroll */}
                <button className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`} onClick={scrollLeft} aria-label="Scroll Left">
                  <FaChevronLeft />
                </button>
                {/* Flecha Derecha para Scroll */}
                <button className={`${styles.scrollArrow} ${styles.scrollArrowRight}`} onClick={scrollRight} aria-label="Scroll Right">
                  <FaChevronRight />
                </button>
            </div> {/* Fin scrollArrowsWrapper */}

          </div>
        </div>
      </section>

      {/* Aquí agregamos el ícono del chatbot */}
      <ChatbotIcon />
    </div>
  );
}

export default App;
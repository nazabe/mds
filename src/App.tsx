import { Link } from 'react-router-dom'; // Importa Link para la navegación
// Importaciones necesarias de React y react-icons para el CONTENIDO DE LA LANDING
import { useRef } from 'react'; // Importa useRef para la sección de Servicios
import styles from './App.module.css'; // Importa estilos CSS Modules específicos de App

// Importa los iconos utilizados en las secciones de la landing page (Top Bar, Hero, About Us, Services)
// import {
//   FaMapMarkerAlt, FaEnvelope, FaFacebookF, FaInstagram, FaGoogle,
//   FaArrowRight, FaPhone, FaChevronLeft, FaChevronRight
//   // FaWhatsapp si lo usas en la Top Bar o About Us
// } from 'react-icons/fa';
import { FaMapMarkerAlt, FaArrowRight, FaPhone, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
// Si usas otros iconos en las secciones de la landing, impórtalos aquí


function App() {
  // ===================== Lógica de Scroll Horizontal para Servicios =====================
  // Ref para acceder al elemento DOM del contenedor de scroll de servicios
  const servicesScrollRef = useRef<HTMLDivElement>(null); // Especificamos que la referencia es para un div

  // Función para hacer scroll a la izquierda en la sección de Servicios
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
  // ===================== Fin Lógica de Scroll =====================


  // ===================== Renderizado del Componente App (Contenido de Landing Page) =====================
  // Este componente SÓLO renderiza el contenido único de la página principal (la landing).
  // El Header y el Footer se renderizan en el componente Layout que lo envuelve.
  return (
    // Un div principal para el contenido de App, usando estilos de App.module.css
    // No necesitamos el div styles.App que envolvía todo si el Layout ya provee un contenedor principal.
    // Sin embargo, si tus estilos .App en App.module.css aplican estilos de layout al contenido, mantenlo.
    // Por simplicidad, mantengamos el div styles.App aquí envolviendo el contenido específico de la landing.
    <div className={styles.App}> {/* Este div contiene las secciones de la landing */}
    
      {/* ===================== Hero Section ===================== */}
      {/* Sección principal con la imagen de fondo y el mensaje destacado */}
      <main className={styles.hero}> {/* Usamos <main> para semántica */}
        <div className={styles.heroContent}>
          <p className={styles.heroSubheading}>Ahora es el Turno de la Belleza</p>
          <h1 className={styles.heroHeading}>
            Reserva turnos con los mejores profesionales de la Belleza
          </h1>
          <p className={styles.heroDescription}>
            Descubre la belleza con nosotros. ¡Reserva tu turno hoy mismo!
          </p>
          <Link to="/reservar" className={styles.heroCtaButton}> {/* Enlace al la página de reserva */}
            Reservá tu turno <FaArrowRight />
          </Link>
        </div>
      </main> {/* Fin Hero */}

      {/* ===================== Sección: Sobre Nosotros ===================== */}
      {/* Contiene el texto, contacto, ubicación y mapa en columnas */}
      <section id="quienes-somos" className={styles.aboutUsSection}> {/* Usamos <section> para semántica, añadimos ID */}
        <div className={styles.sectionContent}> {/* Contenedor general centrado con padding */}

          <h2 className={styles.sectionHeading}>Sobre Nosotros</h2>

          {/* Contenedor para las dos columnas */}
          <div className={styles.aboutUsContentColumns}>

            {/* Columna Izquierda: Texto principal e información */}
            <div className={styles.aboutUsLeftColumn}>
              <p className={styles.sectionText}>
                Bienvenidos a Sentirse Bien, un espacio creado para reconectar con vos mismo,
                donde el bienestar del cuerpo y la mente es nuestra prioridad.
              </p>

              <p className={styles.sectionText}>
                Ubicados dentro del centro de salud integral <a href="URL_DE_ZENTITE" target="_blank" rel="noopener noreferrer">@zentitebienfisioterapia</a>, nuestro nuevo SPA combina técnicas tradicionales con terapias modernas para ofrecerte una experiencia de relajación completa. Desde un masaje energético para liberar tensiones acumuladas hasta una limpieza facial profunda que revitaliza tu piel, cada servicio fue pensado para vos.
              </p>

              <p className={styles.sectionText}>
                Nos especializamos en crear un ambiente íntimo, cálido y personalizado. Creemos que cada cuerpo habla, y estamos acá para escucharlo.
              </p>

              {/* Lista de preguntas con viñetas */}
              <ul className={styles.questionsList}>
                <li>¿Desconectar del estrés cotidiano?</li>
                <li>¿Buscar un momento solo para vos?</li>
                <li>¿Regalarle a alguien querido una experiencia única?</li>
              </ul>

              <p className={styles.sectionText}>
                ¡En Sentirse Bien lo vas a encontrar!
              </p>

            </div> {/* Fin Columna Izquierda */}

            {/* Columna Derecha: Contacto, Ubicación y Mapa */}
            <div className={styles.aboutUsRightColumn}>

              {/* Información de Contacto y Ubicación RESALTADA */}
              <div className={styles.contactInfoBlock}>
                {/* Bloque de Contacto */}
                <div className={styles.contactItem}>
                  {/* Contenedor para el ícono del teléfono/WhatsApp */}
                  <div className={styles.contactIconContainer}>
                     <FaPhone className={styles.contactIcon} /> {/* O FaWhatsapp */}
                  </div>
                  <p className={styles.contactText}>
                    Consultas y turnos al <a href="tel:+5491123152163">+54 911 23 152163</a>
                    {' '} (<a href="https://wa.me/5491123152163" target="_blank" rel="noopener noreferrer">Enviar WhatsApp</a>)
                  </p>
                </div>

                {/* Bloque de Ubicación */}
                <div className={styles.contactItem}>
                  {/* Contenedor para el ícono de ubicación */}
                   <div className={styles.contactIconContainer}>
                    <FaMapMarkerAlt className={styles.contactIcon} />
                   </div>
                  <p className={styles.contactText}>
                    Ubicados en Av. Rep Argentina y Humberto Primo, Resistencia - Chaco {/* <-- Dirección Corregida */}
                    {' '} (<a href="https://www.google.com/maps/search/?api=1&query=Santa+Fe+718,+Resistencia,+Chaco" target="_blank" rel="noopener noreferrer">Ver en Mapa</a>) {/* Verifica URL */}
                  </p>
                </div>
              </div> {/* Fin ContactInfoBlock */}

              {/* Recuadro del Mapa - Usando iFrame */}
              <div className={styles.mapContainer}>
                {/* Pega aquí el código <iframe> que copiaste de Google Maps */}
                {/* Asegúrate de reemplazar la URL con la correcta de tu mapa */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.8613488754554!2d-58.36822492425079!3d-34.809429972881176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32ca981f47a07%3A0x164bdc6890dda77c!2sAvenida%20Rep%C3%BAblica%20Argentina%20Y%20Humberto%20Primo!5e0!3m2!1ses-419!2sar!4v1745555820613!5m2!1ses-419!2sar" // <-- REEMPLAZA esta URL con la de tu iframe
                  width="100%"
                  height="100%" // Aseguramos que el iframe llene su contenedor
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div> {/* Fin MapContainer */}

              {/* Botón "Abrir en Maps" */}
              {/* Usamos un enlace <a> con estilo de botón */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Santa+Fe+718,+Resistencia,+Chaco" // Enlace para abrir en Google Maps (Verifica URL)
                target="_blank" // Abre en una nueva pestaña
                rel="noopener noreferrer"
                className={styles.openInMapsButton}
              >
                Abrir en Maps <FaArrowRight />
              </a>

            </div> {/* Fin Columna Derecha */}

          </div> {/* Fin aboutUsContentColumns */}

          {/* Último párrafo que abarca todo el ancho */}
          <p className={styles.sectionText} style={{ textAlign: 'center', marginTop: '30px' }}>
            Estamos ansiosos por verte, conocerte y ayudarte a sentirte mejor. Porque no se trata solo de verse bien... se trata de sentirse bien.
          </p>

        </div> {/* Fin sectionContent */}
      </section> {/* Fin About Us */}

      {/* ===================== Sección: Nuestros Servicios ===================== */}
      {/* Contiene el scroll horizontal de tarjetas de servicios */}
      <section id="profesionales" className={styles.servicesSection}> {/* Usamos <section>, añadimos ID */}
         <div className={styles.sectionContent}> {/* Contenedor centrado */}

          <h2 className={styles.sectionHeading}>Nuestros Servicios</h2>

          {/* Contenedor para el scroll horizontal y las flechas */}
          {/* Este div wrapper tiene position: relative para posicionar las flechas absolutas */}
          <div className={styles.scrollWrapper}>

            {/* Contenedor que habilita el scroll horizontal de las tarjetas */}
            {/* Le asignamos la referencia useRef para poder controlarlo con los botones */}
            <div className={styles.servicesScrollContainer} ref={servicesScrollRef}>

              {/* =============================================== */}
              {/* === Tarjetas Individuales para CADA Servicio === */}
              {/* Estos son placeholders. Luego se reemplazarán por componentes ServiceCard o se generarán dinámicamente. */}
              {/* =============================================== */}

              {/* --- Masajes --- */}
              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/woman-567021_1280.jpg"
                  alt="Imagen de Masaje Anti-stress"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Masaje Anti-stress</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/massage-2768832_1280.jpg"
                  alt="Imagen de Masaje Descontracturante"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Masaje Descontracturante</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/people-3184615_1280.jpg"
                  alt="Imagen de Masaje con Piedras Calientes"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Masaje con Piedras Calientes</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/massage-3795693_1280.jpg"
                  alt="Imagen de Masaje Circulatorio"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Masaje Circulatorio</h3>
              </div>

              {/* --- Belleza --- */}
              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/face-2722810_1280.jpg"
                  alt="Imagen de Lifting de Pestaña"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Lifting de Pestaña</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/ai-generated-8270432_1280.jpg"
                  alt="Imagen de Depilación Facial"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Depilación Facial</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/physical-therapy-2133286_1280.jpg"
                  alt="Imagen de Belleza de Manos y Pies"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Belleza de Manos y Pies</h3>
              </div>

              {/* --- Tratamientos Faciales --- */}
              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/831TreatmentShoot_Derma_0204.jpg"
                  alt="Imagen de Punta de Diamante Microexfoliación"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Punta de Diamante Microexfoliación</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/facial-8224799_1280.jpg"
                  alt="Imagen de Limpieza Profunda + Hidratación"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Limpieza Profunda + Hidratación</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/conoce-todo-sobre-la-radio-frecuencia-facial.jpg"
                  alt="Imagen de Crio Frecuencia Facial"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>Crio Frecuencia Facial</h3>
              </div>

              {/* --- Tratamientos Corporales --- */}
              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/m_116_1677502402.jpg"
                  alt="Imagen de VelaSlim"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>VelaSlim</h3>
              </div>

              <div className={styles.serviceCard}>
                <img
                  src="/mds/images/services/beautiful-young-woman-facial-treatment-beauty-salon-applying-cream_219728-3075.avif"
                  alt="Imagen de DermoHealth"
                  className={styles.serviceImage}
                />
                <h3 className={styles.serviceTitle}>DermoHealth</h3>
              </div>

                   


            </div> {/* Fin servicesScrollContainer */}

            {/* === NUEVO: Contenedor para centrar los botones de scroll === */}
            {/* Este div contendrá las dos flechas y lo centraremos */}
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

          </div> {/* Fin scrollWrapper (contenedor de scroll + flechas) */}


         </div> {/* Fin sectionContent */}
      </section> {/* Fin Sección Servicios */}

      {/* NOTA: El Footer GLOBAL YA NO ESTÁ AQUÍ. Se renderiza en el componente Layout. */}
      {/* Si tuvieras un footer que SÓLO aparece en la landing, podrías ponerlo aquí */}
       {/* <footer className={styles.landingFooter}>
         <div className={styles.sectionContent}>
           <p>© 2023 Tu Marca. Todos los derechos reservados.</p>
         </div>
       </footer> */}

    </div> // Fin styles.App div
  );
}

export default App; // Exporta el componente App

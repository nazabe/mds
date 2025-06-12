// src/components/BookingPage/BookingPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookingPage.module.css';
import { FaCheckCircle, FaRegCircle, FaHeart, FaClock, FaDollarSign, FaCalendarAlt, FaUserCircle, FaShoppingCart, FaPlus, FaArrowRight } from 'react-icons/fa'; // Añadidas FaShoppingCart, FaPlus, FaArrowRight
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

// Importa el hook useCart y la interfaz CartItem
import { useCart, CartItem } from '../Cart/CartContext'; // Asegúrate de que la ruta sea correcta

// --- Interfaces y Datos de Servicios Originales ---
interface Service {
  id: number;
  name: string;
  duration: string; // Ej: "50 minutos"
  price: string;    // Ej: "$12.000"
  icon?: React.ReactNode;
  imageUrl?: string;
}

const servicesData: Service[] = [
  { id: 1, name: "Masaje Anti-stress", duration: "50 minutos", price: "$12.000", icon: <FaHeart />, imageUrl: "/mds/images/services/massage-3795693_1280.jpg" },
  { id: 2, name: "Masaje Descontracturante", duration: "60 minutos", price: "$13.000", icon: <FaHeart />, imageUrl: "/mds/images/services/massage-2768832_1280.jpg" },
  { id: 3, name: "Masaje con Piedras Calientes", duration: "70 minutos", price: "$15.000", icon: <FaHeart />, imageUrl: "/mds/images/services/m_116_1677502402.jpg" },
  { id: 4, name: "Masaje Circulatorio", duration: "45 minutos", price: "$11.000", icon: <FaHeart />, imageUrl: "/mds/images/services/people-3184615_1280.jpg" },
  { id: 5, name: "Lifting de Pestaña", duration: "50 minutos", price: "$8.500", icon: <FaHeart />, imageUrl: "/mds/images/services/woman-567021_1280.jpg" },
  { id: 6, name: "Depilación Facial", duration: "25 minutos", price: "$4.000", icon: <FaHeart />, imageUrl: "/mds/images/services/beautiful-young-woman-facial-treatment-beauty-salon-applying-cream_219728-3075.avif" },
  { id: 7, name: "Belleza de Manos y Pies", duration: "90 minutos", price: "$10.000", icon: <FaHeart />, imageUrl: "/mds/images/services/physical-therapy-2133286_1280.jpg" },
  { id: 8, name: "Punta de Diamante Microexfoliación", duration: "60 minutos", price: "$9.500", icon: <FaHeart />, imageUrl: "/mds/images/services/831TreatmentShoot_Derma_0204.jpg" },
  { id: 9, name: "Limpieza Profunda + Hidratación", duration: "70 minutos", price: "$11.000", icon: <FaHeart />, imageUrl: "/mds/images/services/face-2722810_1280.jpg" },
  { id: 10, name: "Crio Frecuencia Facial", duration: "40 minutos", price: "$9.000", icon: <FaHeart />, imageUrl: "/mds/images/services/conoce-todo-sobre-la-radio-frecuencia-facial.jpg" },
  { id: 11, name: "VelaSlim", duration: "45 minutos", price: "$10.500", icon: <FaHeart />, imageUrl: "/mds/images/services/facial-8224799_1280.jpg" },
  { id: 12, name: "DermoHealth", duration: "40 minutos", price: "$9.000", icon: <FaHeart />, imageUrl: "/mds/images/services/ai-generated-8270432_1280.jpg" },
  { id: 13, name: "Criofrecuencia Corporal", duration: "XX minutos", price: "$XXXXX,XX", icon: <FaHeart />, imageUrl: "https://placehold.co/180x120/fdebf2/1a2a4d?text=Criofrecuencia+Corporal" },
  { id: 14, name: "Ultracavitación", duration: "XX minutos", price: "$XXXXX,XX", icon: <FaHeart />, imageUrl: "https://placehold.co/180x120/fdebf2/1a2a4d?text=Ultracavitación" }
];

// --- Nueva Interfaz y Datos para Profesionales (para compatibilidad con CartItem) ---
interface ProfessionalData {
    id: string; // ID único para el profesional (string)
    name: string;
    specialty: string; // Por ejemplo, "Masajes y Faciales", "Dermatología"
    // Puedes añadir más campos aquí como email, phone, etc.
}

const professionalsData: ProfessionalData[] = [
    { id: 'prof-1', name: 'Dra. López', specialty: 'Masajes y Faciales' },
    { id: 'prof-2', name: 'Dr. García', specialty: 'Dermatología' },
    { id: 'prof-3', name: 'Lic. Pérez', specialty: 'Nutrición' },
    // Añade más profesionales si los tienes
];


const BookingPage: React.FC = () => {
    // ===================== Estado del Componente =====================
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    // REMOVIDOS: formData, isClientLoggedIn, authFormData, authMessage (Paso 3)
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null); // Cambiado a ID de string
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null); // Estado para mensajes de éxito/error

    // Hooks de React Router y Cart Context
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Acceso al hook del carrito

    // ===================== Funciones Manejadoras de Eventos =====================

    const handleSelectService = (serviceId: number) => {
        setSelectedServiceId(serviceId);
        console.log("Servicio seleccionado ID:", serviceId);
        // Reiniciar selecciones dependientes al cambiar el servicio
        setSelectedProfessionalId(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setStatusMessage(null); // Limpiar mensaje de estado al iniciar nueva selección
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        console.log("Fecha seleccionada:", date);
        setSelectedTime(null);
        setStatusMessage(null); // Limpiar mensaje de estado al cambiar la fecha
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        console.log("Horario seleccionado:", time);
        setStatusMessage(null); // Limpiar mensaje de estado al cambiar la hora
    };

    // Modificado para usar ID de profesional (string)
    const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProfessionalId(e.target.value);
        console.log("Profesional seleccionado ID:", e.target.value);
        setSelectedDate(null);
        setSelectedTime(null);
        setStatusMessage(null); // Limpiar mensaje de estado al cambiar el profesional
    };

    // Modificada la función handleGoBack (ahora solo hay 2 pasos visibles)
    const handleGoBack = () => {
        if (selectedDate !== null && selectedTime !== null) { // Si estamos en el punto de seleccionar fecha/hora
            console.log("Volviendo al Paso 2 - deseleccionando fecha/hora");
            setSelectedDate(null);
            setSelectedTime(null);
        } else if (selectedProfessionalId !== null) { // Si estamos en el punto de seleccionar profesional
            console.log("Volviendo al Paso 2 - deseleccionando profesional");
            setSelectedProfessionalId(null);
            setSelectedDate(null); // Asegurarse
            setSelectedTime(null); // Asegurarse
        } else if (selectedServiceId !== null) { // Si estamos en el punto de seleccionar servicio
            console.log("Volviendo al Paso 1 - deseleccionando servicio");
            setSelectedServiceId(null);
        }
        setStatusMessage(null); // Limpiar mensaje de estado al retroceder
    };

    // NUEVO: Función para añadir la reserva al carrito
    const handleAddBookingToCart = () => {
        const selectedService = servicesData.find(s => s.id === selectedServiceId);
        const selectedProfessional = professionalsData.find(p => p.id === selectedProfessionalId);

        if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
            setStatusMessage({ type: 'error', message: "Por favor, complete todos los campos (Servicio, Profesional, Fecha y Hora) antes de añadir al carrito." });
            return;
        }

        // Convertir duration "XX minutos" a number
        const durationMatch = selectedService.duration.match(/(\d+)\s*minutos/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 0;

        // Convertir price "$X.XXX" a number
        const priceNumber = parseFloat(selectedService.price.replace(/[$.]/g, '').replace(',', '.')) || 0;


        const newCartItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // ID único para el ítem del carrito
            service: {
                id: String(selectedService.id), // Convierte a string para el carrito
                name: selectedService.name,
                price: priceNumber, // Ya es number
                durationMinutes: durationMinutes, // Ya es number
            },
            professional: {
                id: selectedProfessional.id, // ID de string
                name: selectedProfessional.name,
                specialty: selectedProfessional.specialty,
            },
            date: selectedDate.toISOString().split('T')[0], // Formatear Date a 'YYYY-MM-DD'
            time: selectedTime,
            quantity: 1, // Siempre 1 para una reserva individual
            notes: '', // No hay notas en este formulario, se puede añadir un campo si es necesario
        };

        addToCart(newCartItem);
        setStatusMessage({ type: 'success', message: "¡Reserva añadida al carrito exitosamente! Puede hacer otra reserva." });


        // Reiniciar el formulario para que el cliente pueda hacer otra reserva
        setSelectedServiceId(null);
        setSelectedProfessionalId(null);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    // NUEVO: Función para ir a la página del carrito
    const handleGoToCart = () => {
        navigate('/cart'); // Navega a la ruta del carrito
    };

    // ===================== Renderizado del Componente BookingPage =====================
    const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    const getSelectedServiceName = (id: number | null) => {
        if (id === null) return "Servicio no seleccionado";
        const service = servicesData.find(s => s.id === id);
        return service ? service.name : "Servicio desconocido";
    };

    // Show step 2 if a service is selected
    const showStep2 = selectedServiceId !== null;
    // showCartButtons significa que la reserva está lista para añadir al carrito
    const showCartButtons = selectedServiceId !== null && selectedProfessionalId !== null && selectedDate !== null && selectedTime !== null;


    return (
        <div className={styles.bookingPageContainer}>
            <h1 className={styles.pageTitle}>Reservar Turno</h1>

            {statusMessage && (
                <div className={`${styles.statusMessage} ${statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
                    {statusMessage.message}
                </div>
            )}

            {/* ===================== Bloque del Paso 1: Selección de Servicio ===================== */}
            <div className={styles.stepContainer}>
                <div className={styles.stepIndicator}>
                    {showStep2 ? (<FaCheckCircle className={`${styles.stepIcon} ${styles.stepIconCompleted}`} />) : (<FaRegCircle className={styles.stepIcon} />)}
                    <h2 className={styles.stepTitle}>Paso 1: Seleccione un Servicio</h2>
                    {selectedServiceId !== null && (<span className={styles.selectedServiceName}>: {getSelectedServiceName(selectedServiceId)}</span>)}
                </div>
                <div className={styles.servicesGallery}>
                    {servicesData.map(service => (
                        <div key={service.id} className={`${styles.serviceCard} ${selectedServiceId === service.id ? styles.selected : ''}`} onClick={() => handleSelectService(service.id)}>
                            {service.imageUrl && (<img src={service.imageUrl} alt={service.name} className={styles.serviceImage} onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = '/mds/images/services/placeholder.jpg'; }} />)}
                            {!service.imageUrl && service.icon && (<div className={styles.serviceIcon}>{service.icon}</div>)}
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <div className={styles.serviceInfo}>
                                <p className={styles.serviceDetail}><FaClock className={styles.infoIcon} />{service.duration}</p>
                                <p className={styles.serviceDetail}><FaDollarSign className={styles.infoIcon} />{service.price}</p>
                            </div>
                            {selectedServiceId === service.id && (<div className={styles.selectedIndicator}><FaCheckCircle className={styles.checkIcon} /></div>)}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===================== Bloque del Paso 2: Selección de Profesional, Fecha y Hora ===================== */}
            {showStep2 && (
                <div className={styles.stepContainer}>
                    <div className={styles.stepIndicator}>
                        {showCartButtons ? (<FaCheckCircle className={`${styles.stepIcon} ${styles.stepIconCompleted}`} />) : (<FaCalendarAlt className={styles.stepIcon} />)}
                        <h2 className={styles.stepTitle}>Paso 2: Seleccione Profesional, Fecha y Hora</h2>
                    </div>

                    <div className={styles.professionalSelectionContainer}>
                        <label htmlFor="professionalSelect" className={styles.dateLabel}>Seleccione profesional a elección</label>
                        <select
                            id="professionalSelect"
                            className={styles.dateInput}
                            value={selectedProfessionalId || ''} // Usar ID aquí
                            onChange={handleProfessionalChange}
                        >
                            <option value="">-- Seleccione un profesional --</option>
                            {/* Mapear los profesionales con sus IDs */}
                            {professionalsData.map(prof => (
                                <option key={prof.id} value={prof.id}>{prof.name} - {prof.specialty}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.dateSelectionContainer}>
                        <label className={styles.dateLabel}>Fecha</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy/MM/dd"
                            className={styles.dateInput}
                            minDate={new Date()}
                            placeholderText="Seleccione una fecha"
                            isClearable
                            disabled={selectedProfessionalId === null}
                        />
                    </div>
                    
                    <div className={styles.timeSelectionContainer}>
                        <h3 className={styles.timesTitle}>Horarios disponibles:</h3>
                        {selectedProfessionalId === null ? (
                            <p>Seleccione un profesional para ver los horarios disponibles.</p>
                        ) : selectedDate === null ? (
                            <p>Seleccione una fecha para ver los horarios disponibles.</p>
                        ) : (
                            <div className={styles.timeSlotsGrid}>
                                {availableTimes.length > 0 ? (
                                    availableTimes.map(time => (
                                        <button key={time} className={`${styles.timeSlotButton} ${selectedTime === time ? styles.selectedTime : ''}`} onClick={() => handleSelectTime(time)}>{time}</button>
                                    ))
                                ) : (
                                    <p>No hay horarios disponibles para esta fecha con este profesional.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.bookingActions}>
                        {/* Botones de acción del carrito */}
                        <button
                            onClick={handleAddBookingToCart}
                            className={styles.addToCartButton}
                            disabled={!showCartButtons} // Habilitar solo si todo está seleccionado
                        >
                            <FaPlus className={styles.buttonIcon} /> Añadir al Carrito y Hacer Otra Reserva
                        </button>
                        <button
                            onClick={() => { handleAddBookingToCart(); handleGoToCart(); }}
                            className={styles.goToCartButton}
                            disabled={!showCartButtons} // Habilitar solo si todo está seleccionado
                        >
                            <FaShoppingCart className={styles.buttonIcon} /> Finalzar Reserva y Pagar
                        </button>
                        <button className={styles.backButton} onClick={handleGoBack}>Volver</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;

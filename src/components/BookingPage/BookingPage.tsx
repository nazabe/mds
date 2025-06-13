// src/components/BookingPage/BookingPage.tsx
import React, { useState, useEffect } from 'react'; // useEffect añadido
import { useNavigate } from 'react-router-dom';
import styles from './BookingPage.module.css';
import { FaCheckCircle, FaRegCircle, FaHeart, FaClock, FaDollarSign, FaCalendarAlt, FaShoppingCart, FaPlus } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useCart, CartItem } from '../Cart/CartContext';

// --- Interfaz para un Servicio (adaptada para la API y el Carrito) ---
interface Service {
  id: string; // El ID de la API (convertido a string)
  name: string;
  description: string; // Aunque no se muestre prominentemente, es bueno tenerlo
  price: number; // Precio como número
  durationMinutes: number; // Duración como número de minutos
  imageUrl?: string;
}

// Interfaz para el objeto que devuelve la API /listaServicio
// (Similar a la usada en ServiceManagement)
interface ApiService {
  id: string | number;
  nombre: string;
  precio: number;
  tiempo: number;
  // La API no especifica 'descripcion' o 'imageUrl' en /listaServicio
  descripcion?: string; 
  imageUrl?: string;
}

const API_BASE_URL = 'https://web-spa-hjzu.onrender.com';

// --- Datos para Profesionales (se mantienen hardcodeados por ahora) ---
interface ProfessionalData {
    id: string;
    name: string;
    specialty: string;
}

const professionalsData: ProfessionalData[] = [
    { id: 'prof-1', name: 'Dra. López', specialty: 'Masajes y Faciales' },
    { id: 'prof-2', name: 'Dr. García', specialty: 'Dermatología' },
    { id: 'prof-3', name: 'Lic. Pérez', specialty: 'Nutrición' },
];


const BookingPage: React.FC = () => {
    // ===================== Estado del Componente =====================
    const [services, setServices] = useState<Service[]>([]); // Estado para servicios cargados de la API
    const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true); // Estado de carga para servicios
    
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null); // Cambiado a string
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const navigate = useNavigate();
    const { addToCart } = useCart();

    // ===================== Carga de Servicios desde la API =====================
    useEffect(() => {
        const fetchServicesFromApi = async () => {
            setIsLoadingServices(true);
            setStatusMessage(null);
            try {
                const response = await fetch(`${API_BASE_URL}/listaServicio`);
                if (!response.ok) {
                    throw new Error(`Error al cargar servicios: ${response.statusText}`);
                }
                const apiData: ApiService[] = await response.json();
                
                const loadedServices: Service[] = apiData.map(apiService => ({
                    id: String(apiService.id),
                    name: apiService.nombre,
                    description: apiService.descripcion || 'Descripción no detallada.', // Valor por defecto
                    price: apiService.precio,
                    durationMinutes: apiService.tiempo,
                    imageUrl: apiService.imageUrl || `https://placehold.co/180x120/fdebf2/1a2a4d?text=${encodeURIComponent(apiService.nombre)}`
                }));
                setServices(loadedServices);
            } catch (error) {
                console.error("Error fetching services for BookingPage:", error);
                setStatusMessage({ type: 'error', message: error instanceof Error ? error.message : 'Error al cargar servicios.' });
                setServices([]);
            } finally {
                setIsLoadingServices(false);
            }
        };

        fetchServicesFromApi();
    }, []); // El array vacío asegura que se ejecute solo al montar el componente


    // ===================== Funciones Manejadoras de Eventos =====================
    const handleSelectService = (serviceId: string) => { // Acepta string
        setSelectedServiceId(serviceId);
        setSelectedProfessionalId(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setStatusMessage(null);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setStatusMessage(null);
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        setStatusMessage(null);
    };

    const handleProfessionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProfessionalId(e.target.value);
        setSelectedDate(null);
        setSelectedTime(null);
        setStatusMessage(null);
    };

    const handleGoBack = () => {
        if (selectedDate !== null || selectedTime !== null) {
            setSelectedDate(null);
            setSelectedTime(null);
        } else if (selectedProfessionalId !== null) {
            setSelectedProfessionalId(null);
        } else if (selectedServiceId !== null) {
            setSelectedServiceId(null);
        }
        setStatusMessage(null);
    };

    const handleAddBookingToCart = () => {
        // Encontrar el servicio usando el ID (string) del estado 'services'
        const selectedService = services.find(s => s.id === selectedServiceId);
        const selectedProfessional = professionalsData.find(p => p.id === selectedProfessionalId);

        if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
            setStatusMessage({ type: 'error', message: "Por favor, complete todos los campos (Servicio, Profesional, Fecha y Hora) antes de añadir al carrito." });
            return;
        }

        const newCartItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            service: { // Los datos del servicio ya están en el formato correcto
                id: selectedService.id,
                name: selectedService.name,
                price: selectedService.price,
                durationMinutes: selectedService.durationMinutes,
            },
            professional: {
                id: selectedProfessional.id,
                name: selectedProfessional.name,
                specialty: selectedProfessional.specialty,
            },
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            quantity: 1,
            notes: '', 
        };

        addToCart(newCartItem);
        setStatusMessage({ type: 'success', message: "¡Reserva añadida al carrito exitosamente! Puede hacer otra reserva." });

        setSelectedServiceId(null);
        setSelectedProfessionalId(null);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    // ===================== Renderizado del Componente BookingPage =====================
    const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    const getSelectedServiceName = (id: string | null) => { // Acepta string
        if (id === null) return "Servicio no seleccionado";
        const service = services.find(s => s.id === id); // Busca en el estado 'services'
        return service ? service.name : "Servicio desconocido";
    };

    const showStep2 = selectedServiceId !== null;
    const showCartButtons = selectedServiceId !== null && selectedProfessionalId !== null && selectedDate !== null && selectedTime !== null;

    if (isLoadingServices) {
        return (
            <div className={styles.bookingPageContainer}>
                <h1 className={styles.pageTitle}>Reservar Turno</h1>
                <div className={styles.loadingMessage}>Cargando servicios...</div>
            </div>
        );
    }
    
    if (!isLoadingServices && services.length === 0 && !statusMessage?.message.includes("Error")) {
        return (
            <div className={styles.bookingPageContainer}>
                <h1 className={styles.pageTitle}>Reservar Turno</h1>
                <div className={styles.infoMessage}>No hay servicios disponibles en este momento. Por favor, intente más tarde.</div>
            </div>
        );
    }


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
                {services.length > 0 ? (
                    <div className={styles.servicesGallery}>
                        {services.map(service => ( // Iterar sobre el estado 'services'
                            <div key={service.id} className={`${styles.serviceCard} ${selectedServiceId === service.id ? styles.selected : ''}`} onClick={() => handleSelectService(service.id)}>
                                {service.imageUrl && (
                                    <img 
                                        src={service.imageUrl} 
                                        alt={service.name} 
                                        className={styles.serviceImage} 
                                        onError={(e) => { 
                                            const target = e.target as HTMLImageElement; 
                                            target.onerror = null; 
                                            target.src = `https://placehold.co/180x120/cccccc/333333?text=Imagen+no+disponible`; // Placeholder mejorado
                                        }} 
                                    />
                                )}
                                {/* El ícono genérico <FaHeart /> se puede añadir aquí si se desea para todos */}
                                {/* {!service.imageUrl && (<div className={styles.serviceIcon}><FaHeart /></div>)} */}
                                <h3 className={styles.serviceName}>{service.name}</h3>
                                <div className={styles.serviceInfo}>
                                    <p className={styles.serviceDetail}><FaClock className={styles.infoIcon} />{service.durationMinutes} minutos</p>
                                    <p className={styles.serviceDetail}><FaDollarSign className={styles.infoIcon} />${service.price.toLocaleString('es-AR')}</p> {/* Formatear precio */}
                                </div>
                                {selectedServiceId === service.id && (<div className={styles.selectedIndicator}><FaCheckCircle className={styles.checkIcon} /></div>)}
                            </div>
                        ))}
                    </div>
                ) : (
                    !isLoadingServices && <p>No hay servicios disponibles para mostrar.</p>
                )}
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
                            value={selectedProfessionalId || ''}
                            onChange={handleProfessionalChange}
                        >
                            <option value="">-- Seleccione un profesional --</option>
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
                        <button
                            onClick={handleAddBookingToCart}
                            className={styles.addToCartButton}
                            disabled={!showCartButtons}
                        >
                            <FaPlus className={styles.buttonIcon} /> Añadir al Carrito y Hacer Otra Reserva
                        </button>
                        <button
                            onClick={() => { if(showCartButtons) { handleAddBookingToCart(); handleGoToCart(); } }} // Prevenir error si se hace clic antes
                            className={styles.goToCartButton}
                            disabled={!showCartButtons}
                        >
                            <FaShoppingCart className={styles.buttonIcon} /> Finalizar Reserva y Pagar
                        </button>
                        <button className={styles.backButton} onClick={handleGoBack}>Volver</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingPage;
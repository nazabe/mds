// src/components/MyAppointments/MyAppointments.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyAppointments.module.css'; // Asegúrate que esta ruta es correcta
import { FaCalendarCheck, FaUserMd, FaConciergeBell, FaClock, FaStickyNote, FaPhone, FaEnvelope } from 'react-icons/fa'; // Añadidos más iconos

// Interfaz para un Servicio (usaremos la misma estructura que ya tienes)
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
}

// Interfaz para un Profesional (usaremos la misma estructura que ya tienes)
interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

// Interfaz para un Turno
interface Appointment {
  id: string;
  clientId: string; // ID del cliente que reserva (simulado por ahora)
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string; // Formato "YYYY-MM-DD"
  time: string; // Formato "HH:MM"
  notes?: string;
}

const MyAppointments: React.FC = () => {
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loggedInProfessionalId, setLoggedInProfessionalId] = useState<string | null>(null);
  const [loggedInProfessionalName, setLoggedInProfessionalName] = useState<string | null>(null);

  const mockServices: Service[] = [
    { id: 'service-1', name: "Masaje Anti-stress", description: "", price: 0, durationMinutes: 50 },
    { id: 'service-2', name: "Masaje Descontracturante", description: "", price: 0, durationMinutes: 60 },
    { id: 'service-5', name: "Lifting de Pestaña", description: "", price: 0, durationMinutes: 50 },
    { id: 'service-8', name: "Punta de Diamante Microexfoliación", description: "", price: 0, durationMinutes: 60 },
    { id: 'service-11', name: "VelaSlim", description: "", price: 0, durationMinutes: 45 },
  ];

  const mockProfessionals: Professional[] = [
    { id: 'prof-1', name: 'Dra. Ana Felicidad', specialty: 'Masajes y Faciales', email: 'ana.felicidad@spa.com', phone: '1111111111' },
    { id: 'prof-2', name: 'Dra. López', specialty: 'Medicina Estética', email: 'dra.lopez@spa.com', phone: '2222222222' },
    { id: 'prof-3', name: 'Dr. García', specialty: 'Dermatología', email: 'dr.garcia@spa.com', phone: '3333333333' },
    { id: 'prof-4', name: 'Lic. Pérez', specialty: 'Nutrición', email: 'lic.perez@spa.com', phone: '4444444444' },
  ];

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmailForProfessional');
    let currentProfessionalId: string | null = null;
    let currentProfessionalName: string | null = null;

    if (userEmail) {
      const foundProf = mockProfessionals.find(p => p.email === userEmail);
      if (foundProf) {
        currentProfessionalId = foundProf.id;
        currentProfessionalName = foundProf.name;
      }
    }

    if (!currentProfessionalId) {
        currentProfessionalId = 'prof-1'; // Default para demostración
        const defaultProf = mockProfessionals.find(p => p.id === currentProfessionalId);
        currentProfessionalName = defaultProf ? defaultProf.name : 'Profesional Desconocido';
        console.warn(`No se pudo determinar el profesional logeado por email "${userEmail}", usando '${currentProfessionalName}' (ID: ${currentProfessionalId}) por defecto.`);
    }

    setLoggedInProfessionalId(currentProfessionalId);
    setLoggedInProfessionalName(currentProfessionalName);

    const allAppointments: Appointment[] = [
      { id: 'appt-1', clientId: 'client-101', clientName: 'María García', clientEmail: 'maria.g@example.com', clientPhone: '3624112233', serviceId: 'service-1', professionalId: 'prof-1', date: '2025-05-25', time: '10:00', notes: 'Cliente habitual, prefiere música suave.' },
      { id: 'appt-2', clientId: 'client-102', clientName: 'Carlos Ruiz', clientEmail: 'carlos.r@example.com', clientPhone: '3624445566', serviceId: 'service-5', professionalId: 'prof-2', date: '2025-05-26', time: '14:30', notes: 'Primera consulta, preguntar por alergias.' },
      { id: 'appt-3', clientId: 'client-103', clientName: 'Laura Fernández', clientEmail: 'laura.f@example.com', clientPhone: '3624778899', serviceId: 'service-1', professionalId: 'prof-1', date: '2025-05-25', time: '11:00', notes: 'Trae cupón de descuento.' },
      { id: 'appt-4', clientId: 'client-104', clientName: 'Juan Pérez', clientEmail: 'juan.p@example.com', clientPhone: '3624001122', serviceId: 'service-8', professionalId: 'prof-3', date: '2025-05-27', time: '09:00', notes: '' },
      { id: 'appt-5', clientId: 'client-105', clientName: 'Sofía Díaz', clientEmail: 'sofia.d@example.com', clientPhone: '3624334455', serviceId: 'service-11', professionalId: 'prof-1', date: '2025-05-28', time: '16:00', notes: 'Confirmar asistencia por WhatsApp el día anterior.' },
    ];

    const filteredAppointments = allAppointments.filter(
      appt => appt.professionalId === currentProfessionalId
    );
    setMyAppointments(filteredAppointments);
  }, []);

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio Desconocido';
  };

  const getServiceDuration = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? `${service.durationMinutes} min` : 'N/A';
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', options); // Asegurar que se interprete como local
  };


  return (
    <div className={styles.myAppointmentsContainer}>
      <h1 className={styles.title}>Mis Turnos</h1>
      {loggedInProfessionalName && (
        <p className={styles.subtitle}>Agenda de: <strong>{loggedInProfessionalName}</strong></p>
      )}

      {myAppointments.length === 0 ? (
        <p className={styles.noAppointmentsMessage}>No tienes turnos agendados por el momento.</p>
      ) : (
        <ul className={styles.appointmentsList}>
          {myAppointments.map(appt => (
            <li key={appt.id} className={styles.appointmentItem}>
              <div className={styles.appointmentHeader}>
                <FaUserMd className={styles.itemIcon} /> {/* Cambiado a FaUserMd para cliente */}
                <h3 className={styles.itemTitle}>Turno con: {appt.clientName}</h3>
              </div>
              <div className={styles.appointmentDetails}>
                <p><FaConciergeBell /> <strong>Servicio:</strong> {getServiceName(appt.serviceId)}</p>
                <p><FaClock /> <strong>Duración:</strong> {getServiceDuration(appt.serviceId)}</p>
                <p><FaCalendarCheck /> <strong>Fecha:</strong> {formatDate(appt.date)}</p>
                <p><FaClock /> <strong>Hora:</strong> {appt.time} hs</p>
                {appt.notes && <p><FaStickyNote /> <strong>Notas:</strong> {appt.notes}</p>}
                
                <div className={styles.clientContact}>
                    <p><FaEnvelope/> <strong>Email:</strong> {appt.clientEmail}</p>
                    <p><FaPhone/> <strong>Teléfono:</strong> {appt.clientPhone}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
// src/components/MyAppointments/MyAppointments.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyAppointments.module.css';
import { FaCalendarCheck, FaUserMd, FaConciergeBell, FaClock } from 'react-icons/fa';

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
  // Estado para la lista de turnos del profesional logeado
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  // Estado para el ID del profesional logeado (simulado por ahora)
  // En un escenario real, esto vendría del contexto de autenticación o de un token.
  const [loggedInProfessionalId, setLoggedInProfessionalId] = useState<string | null>(null);
  const [loggedInProfessionalName, setLoggedInProfessionalName] = useState<string | null>(null);

  // Datos simulados para selectores de servicios y profesionales
  // En una aplicación real, estos se cargarían de sus respectivas gestiones o APIs
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

  // Simulación de carga inicial de turnos y determinación del profesional logeado
  useEffect(() => {
    // Simular el ID del profesional logeado basado en el email usado en LoginPage.tsx
    // En un sistema real, esto vendría de un token JWT o un contexto de usuario
    const userEmail = localStorage.getItem('userEmailForProfessional'); // Asume que guardaste el email al logearte
    let currentProfessionalId: string | null = null;
    let currentProfessionalName: string | null = null;

    if (userEmail) {
      const foundProf = mockProfessionals.find(p => p.email === userEmail);
      if (foundProf) {
        currentProfessionalId = foundProf.id;
        currentProfessionalName = foundProf.name;
      }
    }

    // Si no se encontró un email o ID, por defecto usamos 'prof-1' para demostración
    if (!currentProfessionalId) {
        currentProfessionalId = 'prof-1';
        currentProfessionalName = 'Dra. Ana Felicidad';
        console.warn("No se pudo determinar el profesional logeado, usando 'Dra. Ana Felicidad' por defecto.");
    }

    setLoggedInProfessionalId(currentProfessionalId);
    setLoggedInProfessionalName(currentProfessionalName);

    // Simulación de todos los turnos (en un backend real, harías un fetch filtrado)
    const allAppointments: Appointment[] = [
      {
        id: 'appt-1',
        clientId: 'client-101',
        clientName: 'María García',
        clientEmail: 'maria.g@example.com',
        clientPhone: '3624112233',
        serviceId: 'service-1',
        professionalId: 'prof-1', // Dra. Ana Felicidad
        date: '2025-05-25',
        time: '10:00',
        notes: 'Cliente habitual'
      },
      {
        id: 'appt-2',
        clientId: 'client-102',
        clientName: 'Carlos Ruiz',
        clientEmail: 'carlos.r@example.com',
        clientPhone: '3624445566',
        serviceId: 'service-5',
        professionalId: 'prof-2', // Dra. López
        date: '2025-05-26',
        time: '14:30',
        notes: 'Primera consulta'
      },
      {
        id: 'appt-3',
        clientId: 'client-103',
        clientName: 'Laura Fernández',
        clientEmail: 'laura.f@example.com',
        clientPhone: '3624778899',
        serviceId: 'service-1',
        professionalId: 'prof-1', // Dra. Ana Felicidad
        date: '2025-05-25',
        time: '11:00',
        notes: 'Trae cupón'
      },
      {
        id: 'appt-4',
        clientId: 'client-104',
        clientName: 'Juan Pérez',
        clientEmail: 'juan.p@example.com',
        clientPhone: '3624001122',
        serviceId: 'service-8',
        professionalId: 'prof-3', // Dr. García
        date: '2025-05-27',
        time: '09:00',
        notes: ''
      },
      {
        id: 'appt-5',
        clientId: 'client-105',
        clientName: 'Sofía Díaz',
        clientEmail: 'sofia.d@example.com',
        clientPhone: '3624334455',
        serviceId: 'service-11',
        professionalId: 'prof-1', // Dra. Ana Felicidad
        date: '2025-05-28',
        time: '16:00',
        notes: 'Confirmar por WhatsApp'
      },
    ];

    // Filtra los turnos para mostrar solo los del profesional logeado
    const filteredAppointments = allAppointments.filter(
      appt => appt.professionalId === currentProfessionalId
    );
    setMyAppointments(filteredAppointments);
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función auxiliar para obtener el nombre del servicio por su ID
  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio Desconocido';
  };

  // Función auxiliar para obtener la duración del servicio por su ID
  const getServiceDuration = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? `${service.durationMinutes} min` : 'N/A';
  };

  return (
    <div className={styles.myAppointmentsContainer}>
      <h1 className={styles.title}>Mis Turnos</h1>
      {loggedInProfessionalName && (
        <p className={styles.subtitle}>Agenda de {loggedInProfessionalName}</p>
      )}

      {myAppointments.length === 0 ? (
        <p className={styles.noAppointmentsMessage}>No tienes turnos agendados por el momento.</p>
      ) : (
        <ul className={styles.appointmentsList}>
          {myAppointments.map(appt => (
            <li key={appt.id} className={styles.appointmentItem}>
              <div className={styles.appointmentHeader}>
                <FaCalendarCheck className={styles.itemIcon} />
                <h3 className={styles.itemTitle}>Turno con {appt.clientName}</h3>
              </div>
              <div className={styles.appointmentDetails}>
                <p><strong><FaConciergeBell /> Servicio:</strong> {getServiceName(appt.serviceId)}</p>
                <p><strong><FaClock /> Duración:</strong> {getServiceDuration(appt.serviceId)}</p>
                <p><strong>Fecha:</strong> {appt.date}</p>
                <p><strong>Hora:</strong> {appt.time}</p>
                {appt.notes && <p><strong>Notas:</strong> {appt.notes}</p>}
                <p className={styles.clientContact}>
                  <strong>Contacto:</strong> {appt.clientEmail} | {appt.clientPhone}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;

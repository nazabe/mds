// src/components/AppointmentManagement/AppointmentManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './AppointmentManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

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

const AppointmentManagement: React.FC = () => {
  // Estado para la lista de turnos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para el turno que se está editando (o null si no se edita ninguno)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  // Estado para los datos del nuevo turno
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    clientId: 'client-1', // ID de cliente simulado
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: '',
    professionalId: '',
    date: '',
    time: '',
    notes: ''
  });
  // Estado para manejar mensajes de error o éxito
  const [message, setMessage] = useState<string | null>(null);

  // Datos simulados para selectores de servicios y profesionales
  // En una aplicación real, estos se cargarían de sus respectivas gestiones o APIs
  const mockServices: Service[] = [
    { id: 'service-1', name: "Masaje Anti-stress", description: "", price: 0, durationMinutes: 0 },
    { id: 'service-2', name: "Masaje Descontracturante", description: "", price: 0, durationMinutes: 0 },
    { id: 'service-5', name: "Lifting de Pestaña", description: "", price: 0, durationMinutes: 0 },
    { id: 'service-8', name: "Punta de Diamante Microexfoliación", description: "", price: 0, durationMinutes: 0 },
    { id: 'service-11', name: "VelaSlim", description: "", price: 0, durationMinutes: 0 },
  ];

  const mockProfessionals: Professional[] = [
    { id: 'prof-1', name: 'Dra. Ana Felicidad', specialty: 'Masajes y Faciales', email: '', phone: '' },
    { id: 'prof-2', name: 'Dra. López', specialty: 'Medicina Estética', email: '', phone: '' },
    { id: 'prof-3', name: 'Dr. García', specialty: 'Dermatología', email: '', phone: '' },
    { id: 'prof-4', name: 'Lic. Pérez', specialty: 'Nutrición', email: '', phone: '' },
  ];

  // Simulación de carga inicial de turnos
  useEffect(() => {
    const loadedAppointments: Appointment[] = [
      {
        id: 'appt-1',
        clientId: 'client-101',
        clientName: 'María García',
        clientEmail: 'maria.g@example.com',
        clientPhone: '3624112233',
        serviceId: 'service-1',
        professionalId: 'prof-1',
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
        professionalId: 'prof-2',
        date: '2025-05-26',
        time: '14:30',
        notes: ''
      },
    ];
    setAppointments(loadedAppointments);
  }, []);

  // Función auxiliar para obtener el nombre del servicio por su ID
  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio Desconocido';
  };

  // Función auxiliar para obtener el nombre del profesional por su ID
  const getProfessionalName = (professionalId: string) => {
    const professional = mockProfessionals.find(p => p.id === professionalId);
    return professional ? professional.name : 'Profesional Desconocido';
  };

  // Maneja el cambio en los campos del formulario de nuevo turno
  const handleNewAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  // Maneja el cambio en los campos del formulario de edición
  const handleEditingAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingAppointment) {
      setEditingAppointment(prev => (prev ? { ...prev, [name]: value } : null));
    }
  };

  // Añade un nuevo turno
  const handleAddAppointment = () => {
    if (!newAppointment.clientName || !newAppointment.serviceId || !newAppointment.professionalId || !newAppointment.date || !newAppointment.time) {
      setMessage('Todos los campos obligatorios deben ser completados.');
      return;
    }
    const id = `appt-${Date.now()}`; // Genera un ID simple
    const appointmentToAdd = { ...newAppointment, id };
    setAppointments(prev => [...prev, appointmentToAdd]);
    setNewAppointment({ // Limpia el formulario
      clientId: 'client-1',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      serviceId: '',
      professionalId: '',
      date: '',
      time: '',
      notes: ''
    });
    setMessage('Turno añadido con éxito.');
  };

  // Inicia la edición de un turno
  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment({ ...appointment }); // Crea una copia para editar
  };

  // Guarda los cambios de un turno editado
  const handleSaveEdit = () => {
    if (editingAppointment) {
      if (!editingAppointment.clientName || !editingAppointment.serviceId || !editingAppointment.professionalId || !editingAppointment.date || !editingAppointment.time) {
        setMessage('Todos los campos obligatorios deben ser completados.');
        return;
      }
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === editingAppointment.id ? editingAppointment : appt
        )
      );
      setEditingAppointment(null); // Sale del modo edición
      setMessage('Cambios guardados con éxito.');
    }
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setMessage(null);
  };

  // Elimina un turno
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      setAppointments(prev => prev.filter(appt => appt.id !== id));
      setMessage('Turno eliminado.');
    }
  };

  return (
    <div className={styles.appointmentManagementContainer}>
      <h1 className={styles.title}>Gestión de Turnos</h1>

      {message && <div className={styles.message}>{message}</div>}

      {/* Formulario para añadir nuevo turno */}
      <div className={styles.addAppointmentSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Turno</h2>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="clientName"
            placeholder="Nombre del Cliente"
            value={newAppointment.clientName}
            onChange={handleNewAppointmentChange}
            className={styles.inputField}
            required
          />
          <input
            type="email"
            name="clientEmail"
            placeholder="Email del Cliente (opcional)"
            value={newAppointment.clientEmail}
            onChange={handleNewAppointmentChange}
            className={styles.inputField}
          />
          <input
            type="tel"
            name="clientPhone"
            placeholder="Teléfono del Cliente (opcional)"
            value={newAppointment.clientPhone}
            onChange={handleNewAppointmentChange}
            className={styles.inputField}
          />
          <select
            name="serviceId"
            value={newAppointment.serviceId}
            onChange={handleNewAppointmentChange}
            className={styles.selectField}
            required
          >
            <option value="">Seleccione un Servicio</option>
            {mockServices.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          <select
            name="professionalId"
            value={newAppointment.professionalId}
            onChange={handleNewAppointmentChange}
            className={styles.selectField}
            required
          >
            <option value="">Seleccione un Profesional</option>
            {mockProfessionals.map(professional => (
              <option key={professional.id} value={professional.id}>{professional.name}</option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={newAppointment.date}
            onChange={handleNewAppointmentChange}
            className={styles.inputField}
            required
          />
          <input
            type="time"
            name="time"
            value={newAppointment.time}
            onChange={handleNewAppointmentChange}
            className={styles.inputField}
            required
          />
          <textarea
            name="notes"
            placeholder="Notas (opcional)"
            value={newAppointment.notes}
            onChange={handleNewAppointmentChange}
            className={styles.textareaField}
            rows={2}
          />
          <button onClick={handleAddAppointment} className={styles.addButton}>
            <FaPlus /> Añadir Turno
          </button>
        </div>
      </div>

      {/* Lista de turnos existentes */}
      <div className={styles.appointmentsListSection}>
        <h2 className={styles.sectionTitle}>Turnos Existentes</h2>
        {appointments.length === 0 ? (
          <p>No hay turnos registrados.</p>
        ) : (
          <ul className={styles.appointmentList}>
            {appointments.map(appt => (
              <li key={appt.id} className={styles.appointmentItem}>
                {editingAppointment && editingAppointment.id === appt.id ? (
                  // Modo edición
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      name="clientName"
                      value={editingAppointment.clientName}
                      onChange={handleEditingAppointmentChange}
                      className={styles.inputField}
                      required
                    />
                    <input
                      type="email"
                      name="clientEmail"
                      value={editingAppointment.clientEmail}
                      onChange={handleEditingAppointmentChange}
                      className={styles.inputField}
                    />
                    <input
                      type="tel"
                      name="clientPhone"
                      value={editingAppointment.clientPhone}
                      onChange={handleEditingAppointmentChange}
                      className={styles.inputField}
                    />
                    <select
                      name="serviceId"
                      value={editingAppointment.serviceId}
                      onChange={handleEditingAppointmentChange}
                      className={styles.selectField}
                      required
                    >
                      {mockServices.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                    <select
                      name="professionalId"
                      value={editingAppointment.professionalId}
                      onChange={handleEditingAppointmentChange}
                      className={styles.selectField}
                      required
                    >
                      {mockProfessionals.map(professional => (
                        <option key={professional.id} value={professional.id}>{professional.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      name="date"
                      value={editingAppointment.date}
                      onChange={handleEditingAppointmentChange}
                      className={styles.inputField}
                      required
                    />
                    <input
                      type="time"
                      name="time"
                      value={editingAppointment.time}
                      onChange={handleEditingAppointmentChange}
                      className={styles.inputField}
                      required
                    />
                    <textarea
                      name="notes"
                      value={editingAppointment.notes || ''}
                      onChange={handleEditingAppointmentChange}
                      className={styles.textareaField}
                      rows={2}
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveEdit} className={`${styles.actionButton} ${styles.saveButton}`}>
                        <FaSave /> Guardar
                      </button>
                      <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className={styles.appointmentDetails}>
                    <p><strong>Cliente:</strong> {appt.clientName}</p>
                    <p><strong>Servicio:</strong> {getServiceName(appt.serviceId)}</p>
                    <p><strong>Profesional:</strong> {getProfessionalName(appt.professionalId)}</p>
                    <p><strong>Fecha:</strong> {appt.date}</p>
                    <p><strong>Hora:</strong> {appt.time}</p>
                    {appt.notes && <p><strong>Notas:</strong> {appt.notes}</p>}
                    <div className={styles.actions}>
                      <button onClick={() => handleEditClick(appt)} className={`${styles.actionButton} ${styles.editButton}`}>
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteAppointment(appt.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;

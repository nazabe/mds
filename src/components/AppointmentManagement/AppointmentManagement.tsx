// src/components/AppointmentManagement/AppointmentManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './AppointmentManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

// URL base de tu API
const API_BASE_URL = 'https://web-spa-hjzu.onrender.com';

// --- INTERFACES ALINEADAS CON LA API ---

// Interfaz para un Servicio (según /listaServicio)
interface Service {
  id: number;
  nombre: string;
  precio: number;
  tiempo: number;
}

// Interfaz para un Profesional (se mantiene como mock por falta de endpoint)
interface Professional {
  id: string; // Se mantiene como string para el mock
  name: string;
  specialty: string;
}

// Interfaz para un Turno (basado en los endpoints de turnos)
interface Turno {
  id: number;
  solicitante: { id: number; nombre: string; apellido: string, email: string }; // Asumiendo que la API devuelve el objeto solicitante
  profesional: { id: number; nombre: string; apellido: string }; // Asumiendo que la API devuelve el objeto profesional
  servicios: Service[];
  fecha: string; // Formato "YYYY-MM-DD"
  hora: string; // Formato "HH:MM"
  estado: string;
  notas?: string;
}

// Tipos de estado de turno para el dropdown de actualización
const ESTADOS_TURNO = ["PENDIENTE", "EN_PROCESO", "FINALIZADO", "CANCELADO", "PENDIENTE_PAGO"];

const AppointmentManagement: React.FC = () => {
  // --- ESTADOS DEL COMPONENTE ---
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editingTurno, setEditingTurno] = useState<Turno | null>(null);
  const [newTurno, setNewTurno] = useState({
    solicitanteId: 1, // ID de cliente fijo para el ejemplo, deberías obtenerlo del usuario logueado
    profesionalId: '',
    serviciosIds: [] as number[],
    fecha: '',
    hora: '',
    notas: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // --- DATOS MOCK (SOLO PARA PROFESIONALES) ---
  // TODO: Reemplazar con una llamada a la API cuando el endpoint de profesionales esté disponible
  const mockProfessionals: Professional[] = [
    { id: '1', name: 'Dra. Ana Felicidad', specialty: 'Masajes y Faciales' },
    { id: '2', name: 'Dra. López', specialty: 'Medicina Estética' },
    { id: '3', name: 'Dr. García', specialty: 'Dermatología' },
    { id: '4', name: 'Lic. Pérez', specialty: 'Nutrición' },
  ];

  // --- EFECTO PARA CARGAR DATOS INICIALES ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);
      try {
        // Cargar servicios y turnos pendientes en paralelo
        const [servicesRes, turnosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listaServicio`),
          fetch(`${API_BASE_URL}/listTurnPendiente`)
        ]);

        if (!servicesRes.ok || !turnosRes.ok) {
          throw new Error('Error al cargar los datos iniciales.');
        }

        const servicesData: Service[] = await servicesRes.json();
        const turnosData: Turno[] = await turnosRes.json();
        
        setServices(servicesData);
        setTurnos(turnosData);

      } catch (error) {
        console.error(error);
        setMessage({ text: 'No se pudieron cargar los datos. Inténtalo de nuevo.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para recargar la lista de turnos (útil después de crear o actualizar)
  const fetchTurnos = async () => {
    setLoading(true);
    try {
      // Por simplicidad, volvemos a cargar solo los pendientes. Podrías añadir un filtro para cambiar esto.
      const response = await fetch(`${API_BASE_URL}/listTurnPendiente`);
      if (!response.ok) throw new Error('Error al recargar los turnos.');
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'No se pudieron actualizar los turnos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADORES DE EVENTOS ---

  const handleNewTurnoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "serviciosIds") {
      // Manejar selección de servicio (asumiendo selección única por ahora)
      setNewTurno(prev => ({ ...prev, [name]: [parseInt(value, 10)] }));
    } else {
      setNewTurno(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditingTurnoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingTurno) {
      setEditingTurno(prev => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleAddTurno = async () => {
    if (!newTurno.profesionalId || newTurno.serviciosIds.length === 0 || !newTurno.fecha || !newTurno.hora) {
      setMessage({ text: 'Profesional, servicio, fecha y hora son obligatorios.', type: 'error' });
      return;
    }
    
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/solicitarTurno`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTurno,
          profesionalId: parseInt(newTurno.profesionalId, 10), // La API espera un número
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al solicitar el turno.');
      }

      setMessage({ text: 'Turno añadido con éxito.', type: 'success' });
      setNewTurno({ // Limpia el formulario
        solicitanteId: 1,
        profesionalId: '',
        serviciosIds: [],
        fecha: '',
        hora: '',
        notes: ''
      });
      fetchTurnos(); // Recarga la lista de turnos
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEditClick = (turno: Turno) => {
    setEditingTurno({ ...turno });
  };
  
  const handleSaveEdit = () => {
    // IMPORTANTE: No hay un endpoint para actualizar los detalles de un turno.
    // Esta función solo guardará los cambios en el estado local de la página.
    // Para persistir cambios, se necesitaría un endpoint `PUT /turno/{id}`.
    if (editingTurno) {
      setTurnos(prev =>
        prev.map(t =>
          t.id === editingTurno.id ? editingTurno : t
        )
      );
      setEditingTurno(null);
      setMessage({ text: 'Cambios guardados localmente (sin persistencia en servidor).', type: 'success' });
    }
  };

  const handleCancelEdit = () => {
    setEditingTurno(null);
    setMessage(null);
  };

  const handleDeleteTurno = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/deleteTurn/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el turno.');
        }
        setTurnos(prev => prev.filter(t => t.id !== id));
        setMessage({ text: 'Turno eliminado con éxito.', type: 'success' });
      } catch (error: any) {
        setMessage({ text: error.message, type: 'error' });
      }
    }
  };

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/turno/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PUT', // o PATCH, dependiendo de tu API
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del turno.');
      }
      
      // Actualizar el estado en la UI
      setTurnos(prevTurnos => prevTurnos.map(turno => 
        turno.id === id ? { ...turno, estado: nuevoEstado } : turno
      ));
      setMessage({ text: 'Estado del turno actualizado.', type: 'success' });

    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
  // --- RENDERIZADO DEL COMPONENTE ---

  return (
    <div className={styles.appointmentManagementContainer}>
      <h1 className={styles.title}>Gestión de Turnos</h1>

      {message && <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>{message.text}</div>}

      {/* Formulario para añadir nuevo turno */}
      <div className={styles.addAppointmentSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Turno</h2>
        <div className={styles.formGrid}>
          {/* El nombre del cliente se obtendría del usuario logueado (solicitanteId) */}
          <select
            name="serviciosIds"
            value={newTurno.serviciosIds[0] || ''}
            onChange={handleNewTurnoChange}
            className={styles.selectField}
            required
          >
            <option value="">Seleccione un Servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.nombre} (${service.precio})</option>
            ))}
          </select>
          <select
            name="profesionalId"
            value={newTurno.profesionalId}
            onChange={handleNewTurnoChange}
            className={styles.selectField}
            required
          >
            <option value="">Seleccione un Profesional</option>
            {mockProfessionals.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
          <input
            type="date"
            name="fecha"
            value={newTurno.fecha}
            onChange={handleNewTurnoChange}
            className={styles.inputField}
            required
          />
          <input
            type="time"
            name="hora"
            value={newTurno.hora}
            onChange={handleNewTurnoChange}
            className={styles.inputField}
            required
          />
          <textarea
            name="notas"
            placeholder="Notas (opcional)"
            value={newTurno.notes}
            onChange={handleNewTurnoChange}
            className={styles.textareaField}
            rows={2}
          />
          <button onClick={handleAddTurno} className={styles.addButton}>
            <FaPlus /> Añadir Turno
          </button>
        </div>
      </div>

      {/* Lista de turnos existentes */}
      <div className={styles.appointmentsListSection}>
        <h2 className={styles.sectionTitle}>Turnos Existentes</h2>
        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} /> Cargando turnos...
          </div>
        ) : turnos.length === 0 ? (
          <p>No hay turnos registrados.</p>
        ) : (
          <ul className={styles.appointmentList}>
            {turnos.map(turno => (
              <li key={turno.id} className={styles.appointmentItem}>
                {editingTurno && editingTurno.id === turno.id ? (
                  // MODO EDICIÓN (SOLO LOCAL)
                  <div className={styles.editForm}>
                    {/* Campos de edición. Recuerda que no se guardan en el servidor */}
                    <input type="text" value={`${turno.solicitante.nombre} ${turno.solicitante.apellido}`} readOnly className={styles.inputField} />
                    {/* ... otros campos para editar si fuera necesario ... */}
                     <div className={styles.editActions}>
                      <button onClick={handleSaveEdit} className={`${styles.actionButton} ${styles.saveButton}`}>
                        <FaSave /> Guardar Localmente
                      </button>
                      <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO VISUALIZACIÓN
                  <div className={styles.appointmentDetails}>
                    <p><strong>Cliente:</strong> {turno.solicitante.nombre} {turno.solicitante.apellido}</p>
                    <p><strong>Servicio:</strong> {turno.servicios.map(s => s.nombre).join(', ')}</p>
                    <p><strong>Profesional:</strong> {turno.profesional.nombre} {turno.profesional.apellido}</p>
                    <p><strong>Fecha:</strong> {turno.fecha}</p>
                    <p><strong>Hora:</strong> {turno.hora}</p>
                    {turno.notas && <p><strong>Notas:</strong> {turno.notas}</p>}
                    
                    <div className={styles.statusSection}>
                      <strong>Estado: </strong>
                      <select 
                        value={turno.estado} 
                        onChange={(e) => handleUpdateEstado(turno.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        {ESTADOS_TURNO.map(estado => (
                          <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.actions}>
                      <button onClick={() => handleEditClick(turno)} className={`${styles.actionButton} ${styles.editButton}`} title="Editar Localmente">
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteTurno(turno.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
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
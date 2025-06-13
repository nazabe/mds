// src/components/ProfessionalManagement/ProfessionalManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './ProfessionalManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

// Interfaz para un Profesional (Frontend)
interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  // Podrías añadir más campos si son relevantes, como 'role' si la API lo devuelve
}

// Interfaz para el objeto usuario que devuelve la API (ej. /listarUser)
// Ajusta esto según los campos reales que devuelve tu API
interface ApiUser {
  id: string | number; // El ID de la API podría ser número o string
  nombre?: string;      // Asumiendo que la API usa 'nombre'
  name?: string;        // O podría usar 'name'
  especialidad?: string; // Asumiendo 'especialidad'
  specialty?: string;   // O 'specialty'
  email: string;        // El email debería ser un campo estándar
  telefono?: string;    // Asumiendo 'telefono'
  phone?: string;       // O 'phone'
  // Otros campos que pueda devolver la API, como 'rol'
  rol?: string;
}

const API_BASE_URL = 'https://web-spa-hjzu.onrender.com';

const ProfessionalManagement: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cargar profesionales desde la API
  const fetchProfessionals = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/listarUser`);
      if (!response.ok) {
        throw new Error(`Error al cargar usuarios/profesionales: ${response.statusText}`);
      }
      const apiData: ApiUser[] = await response.json();
      
      // Mapear datos de la API a la interfaz Professional del frontend
      // Filtrar por rol si es necesario, ej. si solo quieres usuarios con rol 'profesional'
      // const filteredData = apiData.filter(user => user.rol === 'profesional'); 
      const loadedProfessionals: Professional[] = apiData.map(apiUser => ({
        id: String(apiUser.id),
        name: apiUser.nombre || apiUser.name || 'Nombre no disponible',
        // Si 'specialty' no viene de la API, será un campo manejado localmente o necesitará un valor por defecto
        specialty: apiUser.especialidad || apiUser.specialty || 'Especialidad no definida', 
        email: apiUser.email,
        phone: apiUser.telefono || apiUser.phone || 'Teléfono no disponible',
      }));
      setProfessionals(loadedProfessionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      setMessage(error instanceof Error ? error.message : 'Error desconocido al cargar profesionales.');
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleNewProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfessional(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProfessional) {
      setEditingProfessional(prev => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleAddProfessional = async () => {
    if (!newProfessional.name || !newProfessional.specialty || !newProfessional.email || !newProfessional.phone) {
      setMessage('Todos los campos (nombre, especialidad, email, teléfono) son obligatorios.');
      return;
    }

    // --- IMPORTANTE ---
    // No se proporcionó un endpoint API para CREAR un nuevo usuario/profesional.
    // La siguiente lógica añade el profesional SOLO AL ESTADO LOCAL.
    // Se perderá al recargar la página.
    // Si tienes un endpoint POST /crearUsuario o similar, impleméntalo aquí.
    
    const id = `prof-local-${Date.now()}`; // ID local temporal
    const professionalToAdd = { ...newProfessional, id };
    setProfessionals(prev => [...prev, professionalToAdd]);
    setNewProfessional({ name: '', specialty: '', email: '', phone: '' });
    setMessage('Profesional añadido localmente (no persistido en backend).');
    
    // Si tuvieras una API de creación:
    // setIsLoading(true);
    // setMessage(null);
    // try {
    //   const response = await fetch(`${API_BASE_URL}/crearUsuario`, { // Endpoint hipotético
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       nombre: newProfessional.name,
    //       especialidad: newProfessional.specialty, // Asegúrate que la API acepte estos campos
    //       email: newProfessional.email,
    //       telefono: newProfessional.phone,
    //       // rol: 'profesional', // Podrías necesitar enviar un rol
    //     }),
    //   });
    //   if (!response.ok) throw new Error('Error al añadir profesional');
    //   await fetchProfessionals(); // Recargar la lista
    //   setNewProfessional({ name: '', specialty: '', email: '', phone: '' });
    //   setMessage('Profesional añadido con éxito.');
    // } catch (error) {
    //   setMessage(error instanceof Error ? error.message : 'Error al añadir profesional.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleEditClick = (professional: Professional) => {
    setEditingProfessional({ ...professional });
  };

  const handleSaveEdit = async () => {
    if (editingProfessional) {
      if (!editingProfessional.name || !editingProfessional.specialty || !editingProfessional.email || !editingProfessional.phone) {
        setMessage('Todos los campos son obligatorios.');
        return;
      }

      // --- IMPORTANTE ---
      // No se proporcionó un endpoint API para ACTUALIZAR un usuario/profesional.
      // La siguiente lógica actualiza el profesional SOLO AL ESTADO LOCAL.
      // Los cambios se perderán al recargar si no se persisten.
      // Si tienes un endpoint PUT /actualizarUsuario/{id} o similar, impleméntalo aquí.
      console.warn("Funcionalidad 'Guardar Cambios' solo opera localmente. Falta API de actualización.");

      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === editingProfessional.id ? editingProfessional : prof
        )
      );
      setEditingProfessional(null);
      setMessage('Cambios guardados localmente (no persistidos en backend).');

      // Si tuvieras una API de actualización:
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`${API_BASE_URL}/user/${editingProfessional.id}`, { // O /actualizarUser/${editingProfessional.id}
          method: 'PUT', // o PATCH
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: editingProfessional.name,
            especialidad: editingProfessional.specialty,
            email: editingProfessional.email,
            telefono: editingProfessional.phone,
          }),
        });
        if (!response.ok) throw new Error('Error al guardar cambios del profesional');
        await fetchProfessionals(); // Recargar o actualizar localmente con la respuesta
        setEditingProfessional(null);
        setMessage('Cambios guardados con éxito.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Error al guardar cambios.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProfessional(null);
    setMessage(null);
  };

  const handleDeleteProfessional = async (id: string) => {
    // El ID que viene de la API `/listarUser` podría ser numérico.
    // El endpoint `/deleteUser/{userID}` espera el ID. Asegúrate de que el tipo coincida.
    // Si el ID en tu estado `professionals` es `prof-local-123...`, este no funcionará con la API.
    // Solo los IDs obtenidos de la API pueden ser usados para eliminar en el backend.
    if (id.startsWith('prof-local-')) {
        if (window.confirm('Este profesional solo existe localmente. ¿Eliminar de la lista actual?')) {
            setProfessionals(prev => prev.filter(prof => prof.id !== id));
            setMessage('Profesional local eliminado de la vista.');
        }
        return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar a este profesional del sistema?')) {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`${API_BASE_URL}/deleteUser/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Error al eliminar profesional: ${response.statusText}`);
        }
        await fetchProfessionals(); // Recargar la lista para reflejar la eliminación
        setMessage('Profesional eliminado con éxito del sistema.');
      } catch (error) {
        console.error("Error deleting professional:", error);
        setMessage(error instanceof Error ? error.message : 'Error desconocido al eliminar el profesional.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.professionalManagementContainer}>
      <h1 className={styles.title}>Gestión de Profesionales</h1>

      {message && <div className={`${styles.message} ${message.toLowerCase().includes('error') ? styles.errorMessage : styles.successMessage}`}>{message}</div>}

      {/* Formulario para añadir nuevo profesional */}
      <div className={styles.addProfessionalSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Profesional (Localmente)</h2>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="name"
            placeholder="Nombre completo *"
            value={newProfessional.name}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Especialidad *"
            value={newProfessional.specialty}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={newProfessional.email}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono *"
            value={newProfessional.phone}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <button onClick={handleAddProfessional} className={styles.addButton} disabled={isLoading}>
            <FaPlus /> Añadir Profesional (Local)
          </button>
        </div>
      </div>

      {/* Lista de profesionales existentes */}
      <div className={styles.professionalsListSection}>
        <h2 className={styles.sectionTitle}>Profesionales Existentes</h2>
        {isLoading && <div className={styles.loading}>Cargando...</div>}
        {professionals.length === 0 && !isLoading ? (
          <p>No hay profesionales registrados o no se pudieron cargar.</p>
        ) : (
          <ul className={styles.professionalList}>
            {professionals.map(prof => (
              <li key={prof.id} className={styles.professionalItem}>
                {editingProfessional && editingProfessional.id === prof.id ? (
                  // Modo edición
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      name="name"
                      value={editingProfessional.name}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="specialty"
                      value={editingProfessional.specialty}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <input
                      type="email"
                      name="email"
                      value={editingProfessional.email}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={editingProfessional.phone}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveEdit} className={`${styles.actionButton} ${styles.saveButton}`} disabled={isLoading}>
                        <FaSave /> Guardar (Local)
                      </button>
                      <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isLoading}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className={styles.professionalDetails}>
                    <p><strong>Nombre:</strong> {prof.name}</p>
                    <p><strong>Especialidad:</strong> {prof.specialty}</p>
                    <p><strong>Email:</strong> {prof.email}</p>
                    <p><strong>Teléfono:</strong> {prof.phone}</p>
                    <p><small>ID: {prof.id}</small></p>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleEditClick(prof)} 
                        className={`${styles.actionButton} ${styles.editButton}`}
                        disabled={isLoading || !!editingProfessional}
                      >
                        <FaEdit /> Editar (Local)
                      </button>
                      <button 
                        onClick={() => handleDeleteProfessional(prof.id)} 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={isLoading || !!editingProfessional}
                      >
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

export default ProfessionalManagement;
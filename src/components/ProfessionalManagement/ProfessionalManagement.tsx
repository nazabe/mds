// src/components/ProfessionalManagement/ProfessionalManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './ProfessionalManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

// Interfaz para un Profesional (Frontend)
interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Interfaz para el objeto usuario que devuelve la API (ej. /listarUser)
interface ApiUser {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  rol: string;
}

const API_BASE_URL = 'https://web-spa-hjzu.onrender.com';

const ProfessionalManagement: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    name: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cargar profesionales desde la API
  const fetchProfessionals = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/listarUser`);
      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.statusText}`);
      }
      const apiData: ApiUser[] = await response.json();
      
      // Mapear datos de la API a la interfaz del frontend
      const loadedProfessionals: Professional[] = apiData
        // Opcional: Filtra para mostrar solo usuarios con un rol específico si la API lo provee
        // .filter(user => user.rol === 'profesional') 
        .map(apiUser => ({
          id: String(apiUser.id),
          name: apiUser.name || 'Nombre no disponible',
          email: apiUser.email || 'Correo no disponible',
          phone: apiUser.phone || 'Teléfono no disponible',
        }));
      setProfessionals(loadedProfessionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      setMessage({
        text: error instanceof Error ? error.message : 'Error desconocido al cargar profesionales.',
        type: 'error'
      });
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

  // --- FUNCIÓN DE AÑADIR PROFESIONAL (IMPLEMENTADA) ---
  const handleAddProfessional = async () => {
    if (!newProfessional.name 
      || !newProfessional.email || !newProfessional.phone) {
      setMessage({ text: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      // Ajusta el endpoint y el cuerpo del objeto según tu API
      const response = await fetch(`${API_BASE_URL}/crearUsuario`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newProfessional.name,
          username: newProfessional.email,
          telefono: newProfessional.phone,
          // Es posible que necesites enviar un rol, contraseña por defecto, etc.
          rol: 'PROFESSIONAL',
          password: 'defaultPassword123' 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al añadir profesional` }));
        throw new Error(errorData.message);
      }
      
      setMessage({ text: 'Profesional añadido con éxito.', type: 'success' });
      setNewProfessional({ name: '', email: '', phone: '' }); // Limpiar formulario
      await fetchProfessionals(); // Recargar la lista para mostrar el nuevo profesional
    } catch (error) {
      console.error("Error adding professional:", error);
      setMessage({
        text: error instanceof Error ? error.message : 'Error desconocido al añadir el profesional.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (professional: Professional) => {
    setEditingProfessional({ ...professional });
    setMessage(null);
  };

  // --- LÓGICA DE GUARDAR (ACTUALIZAR) ---
  // Esta función todavía necesita el endpoint de actualización de tu API
  const handleSaveEdit = async () => {
    if (editingProfessional) {
      if (!editingProfessional.name || !editingProfessional.email || !editingProfessional.phone) {
        setMessage({ text: 'Todos los campos son obligatorios.', type: 'error' });
        return;
      }

      setIsLoading(true);
      setMessage(null);
      try {
         // Reemplaza con tu endpoint real de actualización (PUT o PATCH)
        const response = await fetch(`${API_BASE_URL}/user/${editingProfessional.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          nombre: newProfessional.name,
          username: newProfessional.email,
          telefono: newProfessional.phone,
          // Es posible que necesites enviar un rol, contraseña por defecto, etc.
          rol: 'PROFESSIONAL',
          password: 'defaultPassword123' 
        }),
        });
        if (!response.ok) throw new Error('Error al guardar los cambios');
        
        setMessage({ text: 'Cambios guardados con éxito.', type: 'success' });
        setEditingProfessional(null);
        await fetchProfessionals(); // Recargar la lista
      } catch (error) {
        setMessage({
          text: error instanceof Error ? error.message : 'Error al guardar los cambios.',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProfessional(null);
    setMessage(null);
  };

  // --- FUNCIÓN DE ELIMINAR PROFESIONAL (IMPLEMENTADA) ---
  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este profesional? Esta acción no se puede deshacer.')) {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`${API_BASE_URL}/deleteUser/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Error al eliminar: ${response.statusText}` }));
          throw new Error(errorData.message);
        }

        setMessage({ text: 'Profesional eliminado con éxito.', type: 'success' });
        await fetchProfessionals(); // Recargar la lista para reflejar la eliminación
      } catch (error) {
        console.error("Error deleting professional:", error);
        setMessage({
          text: error instanceof Error ? error.message : 'Error desconocido al eliminar el profesional.',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Determina el estilo del mensaje (éxito o error)
  const messageClass = message ? (message.type === 'error' ? styles.errorMessage : styles.successMessage) : '';

  return (
    <div className={styles.professionalManagementContainer}>
      <h1 className={styles.title}>Gestión de Profesionales</h1>

      {message && <div className={`${styles.message} ${messageClass}`}>{message.text}</div>}

      {/* Formulario para añadir nuevo profesional */}
      <div className={styles.addProfessionalSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Profesional</h2>
        <div className={styles.formGrid}>
          <input
            type="text" name="name" placeholder="Nombre completo *" value={newProfessional.name}
            onChange={handleNewProfessionalChange} className={styles.inputField} disabled={isLoading}
          />
          <input
            type="email" name="email" placeholder="Email *" value={newProfessional.email}
            onChange={handleNewProfessionalChange} className={styles.inputField} disabled={isLoading}
          />
          <input
            type="tel" name="phone" placeholder="Teléfono *" value={newProfessional.phone}
            onChange={handleNewProfessionalChange} className={styles.inputField} disabled={isLoading}
          />
          <button onClick={handleAddProfessional} className={styles.addButton} disabled={isLoading}>
            <FaPlus /> {isLoading ? 'Añadiendo...' : 'Añadir Profesional'}
          </button>
        </div>
      </div>

      {/* Lista de profesionales existentes */}
      <div className={styles.professionalsListSection}>
        <h2 className={styles.sectionTitle}>Profesionales Existentes</h2>
        {isLoading && professionals.length === 0 && <div className={styles.loading}>Cargando...</div>}
        
        {professionals.length === 0 && !isLoading ? (
          <p>No hay profesionales registrados.</p>
        ) : (
          <ul className={styles.professionalList}>
            {professionals.map(prof => (
              <li key={prof.id} className={styles.professionalItem}>
                {editingProfessional?.id === prof.id ? (
                  // Modo edición
                  <div className={styles.editForm}>
                    <input type="text" name="name" value={editingProfessional.name} onChange={handleEditingProfessionalChange} className={styles.inputField} disabled={isLoading} />
                    <input type="email" name="email" value={editingProfessional.email} onChange={handleEditingProfessionalChange} className={styles.inputField} disabled={isLoading} />
                    <input type="tel" name="phone" value={editingProfessional.phone} onChange={handleEditingProfessionalChange} className={styles.inputField} disabled={isLoading} />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveEdit} className={`${styles.actionButton} ${styles.saveButton}`} disabled={isLoading}>
                        <FaSave /> {isLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isLoading}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className={styles.professionalDetails}>
                    <p><strong>ID:</strong> {prof.id}</p>
                    <p><strong>Nombre:</strong> {prof.name}</p>
                    <p><strong>Email:</strong> {prof.email}</p>
                    <p><strong>Teléfono:</strong> {prof.phone}</p>
                    <div className={styles.actions}>
                      <button onClick={() => handleEditClick(prof)} className={`${styles.actionButton} ${styles.editButton}`} disabled={isLoading || !!editingProfessional}>
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteProfessional(prof.id)} className={`${styles.actionButton} ${styles.deleteButton}`} disabled={isLoading || !!editingProfessional}>
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
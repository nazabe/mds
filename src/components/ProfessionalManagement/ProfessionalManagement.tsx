// src/components/ProfessionalManagement/ProfessionalManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './ProfessionalManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ApiPerson {
  personId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  Roles?: { name: string }[];
}

const API_BASE_URL = "https://backend-ecommerce-50vz.onrender.com";

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
      const response = await fetch(`${API_BASE_URL}/api/persons`);
      if (!response.ok) {
        throw new Error(`Error al cargar profesionales`);
      }

      const apiData: any[] = await response.json();

      const loadedProfessionals: Professional[] = apiData.map(person => ({
        id: String(person.personId),
        name: `${person.firstName} ${person.lastName}`.trim(),
        email: person.email || 'Correo no disponible',
        phone: person.phoneNumber || 'Teléfono no disponible',
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

  const handleAddProfessional = async () => {
    if (!newProfessional.name || !newProfessional.email || !newProfessional.phone) {
      setMessage({ text: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const [firstName, ...lastParts] = newProfessional.name.split(' ');
      const lastName = lastParts.join(' ') || 'Profesional';

      // 1. Crear persona
      const personResponse = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          dni: `P-${Date.now()}`, // generado automáticamente
          email: newProfessional.email,
          phoneNumber: newProfessional.phone,
          username: newProfessional.email,
          password: 'defaultPassword123'
        }),
      });

      if (!personResponse.ok) {
        const errorData = await personResponse.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al crear el profesional');
      }

      const createdPerson = await personResponse.json();

      // 2. Asignar rol PROFESSIONAL
      const roleResponse = await fetch(`${API_BASE_URL}/hasroles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPerson: createdPerson.personId,
          idRole: 3 // ID real de "PROFESSIONAL", verificá que sea el correcto
        })
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.json().catch(() => null);
        throw new Error(errorData?.message || 'Profesional creado, pero fallo al asignar rol');
      }

      setMessage({ text: 'Profesional añadido con éxito.', type: 'success' });
      setNewProfessional({ name: '', email: '', phone: '' });
      await fetchProfessionals();
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
const handleSaveEdit = async () => {
  if (editingProfessional) {
    if (!editingProfessional.name || !editingProfessional.email || !editingProfessional.phone) {
      setMessage({ text: 'Todos los campos son obligatorios.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const [firstName, ...lastParts] = editingProfessional.name.split(' ');
      const lastName = lastParts.join(' ') || 'Profesional';

      const response = await fetch(`${API_BASE_URL}/api/persons/${editingProfessional.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: editingProfessional.email,
          phoneNumber: editingProfessional.phone,
          username: editingProfessional.email,
          // password: 'defaultPassword123' // Si se desea actualizar, opcional
        }),
      });

      if (!response.ok) throw new Error('Error al guardar los cambios');

      setMessage({ text: 'Cambios guardados con éxito.', type: 'success' });
      setEditingProfessional(null);
      await fetchProfessionals();
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
      const response = await fetch(`${API_BASE_URL}/api/persons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al eliminar` }));
        throw new Error(errorData.message);
      }

      setMessage({ text: 'Profesional eliminado con éxito.', type: 'success' });
      await fetchProfessionals();
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
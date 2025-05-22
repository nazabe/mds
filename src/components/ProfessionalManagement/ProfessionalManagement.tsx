// src/components/ProfessionalManagement/ProfessionalManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './ProfessionalManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

// Interfaz para un Profesional
interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

const ProfessionalManagement: React.FC = () => {
  // Estado para la lista de profesionales
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  // Estado para el profesional que se está editando (o null si no se edita ninguno)
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  // Estado para los datos del nuevo profesional
  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });
  // Estado para manejar mensajes de error o éxito
  const [message, setMessage] = useState<string | null>(null);

  // Simulación de carga inicial de profesionales (en un caso real, vendría de una API)
  useEffect(() => {
    // Simular una carga de datos con los profesionales especificados
    const loadedProfessionals: Professional[] = [
      { id: 'prof-1', name: 'Dra. Ana Felicidad', specialty: 'Masajes y Faciales', email: 'ana.felicidad@spa.com', phone: '1123456789' },
      { id: 'prof-2', name: 'Dra. López', specialty: 'Medicina Estética', email: 'dra.lopez@spa.com', phone: '1145678901' },
      { id: 'prof-3', name: 'Dr. García', specialty: 'Dermatología', email: 'dr.garcia@spa.com', phone: '1156789012' },
      { id: 'prof-4', name: 'Lic. Pérez', specialty: 'Nutrición', email: 'lic.perez@spa.com', phone: '1167890123' },
      // Puedes añadir más profesionales aquí
    ];
    setProfessionals(loadedProfessionals);
  }, []);

  // Maneja el cambio en los campos del formulario de nuevo profesional
  const handleNewProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfessional(prev => ({ ...prev, [name]: value }));
  };

  // Maneja el cambio en los campos del formulario de edición
  const handleEditingProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProfessional) {
      setEditingProfessional(prev => (prev ? { ...prev, [name]: value } : null));
    }
  };

  // Añade un nuevo profesional
  const handleAddProfessional = () => {
    if (!newProfessional.name || !newProfessional.specialty || !newProfessional.email || !newProfessional.phone) {
      setMessage('Todos los campos son obligatorios.');
      return;
    }
    const id = `prof-${Date.now()}`; // Genera un ID simple (en un caso real, lo generaría el backend)
    const professionalToAdd = { ...newProfessional, id };
    setProfessionals(prev => [...prev, professionalToAdd]);
    setNewProfessional({ name: '', specialty: '', email: '', phone: '' }); // Limpia el formulario
    setMessage('Profesional añadido con éxito.');
  };

  // Inicia la edición de un profesional
  const handleEditClick = (professional: Professional) => {
    setEditingProfessional({ ...professional }); // Crea una copia para editar
  };

  // Guarda los cambios de un profesional editado
  const handleSaveEdit = () => {
    if (editingProfessional) {
      if (!editingProfessional.name || !editingProfessional.specialty || !editingProfessional.email || !editingProfessional.phone) {
        setMessage('Todos los campos son obligatorios.');
        return;
      }
      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === editingProfessional.id ? editingProfessional : prof
        )
      );
      setEditingProfessional(null); // Sale del modo edición
      setMessage('Cambios guardados con éxito.');
    }
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingProfessional(null);
    setMessage(null);
  };

  // Elimina un profesional
  const handleDeleteProfessional = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este profesional?')) {
      setProfessionals(prev => prev.filter(prof => prof.id !== id));
      setMessage('Profesional eliminado.');
    }
  };

  return (
    <div className={styles.professionalManagementContainer}>
      <h1 className={styles.title}>Gestión de Profesionales</h1>

      {message && <div className={styles.message}>{message}</div>}

      {/* Formulario para añadir nuevo profesional */}
      <div className={styles.addProfessionalSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Profesional</h2>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={newProfessional.name}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Especialidad"
            value={newProfessional.specialty}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newProfessional.email}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={newProfessional.phone}
            onChange={handleNewProfessionalChange}
            className={styles.inputField}
          />
          <button onClick={handleAddProfessional} className={styles.addButton}>
            <FaPlus /> Añadir Profesional
          </button>
        </div>
      </div>

      {/* Lista de profesionales existentes */}
      <div className={styles.professionalsListSection}>
        <h2 className={styles.sectionTitle}>Profesionales Existentes</h2>
        {professionals.length === 0 ? (
          <p>No hay profesionales registrados.</p>
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
                    />
                    <input
                      type="text"
                      name="specialty"
                      value={editingProfessional.specialty}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                    />
                    <input
                      type="email"
                      name="email"
                      value={editingProfessional.email}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={editingProfessional.phone}
                      onChange={handleEditingProfessionalChange}
                      className={styles.inputField}
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
                  <div className={styles.professionalDetails}>
                    <p><strong>Nombre:</strong> {prof.name}</p>
                    <p><strong>Especialidad:</strong> {prof.specialty}</p>
                    <p><strong>Email:</strong> {prof.email}</p>
                    <p><strong>Teléfono:</strong> {prof.phone}</p>
                    <div className={styles.actions}>
                      <button onClick={() => handleEditClick(prof)} className={`${styles.actionButton} ${styles.editButton}`}>
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteProfessional(prof.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
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

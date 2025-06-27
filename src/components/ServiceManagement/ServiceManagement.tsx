// src/components/ServiceManagement/ServiceManagement.tsx
import React, { useState, useEffect } from 'react';
import styles from './ServiceManagement.module.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
// Interfaz para un Servicio
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
}

const API_BASE_URL = 'https://backend-ecommerce-50vz.onrender.com/api';

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 0,
    imageUrl: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🟡 Función auxiliar para convertir "01:00:00" a minutos (ej: 60)
  const durationToMinutes = (durationStr: string): number => {
    const [hours, minutes, seconds] = durationStr.split(':').map(Number);
    return hours * 60 + minutes + Math.round(seconds / 60);
  };

  // Cargar servicios desde la API
  const fetchServices = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) {
        throw new Error(`Error al cargar servicios: ${response.statusText}`);
      }
      const apiData = await response.json();

      const loadedServices: Service[] = apiData.map((item: any) => ({
        id: String(item.serviceId),
        name: item.name,
        description: item.description || 'Sin descripción.',
        price: parseFloat(item.price),
        durationMinutes: durationToMinutes(item.duration),
        imageUrl: item.url || `https://placehold.co/180x120/fdebf2/1a2a4d?text=${encodeURIComponent(item.name)}`
      }));

      setServices(loadedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage(error instanceof Error ? error.message : 'Error desconocido al cargar servicios.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  // Convertir minutos a formato "HH:MM:SS"
  const minutesToDurationString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:00`;
  };

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: ['price', 'durationMinutes'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditingServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService(prev => (prev ? {
        ...prev,
        [name]: ['price', 'durationMinutes'].includes(name) ? parseFloat(value) || 0 : value
      } : null));
    }
  };

  const handleAddService = async () => {
    if (!newService.name || newService.price <= 0 || newService.durationMinutes <= 0) {
      setMessage('Los campos nombre, precio (>0) y duración (>0) son obligatorios.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: newService.name,
        description: newService.description || 'Sin descripción',
        url: newService.imageUrl || `https://placehold.co/180x120/fdebf2/1a2a4d?text=${encodeURIComponent(newService.name)}`,
        price: newService.price,
        duration: minutesToDurationString(newService.durationMinutes),
        idCategory: 1 // o permitir que el usuario lo seleccione
      };

      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al añadir servicio: ${response.statusText}`);
      }

      await fetchServices();
      setNewService({ name: '', description: '', price: 0, durationMinutes: 0, imageUrl: '' });
      setMessage('Servicio añadido con éxito.');

    } catch (error) {
      console.error("Error adding service:", error);
      setMessage(error instanceof Error ? error.message : 'Error desconocido al añadir el servicio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;

    if (
      !editingService.name ||
      !editingService.description ||
      editingService.price <= 0 ||
      editingService.durationMinutes <= 0
    ) {
      setMessage('Todos los campos (nombre, descripción, precio, duración) son obligatorios y deben ser válidos.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: editingService.name,
        description: editingService.description,
        url: editingService.imageUrl || `https://placehold.co/180x120/fdebf2/1a2a4d?text=${encodeURIComponent(editingService.name)}`,
        price: editingService.price,
        duration: minutesToDurationString(editingService.durationMinutes),
        idCategory: 1 // o el valor seleccionado por el usuario
      };

      const response = await fetch(`${API_BASE_URL}/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al actualizar servicio');

      await fetchServices();
      setEditingService(null);
      setMessage('Cambios guardados con éxito.');
    } catch (error) {
      console.error("Error updating service:", error);
      setMessage(error instanceof Error ? error.message : 'Error al guardar cambios.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setMessage(null);
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al eliminar servicio: ${response.statusText}`);
      }

      await fetchServices();
      setMessage('Servicio eliminado con éxito.');
    } catch (error) {
      console.error("Error deleting service:", error);
      setMessage(error instanceof Error ? error.message : 'Error desconocido al eliminar el servicio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.serviceManagementContainer}>
      <h1 className={styles.title}>Gestión de Servicios</h1>
      {message && <div className={`${styles.message} ${message.toLowerCase().includes('error') ? styles.errorMessage : styles.successMessage}`}>{message}</div>}


      {/* Formulario para añadir nuevo servicio */}
      <div className={styles.addServiceSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Servicio</h2>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del Servicio *"
            value={newService.name}
            onChange={handleNewServiceChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <input
            type="number"
            name="price"
            placeholder="Precio ($) *"
            value={newService.price === 0 ? '' : newService.price}
            onChange={handleNewServiceChange}
            className={styles.inputField}
            min="0"
            disabled={isLoading}
          />
          <input
            type="number"
            name="durationMinutes"
            placeholder="Duración (minutos) *"
            value={newService.durationMinutes === 0 ? '' : newService.durationMinutes}
            onChange={handleNewServiceChange}
            className={styles.inputField}
            min="0"
            disabled={isLoading}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="URL de Imagen"
            value={newService.imageUrl || ''}
            onChange={handleNewServiceChange}
            className={styles.inputField}
            disabled={isLoading}
          />
          <textarea
            name="description"
            placeholder="Descripción del Servicio"
            value={newService.description}
            onChange={handleNewServiceChange}
            className={styles.textareaField}
            rows={3}
            disabled={isLoading}
          />
          <button onClick={handleAddService} className={styles.addButton} disabled={isLoading}>
            <FaPlus /> Añadir Servicio
          </button>
        </div>
      </div>

      {/* Lista de servicios existentes */}
      <div className={styles.servicesListSection}>
        <h2 className={styles.sectionTitle}>Servicios Existentes</h2>
        {isLoading && <div className={styles.loading}>Cargando...</div>}
        {services.length === 0 && !isLoading ? (
          <p>No hay servicios registrados.</p>
        ) : (
          <ul className={styles.serviceList}>
            {services.map(service => (
              <li key={service.id} className={styles.serviceItem}>
                {editingService && editingService.id === service.id ? (
                  // Modo edición
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      name="name"
                      value={editingService.name}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <textarea
                      name="description"
                      value={editingService.description}
                      onChange={handleEditingServiceChange}
                      className={styles.textareaField}
                      rows={3}
                      disabled={isLoading}
                    />
                    <input
                      type="number"
                      name="price"
                      value={editingService.price}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      min="0"
                      disabled={isLoading}
                    />
                    <input
                      type="number"
                      name="durationMinutes"
                      value={editingService.durationMinutes}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      min="0"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="imageUrl"
                      value={editingService.imageUrl || ''}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      disabled={isLoading}
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveEdit} className={`${styles.actionButton} ${styles.saveButton}`} disabled={isLoading}>
                        <FaSave /> Guardar
                      </button>
                      <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isLoading}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className={styles.serviceDetails}>
                    {service.imageUrl && (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className={styles.serviceImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://placehold.co/100x70/f0f0f0/666666?text=No+Image`;
                        }}
                      />
                    )}
                    <div className={styles.infoText}>
                      <p><strong>Nombre:</strong> {service.name}</p>
                      <p><strong>Descripción:</strong> {service.description}</p>
                      <p><strong>Precio:</strong> ${service.price.toLocaleString('es-AR')}</p>
                      <p><strong>Duración:</strong> {service.durationMinutes} minutos</p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditClick(service)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        disabled={isLoading || !!editingService} // Deshabilitar si ya se está editando otro o cargando
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={isLoading || !!editingService} // Deshabilitar si se está editando o cargando
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

export default ServiceManagement;
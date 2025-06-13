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
  imageUrl?: string; // Opcional, si tienes imágenes para servicios
}

// Interfaz para el objeto que devuelve la API /listaServicio
interface ApiService {
  id: string | number; // El ID de la API podría ser número o string
  nombre: string;
  precio: number;
  tiempo: number;
  // La API no especifica 'descripcion' o 'imageUrl' en /listaServicio
  // Si /servicio/{servicioID} los devolviera, se podrían cargar individualmente
  // o mejor aún, modificar /listaServicio para incluirlos.
  descripcion?: string; // Asumiendo que podría venir opcionalmente
  imageUrl?: string;    // Asumiendo que podría venir opcionalmente
}

const API_BASE_URL = 'https://web-spa-hjzu.onrender.com';

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '', // Se mantiene en el frontend
    price: 0,
    durationMinutes: 0,
    imageUrl: '' // Se mantiene en el frontend
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cargar servicios desde la API
  const fetchServices = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/listaServicio`);
      if (!response.ok) {
        throw new Error(`Error al cargar servicios: ${response.statusText}`);
      }
      const apiData: ApiService[] = await response.json();
      
      // Mapear datos de la API a la interfaz Service del frontend
      const loadedServices: Service[] = apiData.map(apiService => ({
        id: String(apiService.id), // Aseguramos que el ID sea string
        name: apiService.nombre,
        description: apiService.descripcion || 'Descripción no disponible en la API.', // Valor por defecto
        price: apiService.precio,
        durationMinutes: apiService.tiempo,
        imageUrl: apiService.imageUrl || `https://placehold.co/180x120/fdebf2/1a2a4d?text=${encodeURIComponent(apiService.nombre)}` // Placeholder si no viene URL
      }));
      setServices(loadedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage(error instanceof Error ? error.message : 'Error desconocido al cargar servicios.');
      setServices([]); // Limpiar servicios en caso de error para no mostrar datos viejos
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'durationMinutes' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditingServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService(prev => (prev ? {
        ...prev,
        [name]: name === 'price' || name === 'durationMinutes' ? parseFloat(value) || 0 : value
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
        nombre: newService.name,
        precio: newService.price,
        tiempo: newService.durationMinutes,
        // La API /crearServicio no acepta 'description' ni 'imageUrl' según la especificación
        // Si los aceptara, se añadirían aquí:
        // descripcion: newService.description,
      };

      const response = await fetch(`${API_BASE_URL}/crearServicio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Intentar leer el cuerpo del error si lo hay
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al añadir servicio: ${response.statusText}`);
      }
      
      // La API no especifica que devuelva el servicio creado.
      // Así que volvemos a cargar todos los servicios para ver el nuevo.
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
    if (editingService) {
      if (!editingService.name || !editingService.description || editingService.price <= 0 || editingService.durationMinutes <= 0) {
        setMessage('Todos los campos (nombre, descripción, precio, duración) son obligatorios y deben ser válidos.');
        return;
      }
      
      // TODO: Implementar llamada a la API para actualizar el servicio.
      // Se necesitaría un endpoint como PUT /servicio/{id} o /actualizarServicio/{id}
      // Por ahora, solo actualiza el estado local.
      console.warn("La funcionalidad de guardar edición solo actualiza el estado local. Falta endpoint API de actualización.");
      
      // Simulación de guardado local (esto se reemplazaría con la llamada API y luego fetchServices o actualización local con respuesta)
      setServices(prev =>
        prev.map(serv =>
          serv.id === editingService.id ? editingService : serv
        )
      );
      setEditingService(null);
      setMessage('Cambios guardados localmente (simulación). Implementar API para persistir.');
      // Si la API actualiza y devuelve el objeto actualizado, o simplemente confirma:
      setIsLoading(true);
      try {
        const payload = {
          nombre: editingService.name,
          precio: editingService.price,
          tiempo: editingService.durationMinutes,
          // descripcion: editingService.description, // si la API lo permite
          // imageUrl: editingService.imageUrl, // si la API lo permite
        };
        const response = await fetch(`${API_BASE_URL}/actualizarServicio/${editingService.id}`, { // Endpoint hipotético
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Error al actualizar servicio');
        await fetchServices(); // O actualizar localmente si la API devuelve el objeto
        setEditingService(null);
        setMessage('Cambios guardados con éxito.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Error al guardar cambios.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setMessage(null);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`${API_BASE_URL}/deleteServicio/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Error al eliminar servicio: ${response.statusText}`);
        }
        // Eliminar del estado local o volver a cargar
        // setServices(prev => prev.filter(serv => serv.id !== id));
        await fetchServices(); // Más seguro para reflejar el estado real del backend
        setMessage('Servicio eliminado con éxito.');
      } catch (error) {
        console.error("Error deleting service:", error);
        setMessage(error instanceof Error ? error.message : 'Error desconocido al eliminar el servicio.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.serviceManagementContainer}>
      <h1 className={styles.title}>Gestión de Servicios</h1>

      {isLoading && <div className={styles.loading}>Cargando...</div>}
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
          <textarea
            name="description"
            placeholder="Descripción del Servicio (local)"
            value={newService.description}
            onChange={handleNewServiceChange}
            className={styles.textareaField}
            rows={3}
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
            placeholder="URL de Imagen (opcional, local)"
            value={newService.imageUrl || ''}
            onChange={handleNewServiceChange}
            className={styles.inputField}
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
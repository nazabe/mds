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

const ServiceManagement: React.FC = () => {
  // Estado para la lista de servicios
  const [services, setServices] = useState<Service[]>([]);
  // Estado para el servicio que se está editando (o null si no se edita ninguno)
  const [editingService, setEditingService] = useState<Service | null>(null);
  // Estado para los datos del nuevo servicio
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 0,
    imageUrl: ''
  });
  // Estado para manejar mensajes de error o éxito
  const [message, setMessage] = useState<string | null>(null);

  // Simulación de carga inicial de servicios
  useEffect(() => {
    // Aquí cargarías los servicios reales desde una API.
    // Por ahora, usamos la misma lista que tienes en AdminDashboard.tsx.
    const loadedServices: Service[] = [
      // Servicios Individuales - Masajes
      { id: 'service-1', name: "Masaje Anti-stress", description: "Masaje relajante para liberar tensiones.", price: 12000, durationMinutes: 50, imageUrl: "/mds/images/services/massage-3795693_1280.jpg" },
      { id: 'service-2', name: "Masaje Descontracturante", description: "Alivia nudos y tensiones musculares profundas.", price: 13000, durationMinutes: 60, imageUrl: "/mds/images/services/massage-2768832_1280.jpg" },
      { id: 'service-3', name: "Masaje con Piedras Calientes", description: "Terapia relajante con piedras volcánicas calientes.", price: 15000, durationMinutes: 70, imageUrl: "/mds/images/services/m_116_1677502402.jpg" },
      { id: 'service-4', name: "Masaje Circulatorio", description: "Mejora la circulación y reduce la retención de líquidos.", price: 11000, durationMinutes: 45, imageUrl: "/mds/images/services/people-3184615_1280.jpg" },

      // Servicios Individuales - Belleza
      { id: 'service-5', name: "Lifting de Pestaña", description: "Realza tus pestañas de forma natural y duradera.", price: 8500, durationMinutes: 50, imageUrl: "/mds/images/services/woman-567021_1280.jpg" },
      { id: 'service-6', name: "Depilación Facial", description: "Eliminación de vello facial con métodos suaves.", price: 4000, durationMinutes: 25, imageUrl: "/mds/images/services/beautiful-young-woman-facial-treatment-beauty-salon-applying-cream_219728-3075.avif" },
      { id: 'service-7', name: "Belleza de Manos y Pies", description: "Manicura y pedicura completas para un cuidado total.", price: 10000, durationMinutes: 90, imageUrl: "/mds/images/services/physical-therapy-2133286_1280.jpg" },

      // Servicios Individuales - Tratamientos Faciales
      { id: 'service-8', name: "Punta de Diamante Microexfoliación", description: "Exfoliación profunda para renovar la piel del rostro.", price: 9500, durationMinutes: 60, imageUrl: "/mds/images/services/831TreatmentShoot_Derma_0204.jpg" },
      { id: 'service-9', name: "Limpieza Profunda + Hidratación", description: "Elimina impurezas y nutre la piel del rostro.", price: 11000, durationMinutes: 70, imageUrl: "/mds/images/services/face-2722810_1280.jpg" },
      { id: 'service-10', name: "Crio Frecuencia Facial", description: "Reafirma y revitaliza la piel con frío y calor controlado.", price: 9000, durationMinutes: 40, imageUrl: "/mds/images/services/conoce-todo-sobre-la-radio-frecuencia-facial.jpg" },

      // Servicios Individuales - Tratamientos Corporales
      { id: 'service-11', name: "VelaSlim", description: "Tratamiento para reducir celulitis y modelar el cuerpo.", price: 10500, durationMinutes: 45, imageUrl: "/mds/images/services/facial-8224799_1280.jpg" },
      { id: 'service-12', name: "DermoHealth", description: "Mejora la elasticidad de la piel y reduce la flacidez.", price: 9000, durationMinutes: 40, imageUrl: "/mds/images/services/ai-generated-8270432_1280.jpg" },
      { id: 'service-13', name: "Criofrecuencia Corporal", description: "Tratamiento reafirmante y reductor de grasa corporal.", price: 12000, durationMinutes: 60, imageUrl: "https://placehold.co/180x120/fdebf2/1a2a4d?text=Criofrecuencia+Corporal" },
      { id: 'service-14', name: "Ultracavitación", description: "Reduce la grasa localizada mediante ultrasonidos.", price: 11500, durationMinutes: 50, imageUrl: "https://placehold.co/180x120/fdebf2/1a2a4d?text=Ultracavitacion" },
    ];
    setServices(loadedServices);
  }, []);

  // Maneja el cambio en los campos del formulario de nuevo servicio
  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'durationMinutes' ? parseFloat(value) || 0 : value
    }));
  };

  // Maneja el cambio en los campos del formulario de edición
  const handleEditingServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService(prev => (prev ? {
        ...prev,
        [name]: name === 'price' || name === 'durationMinutes' ? parseFloat(value) || 0 : value
      } : null));
    }
  };

  // Añade un nuevo servicio
  const handleAddService = () => {
    if (!newService.name || !newService.description || newService.price <= 0 || newService.durationMinutes <= 0) {
      setMessage('Todos los campos (nombre, descripción, precio, duración) son obligatorios y deben ser válidos.');
      return;
    }
    const id = `service-${Date.now()}`; // Genera un ID simple
    const serviceToAdd = { ...newService, id };
    setServices(prev => [...prev, serviceToAdd]);
    setNewService({ name: '', description: '', price: 0, durationMinutes: 0, imageUrl: '' }); // Limpia el formulario
    setMessage('Servicio añadido con éxito.');
  };

  // Inicia la edición de un servicio
  const handleEditClick = (service: Service) => {
    setEditingService({ ...service }); // Crea una copia para editar
  };

  // Guarda los cambios de un servicio editado
  const handleSaveEdit = () => {
    if (editingService) {
      if (!editingService.name || !editingService.description || editingService.price <= 0 || editingService.durationMinutes <= 0) {
        setMessage('Todos los campos (nombre, descripción, precio, duración) son obligatorios y deben ser válidos.');
        return;
      }
      setServices(prev =>
        prev.map(serv =>
          serv.id === editingService.id ? editingService : serv
        )
      );
      setEditingService(null); // Sale del modo edición
      setMessage('Cambios guardados con éxito.');
    }
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingService(null);
    setMessage(null);
  };

  // Elimina un servicio
  const handleDeleteService = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setServices(prev => prev.filter(serv => serv.id !== id));
      setMessage('Servicio eliminado.');
    }
  };

  return (
    <div className={styles.serviceManagementContainer}>
      <h1 className={styles.title}>Gestión de Servicios</h1>

      {message && <div className={styles.message}>{message}</div>}

      {/* Formulario para añadir nuevo servicio */}
      <div className={styles.addServiceSection}>
        <h2 className={styles.sectionTitle}>Añadir Nuevo Servicio</h2>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del Servicio"
            value={newService.name}
            onChange={handleNewServiceChange}
            className={styles.inputField}
          />
          <textarea
            name="description"
            placeholder="Descripción del Servicio"
            value={newService.description}
            onChange={handleNewServiceChange}
            className={styles.textareaField}
            rows={3}
          />
          <input
            type="number"
            name="price"
            placeholder="Precio ($)"
            value={newService.price === 0 ? '' : newService.price} // Muestra vacío si es 0
            onChange={handleNewServiceChange}
            className={styles.inputField}
            min="0"
          />
          <input
            type="number"
            name="durationMinutes"
            placeholder="Duración (minutos)"
            value={newService.durationMinutes === 0 ? '' : newService.durationMinutes} // Muestra vacío si es 0
            onChange={handleNewServiceChange}
            className={styles.inputField}
            min="0"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="URL de Imagen (opcional)"
            value={newService.imageUrl}
            onChange={handleNewServiceChange}
            className={styles.inputField}
          />
          <button onClick={handleAddService} className={styles.addButton}>
            <FaPlus /> Añadir Servicio
          </button>
        </div>
      </div>

      {/* Lista de servicios existentes */}
      <div className={styles.servicesListSection}>
        <h2 className={styles.sectionTitle}>Servicios Existentes</h2>
        {services.length === 0 ? (
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
                    />
                    <textarea
                      name="description"
                      value={editingService.description}
                      onChange={handleEditingServiceChange}
                      className={styles.textareaField}
                      rows={3}
                    />
                    <input
                      type="number"
                      name="price"
                      value={editingService.price}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      min="0"
                    />
                    <input
                      type="number"
                      name="durationMinutes"
                      value={editingService.durationMinutes}
                      onChange={handleEditingServiceChange}
                      className={styles.inputField}
                      min="0"
                    />
                    <input
                      type="text"
                      name="imageUrl"
                      value={editingService.imageUrl || ''}
                      onChange={handleEditingServiceChange}
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
                  <div className={styles.serviceDetails}>
                    {service.imageUrl && (
                      <img src={service.imageUrl} alt={service.name} className={styles.serviceImage} onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Evita bucles infinitos de error
                        target.src = `https://placehold.co/100x70/f0f0f0/666666?text=No+Image`; // Placeholder si la imagen falla
                      }} />
                    )}
                    <div className={styles.infoText}>
                        <p><strong>Nombre:</strong> {service.name}</p>
                        <p><strong>Descripción:</strong> {service.description}</p>
                        <p><strong>Precio:</strong> ${service.price.toLocaleString('es-AR')}</p>
                        <p><strong>Duración:</strong> {service.durationMinutes} minutos</p>
                    </div>
                    <div className={styles.actions}>
                      <button onClick={() => handleEditClick(service)} className={`${styles.actionButton} ${styles.editButton}`}>
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteService(service.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
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

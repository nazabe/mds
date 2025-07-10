// src/components/Cart/CartPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlusCircle, FaMinusCircle, FaArrowLeft, FaMoneyBillWave, FaTimes, FaUserCircle, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle, FaDownload } from 'react-icons/fa';
import { useCart, CartItem } from './CartContext';
import styles from './CartPage.module.css'; // Importa el módulo CSS

// Importa las librerías para generar PDF en el frontend
import html2canvas from 'html2canvas'; 
import { jsPDF } from 'jspdf'; 

// Interfaz para los datos que se mostrarán en el PDF (a mejorar)
interface ReservationDetailsForPdf {
  id: string;
  client: {
    name: string;
    email: string;
  };
  appointments: Array<{
    serviceName: string;
    professionalName: string;
    date: string;
    time: string;
    price: number;
    quantity: number;
  }>;
  totalCost: number;
  status: string;
}

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Ref para el elemento HTML que queremos convertir a PDF
  const reservationPdfRef = useRef<HTMLDivElement>(null);

  // --- Estados para el Modal de Checkout ---
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ email: '', password: '' });
  const [checkoutMessage, setCheckoutMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoggedInForCheckout, setIsLoggedInForCheckout] = useState(false); // Estado para controlar si el usuario está logeado para el checkout
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Para alternar entre login y registro

  const BACKEND_LOGIN_URL = 'https://web-spa-hjzu.onrender.com/login';
  const BACKEND_REGISTER_URL = 'https://web-spa-hjzu.onrender.com/register';

  // Verificar estado de login al montar o al abrir el modal
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedInForCheckout(true);
    } else {
      setIsLoggedInForCheckout(false);
    }
  }, [showCheckoutModal]); // Se ejecuta cuando el modal se abre/cierra

  const openCheckoutModal = () => {
    if (cartItems.length === 0) {
      setCheckoutMessage({ type: 'error', message: 'Tu carrito está vacío. Añade servicios antes de proceder.' });
      return;
    }
    setShowCheckoutModal(true);
    setCheckoutMessage(null); // Limpiar mensajes anteriores
    // Re-chequear el login por si cambió fuera del modal
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedInForCheckout(true);
    } else {
      setIsLoggedInForCheckout(false);
    }
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
    setCheckoutMessage(null); // Limpiar mensajes al cerrar
    setAuthFormData({ email: '', password: '' }); // Limpiar formulario de auth
    setShowRegisterForm(false); // Resetear a login
  };

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [name]: value }));
    setCheckoutMessage(null); // Limpiar mensaje al escribir
  };

  const handleLoginAttempt = async () => {
    if (!authFormData.email || !authFormData.password) {
      setCheckoutMessage({ type: 'error', message: 'Por favor, ingrese email y contraseña.' });
      return;
    }
    setIsLoadingCheckout(true);
    setCheckoutMessage({ type: 'info', message: 'Iniciando sesión...' });

    try {
      const response = await fetch(BACKEND_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authFormData.email, password: authFormData.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas.');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role); 
      localStorage.setItem('userEmailForProfessional', data.email); 
      localStorage.setItem('userName', data.nombre + ' ' + data.apellido); // Guarda el nombre del usuario para el PDF

      setIsLoggedInForCheckout(true);
      setCheckoutMessage({ type: 'success', message: '¡Inicio de sesión exitoso! Ahora puedes confirmar tu reserva.' });
    } catch (error: any) {
      setCheckoutMessage({ type: 'error', message: error.message || 'Error al iniciar sesión.' });
      console.error("Login error:", error);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const handleSignupAttempt = async () => {
    if (!authFormData.email || !authFormData.password) {
      setCheckoutMessage({ type: 'error', message: 'Por favor, ingrese email y contraseña para registrarse.' });
      return;
    }
    setIsLoadingCheckout(true);
    setCheckoutMessage({ type: 'info', message: 'Registrando usuario...' });

    try {
      const response = await fetch(BACKEND_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authFormData.email, password: authFormData.password, role: 'USER' }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrarse. El email podría ya estar en uso.');
      }

      const loginResponse = await fetch(BACKEND_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authFormData.email, password: authFormData.password }),
      });

      if (!loginResponse.ok) {
          throw new Error('Registro exitoso, pero no se pudo iniciar sesión automáticamente.');
      }

      const loginData = await loginResponse.json();
      localStorage.setItem('authToken', loginData.token);
      localStorage.setItem('userRole', loginData.role);
      localStorage.setItem('userEmailForProfessional', loginData.email);
      localStorage.setItem('userName', loginData.nombre + ' ' + loginData.apellido); // Guarda el nombre del usuario para el PDF

      setIsLoggedInForCheckout(true);
      setCheckoutMessage({ type: 'success', message: '¡Registro e inicio de sesión exitosos! Procediendo a la confirmación.' });
    } catch (error: any) {
      setCheckoutMessage({ type: 'error', message: error.message || 'Error al registrarse.' });
      console.error("Signup error:", error);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  /**
   * Genera el PDF del comprobante de reserva con los items del carrito.
   */
  const handleConfirmReservationAndPdf = async () => {
    if (cartItems.length === 0) {
      setCheckoutMessage({ type: 'error', message: "El carrito está vacío." });
      return;
    }
    if (!isLoggedInForCheckout) {
      setCheckoutMessage({ type: 'error', message: "Debes iniciar sesión para confirmar y descargar la reserva." });
      return;
    }

    setIsLoadingCheckout(true);
    setCheckoutMessage({ type: 'info', message: 'Confirmando reserva y generando comprobante...' });

    try {
      // 1. Obtener datos del cliente logeado
      const clientEmail = localStorage.getItem('userEmailForProfessional') || 'N/A';
      const clientName = localStorage.getItem('userName') || 'Cliente Desconocido';

      // 2. Preparar los datos para el PDF a partir de cartItems
      const reservationDetails: ReservationDetailsForPdf = {
        id: `RES-${Date.now()}`, // ID de reserva generado
        client: { name: clientName, email: clientEmail },
        appointments: cartItems.map(item => ({
          serviceName: item.service.name,
          professionalName: item.professional.name,
          date: item.date,
          time: item.time,
          price: item.service.price,
          quantity: item.quantity,
        })),
        totalCost: getCartTotal(),
        status: 'Confirmada',
      };

      // Capturar el HTML y generar el PDF
      const input = reservationPdfRef.current;
      if (!input) {
        throw new Error("No se encontró el contenido de la reserva para generar el PDF.");
      }

      // Ocultar el botón de descarga del PDF (dentro del contenido PDF) si existe
      const downloadButtonInsidePdf = input.querySelector('#pdf-download-button-inside') as HTMLElement;
      if (downloadButtonInsidePdf) {
        downloadButtonInsidePdf.classList.add('hidden');
      }

      const canvas = await html2canvas(input, {
        scale: 2, 
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      // Restaurar visibilidad del botón
      if (downloadButtonInsidePdf) {
        downloadButtonInsidePdf.classList.remove('hidden');
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= -10) { // Margen para asegurar captura completa
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`comprobante_reserva_${reservationDetails.id}.pdf`);
      
      setCheckoutMessage({ type: 'success', message: "¡Reserva confirmada y comprobante descargado!" });
      clearCart(); // Limpiar carrito
      setTimeout(() => {
        closeCheckoutModal();
        //navigate('/mds/'); // Redirigir a la página de mis turnos
      }, 2000);

    } catch (error: any) {
      setCheckoutMessage({ type: 'error', message: error.message || 'Error al generar el comprobante de reserva.' });
      console.error("Error al generar PDF:", error);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  // Helper para formatear fechas si fuera necesario
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + 'T00:00:00'); // Asegura que se parsea como fecha UTC para evitar problemas de zona horaria
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
      }
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };


  return (
    <div className={styles.cartPageContainer}>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
          body { font-family: 'Inter', sans-serif; }
          .hidden-for-pdf { display: none !important; }
          .pdf-content-wrapper {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            color: #333;
            font-size: 14px;
          }
          .pdf-header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #4f46e5; /* Indigo */
          }
          .pdf-section-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .pdf-detail-row {
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .pdf-service-item {
            margin-left: 20px;
            margin-bottom: 5px;
          }
          .pdf-total-cost {
            font-size: 20px;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
            color: #10b981; /* Green */
          }
        `}
      </style>

      <div className={styles.cartCard}>
        <h2 className={styles.pageTitle}>
          <FaShoppingCart className={styles.icon} /> Tu Carrito
        </h2>

        {checkoutMessage && (
            <div className={`${styles.statusMessage} ${checkoutMessage.type === 'success' ? styles.successMessage : checkoutMessage.type === 'error' ? styles.errorMessage : styles.infoMessage}`}>
                {checkoutMessage.message}
            </div>
        )}

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Tu carrito está vacío.</p>
            <button className={styles.backButton} onClick={() => navigate('/reservar')}>
              <FaArrowLeft className={styles.buttonIcon} /> Volver a Reservar
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.cartItemsList}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.service.name}</p>
                    <p className={styles.itemInfo}>
                      <span className={styles.infoLabel}>Profesional:</span> {item.professional.name}
                    </p>
                    <p className={styles.itemInfo}>
                      <span className={styles.infoLabel}>Fecha:</span> {item.date}
                    </p>
                    <p className={styles.itemInfo}>
                      <span className={styles.infoLabel}>Hora:</span> {item.time}
                    </p>
                    <p className={styles.itemPrice}>
                      <span className={styles.infoLabel}>Precio:</span> ${item.service.price.toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.itemQuantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                      aria-label={`Disminuir cantidad de ${item.service.name}`}
                    >
                      <FaMinusCircle />
                    </button>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => increaseQuantity(item.id)}
                      aria-label={`Aumentar cantidad de ${item.service.name}`}
                    >
                      <FaPlusCircle />
                    </button>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.service.name} del carrito`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cartSummary}>
              <p className={styles.cartTotal}>
                <FaMoneyBillWave className={styles.icon} /> Total: <span>${getCartTotal().toFixed(2)}</span>
              </p>
              <div className={styles.cartActions}>
                <button className={styles.clearCartButton} onClick={clearCart}>
                  <FaTrash className={styles.buttonIcon} /> Vaciar Carrito
                </button>
                <button className={styles.checkoutButton} onClick={openCheckoutModal}>
                  <FaMoneyBillWave className={styles.buttonIcon} /> Proceder al Pago
                </button>
              </div>
            </div>
            <button className={styles.backButton} onClick={() => navigate('/reservar')}>
              <FaArrowLeft className={styles.buttonIcon} /> Seguir Reservando
            </button>
          </>
        )}
      </div>

      {/* --- Modal de Checkout --- */}
      {showCheckoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModalButton} onClick={closeCheckoutModal}>
              <FaTimes />
            </button>
            <h3 className={styles.modalTitle}>Confirmar Reserva</h3>

            {checkoutMessage && (
              <div className={`${styles.statusMessage} ${checkoutMessage.type === 'success' ? styles.successMessage : checkoutMessage.type === 'error' ? styles.errorMessage : styles.infoMessage}`}>
                {checkoutMessage.message}
              </div>
            )}

            {!isLoggedInForCheckout ? (
              // Formulario de Login/Registro
              <div className={styles.authFormContainer}>
                {!showRegisterForm ? (
                  <>
                    <p className={styles.authPrompt}>Inicia sesión para confirmar tu reserva:</p>
                    <div className={styles.formField}>
                      <label htmlFor="authEmail" className={styles.formLabel}><FaEnvelope /> Email</label>
                      <input type="email" id="authEmail" name="email" className={styles.formInput} value={authFormData.email} onChange={handleAuthInputChange} disabled={isLoadingCheckout} />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="authPassword" className={styles.formLabel}><FaLock /> Contraseña</label>
                      <input type="password" id="authPassword" name="password" className={styles.formInput} value={authFormData.password} onChange={handleAuthInputChange} disabled={isLoadingCheckout} />
                    </div>
                    <button onClick={handleLoginAttempt} className={styles.authButton} disabled={isLoadingCheckout}>
                      {isLoadingCheckout ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                    <p className={styles.authToggle}>
                      ¿No tienes cuenta? <button onClick={() => setShowRegisterForm(true)} className={styles.linkButton}>Regístrate aquí</button>
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.authPrompt}>Regístrate para confirmar tu reserva:</p>
                    <div className={styles.formField}>
                      <label htmlFor="regEmail" className={styles.formLabel}><FaEnvelope /> Email</label>
                      <input type="email" id="regEmail" name="email" className={styles.formInput} value={authFormData.email} onChange={handleAuthInputChange} disabled={isLoadingCheckout} />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="regPassword" className={styles.formLabel}><FaLock /> Contraseña</label>
                      <input type="password" id="regPassword" name="password" className={styles.formInput} value={authFormData.password} onChange={handleAuthInputChange} disabled={isLoadingCheckout} />
                    </div>
                    <button onClick={handleSignupAttempt} className={styles.authButton} disabled={isLoadingCheckout}>
                      {isLoadingCheckout ? 'Registrando...' : 'Registrarse'}
                    </button>
                    <p className={styles.authToggle}>
                      ¿Ya tienes cuenta? <button onClick={() => setShowRegisterForm(false)} className={styles.linkButton}>Inicia sesión</button>
                    </p>
                  </>
                )}
              </div>
            ) : (
              // Vista de Confirmación de Reserva si está logeado
              <div className={styles.paymentConfirmation}>
                <p className={styles.paymentPrompt}>Estás logeado como: <strong>{localStorage.getItem('userEmailForProfessional') || 'Usuario'}</strong></p>
                <p className={styles.totalSummary}>Total de la reserva: <strong>${getCartTotal().toFixed(2)}</strong></p>
                
                {/* Contenedor que se va a CAPTURAR para el PDF */}
                <div ref={reservationPdfRef} className="pdf-content-wrapper">
                    <h2 className="pdf-header">Comprobante de Reserva</h2>
                    <p className="pdf-detail-row"><strong>ID de Reserva:</strong> {`RES-${Date.now()}`}</p>
                    <p className="pdf-detail-row"><strong>Estado:</strong> Confirmada</p>

                    <h3 className="pdf-section-title">Información del Cliente</h3>
                    <p className="pdf-detail-row"><strong>Nombre:</strong> {localStorage.getItem('userName') || 'N/A'}</p>
                    <p className="pdf-detail-row"><strong>Email:</strong> {localStorage.getItem('userEmailForProfessional') || 'N/A'}</p>

                    <h3 className="pdf-section-title">Servicios Reservados</h3>
                    <ul className="pdf-service-list">
                        {cartItems.map((item, index) => (
                            <li key={item.id + "-" + index} className="pdf-service-item">
                                {item.service.name} con {item.professional.name} el {formatDate(item.date)} a las {item.time} hs. - ${item.service.price.toFixed(2)} x {item.quantity} = ${(item.service.price * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p className="pdf-total-cost">Costo Total: ${getCartTotal().toFixed(2)}</p>

                    <p className="pdf-detail-row" style={{marginTop: '20px', textAlign: 'center', fontStyle: 'italic'}}>
                        ¡Gracias por tu reserva!
                    </p>
                    {/* Este botón estará oculto para la captura del PDF */}
                    <div id="pdf-download-button-inside" className="flex justify-center mt-4 hidden-for-pdf">
                        <button className="download-button-dummy">
                            <FaDownload /> Descargar
                        </button>
                    </div>
                </div>

                <button onClick={handleConfirmReservationAndPdf} className={styles.confirmPaymentButton} disabled={isLoadingCheckout || cartItems.length === 0}>
                  {isLoadingCheckout ? 'Confirmando...' : 'Confirmar Reserva y Descargar Comprobante'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

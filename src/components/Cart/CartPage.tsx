// src/components/Cart/CartPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlusCircle, FaMinusCircle, FaArrowLeft, FaMoneyBillWave, FaTimes, FaUserCircle, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useCart, CartItem } from './CartContext';
import styles from './CartPage.module.css'; // Importa el módulo CSS

// Declara el objeto 'MercadoPago' globalmente para TypeScript
declare global {
  interface Window {
    MercadoPago: any; // O un tipo más específico si tienes las definiciones de @types/mercadopago
  }
}

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // --- Estados para el Modal de Checkout ---
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({ email: '', password: '' });
  const [checkoutMessage, setCheckoutMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoggedInForCheckout, setIsLoggedInForCheckout] = useState(false); // Estado para controlar si el usuario está logeado para el checkout
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Para alternar entre login y registro
  const [preferenceId, setPreferenceId] = useState<string | null>(null); // Para almacenar el ID de preferencia de Mercado Pago

  const paymentBrickContainerRef = useRef<HTMLDivElement>(null); // Referencia al div donde se montará el Brick

  // --- CONFIGURACIÓN DE MERCADO PAGO ---
  // ¡TU PUBLIC_KEY DE MERCADO PAGO!
  const MERCADOPAGO_PUBLIC_KEY = 'TEST-7c51159f-d2dd-4e36-a58d-a747a6ae5199';
  // URL de TU BACKEND que creará la preferencia de pago.
  // Debe ser https://web-spa-hjzu.onrender.com/create_preference
  const BACKEND_CREATE_PREFERENCE_URL = 'https://web-spa-hjzu.onrender.com/create_preference';
  const BACKEND_LOGIN_URL = 'https://web-spa-hjzu.onrender.com/login';
  const BACKEND_REGISTER_URL = 'https://web-spa-hjzu.onrender.com/register';


  // Cargar el script de Mercado Pago SDK dinámicamente
  useEffect(() => {
    const loadMercadoPagoSdk = () => {
      if (document.getElementById('mercadopago-sdk')) {
        return; // Ya cargado
      }
      const script = document.createElement('script');
      script.id = 'mercadopago-sdk';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => {
        // Inicializar SDK cuando esté cargado
        if (window.MercadoPago && MERCADOPAGO_PUBLIC_KEY) { // Check for PUBLIC_KEY existence
          try {
            window.MercadoPago.setPublicKey(MERCADOPAGO_PUBLIC_KEY);
          } catch (e) {
            console.error("Error al establecer la clave pública de Mercado Pago:", e);
          }
        } else {
          console.warn("MercadoPago SDK no está listo o PUBLIC_KEY no configurada.");
        }
      };
      script.onerror = () => {
        setCheckoutMessage({ type: 'error', message: "Error al cargar el SDK de Mercado Pago. Intenta refrescar la página." });
      };
      document.body.appendChild(script);
    };

    loadMercadoPagoSdk();
  }, []);

  // Efecto para renderizar el Payment Brick cuando preferenceId esté disponible
  useEffect(() => {
    if (preferenceId && window.MercadoPago && paymentBrickContainerRef.current) {
      try {
        // Asegurarse de que el contenedor esté vacío antes de montar el nuevo Brick
        paymentBrickContainerRef.current.innerHTML = '';

        const mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
          locale: 'es-AR', // O el locale deseado
        });

        const bricksBuilder = mp.bricks();

        // Crear el Payment Brick
        bricksBuilder.create("payment", "paymentBrick_container", {
          initialization: {
            preferenceId: preferenceId,
          },
          callbacks: {
            onReady: () => {
              setCheckoutMessage({ type: 'info', message: "El formulario de pago está listo." });
              setIsLoadingCheckout(false); // Quitar loading una vez que el brick está listo
            },
            onAction: (action: any) => {
              console.log("Acción del Brick:", action);
              // Puedes manejar acciones específicas aquí si es necesario
            },
            onError: (error: any) => {
              console.error("Error en el Payment Brick:", error);
              setCheckoutMessage({ type: 'error', message: "Hubo un error en el proceso de pago. Por favor, intenta de nuevo." });
              setIsLoadingCheckout(false);
            },
            onReadyPayment: (paymentData: any) => {
                // ESTE CALLBACK SE EJECUTA CUANDO EL USUARIO HA COMPLETADO LOS DATOS DE PAGO EN EL BRICK.
                // AQUÍ DEBERÍAS ENVIAR 'paymentData' A TU BACKEND PARA FINALIZAR LA TRANSACCIÓN REAL.
                // TU BACKEND ES EL QUE LUEGO DEBE CONFIRMAR EL PAGO CON MP Y ACTUALIZAR TU BD.

                setCheckoutMessage({ type: 'info', message: "Enviando datos de pago al servidor..." });
                setIsLoadingCheckout(true);

                // --- LÓGICA DE PROCESAMIENTO FINAL EN BACKEND ---
                // Aquí deberías realizar un fetch POST a un endpoint en tu backend
                // que procesaría este paymentData con la API de Mercado Pago y confirmaría la orden.
                console.log("Datos de pago listos para enviar al backend:", paymentData);
                
                // Ejemplo de lo que tu backend DEBERÍA hacer:
                // const response = await fetch('https://web-spa-hjzu.onrender.com/process_payment', { // <--- Endpoint para procesar el pago final
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                //     },
                //     body: JSON.stringify({ paymentData, cartItems: cartItems }), // Envía los datos del carrito también
                // });
                // if (!response.ok) { /* handle error */ }
                // const result = await response.json(); /* handle success */

                // SIMULACIÓN: Tras un procesamiento exitoso en tu backend
                setTimeout(() => {
                    setCheckoutMessage({ type: 'success', message: "¡Pago procesado y confirmado! Tus reservas han sido creadas." });
                    clearCart(); // Limpiar carrito solo después de la confirmación exitosa del backend
                    setTimeout(() => {
                        closeCheckoutModal();
                        navigate('/'); // Redirige al inicio o a una página de confirmación/historial de reservas
                    }, 2000);
                }, 2000); // Simula 2 segundos de procesamiento
            }
          },
        });
      } catch (e) {
        console.error("Error al crear el Payment Brick de Mercado Pago:", e);
        setCheckoutMessage({ type: 'error', message: "No se pudo cargar el formulario de pago. Asegúrate de que tu PUBLIC_KEY es correcta." });
        setIsLoadingCheckout(false);
      }
    }
  }, [preferenceId, MERCADOPAGO_PUBLIC_KEY, clearCart, navigate]); // Dependencias del useEffect

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
      setCheckoutMessage({ type: 'error', message: 'Tu carrito está vacío. Añade servicios antes de proceder al pago.' });
      return;
    }
    setShowCheckoutModal(true);
    setCheckoutMessage(null); // Limpiar mensajes anteriores
    setPreferenceId(null); // Resetear preferenceId para forzar la recreación del Brick si se abre de nuevo
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
    setPreferenceId(null); // Limpiar preferenceId al cerrar el modal
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
      // Endpoint de login de tu backend
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
      localStorage.setItem('userRole', data.role); // 'ADMIN' o 'USER'
      localStorage.setItem('userEmailForProfessional', data.email); // Puede ser útil para rellenar datos

      setIsLoggedInForCheckout(true);
      setCheckoutMessage({ type: 'success', message: '¡Inicio de sesión exitoso! Ahora puedes proceder con el pago.' });
      // Después de logearse, si ya estamos en el flujo de pago, podemos intentar crear la preferencia
      // createMercadoPagoPreference(); // Podríamos llamar a esto directamente o esperar al click en el botón de pago
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
      // Endpoint de registro de tu backend
      const response = await fetch(BACKEND_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authFormData.email, password: authFormData.password, role: 'USER' }), // Asigna rol USER por defecto
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrarse. El email podría ya estar en uso.');
      }

      // Si el registro es exitoso, intenta iniciar sesión automáticamente
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

      setIsLoggedInForCheckout(true);
      setCheckoutMessage({ type: 'success', message: '¡Registro e inicio de sesión exitosos! Procediendo al pago.' });
    } catch (error: any) {
      setCheckoutMessage({ type: 'error', message: error.message || 'Error al registrarse.' });
      console.error("Signup error:", error);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  // Función para solicitar la creación de la preferencia de MP a tu backend
  const createMercadoPagoPreference = async () => {
    if (cartItems.length === 0) {
      setCheckoutMessage({ type: 'error', message: "El carrito está vacío." });
      return;
    }
    if (!isLoggedInForCheckout) {
        setCheckoutMessage({ type: 'error', message: "Debes iniciar sesión para generar el pago." });
        return;
    }

    setIsLoadingCheckout(true);
    setCheckoutMessage({ type: 'info', message: 'Creando preferencia de pago...' });
    setPreferenceId(null); // Limpiar cualquier preferenceId anterior para forzar que se genere uno nuevo

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("No hay token de autenticación. Inicie sesión nuevamente.");
      }

      // Mapear cartItems al formato de "items" que Mercado Pago espera
      const mpItems = cartItems.map(item => ({
        id: item.service.id, // ID del servicio
        title: `${item.service.name} (${item.professional.name} - ${item.date} ${item.time})`, // Título descriptivo
        unit_price: item.service.price,
        quantity: item.quantity,
        currency_id: 'ARS', // Moneda (Argentina)
      }));

      // LLAMADA A TU BACKEND para crear la preferencia de MP
      const response = await fetch(BACKEND_CREATE_PREFERENCE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Envía el token de autenticación
        },
        body: JSON.stringify({ items: mpItems, total: getCartTotal() }), // Envía los ítems y el total
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la preferencia de pago en el backend.');
      }

      const data = await response.json();
      // Asume que tu backend devuelve { preferenceId: '...' }
      setPreferenceId(data.preferenceId);
      setCheckoutMessage({ type: 'info', message: "Formulario de pago de Mercado Pago cargando..." });

    } catch (error: any) {
      setCheckoutMessage({ type: 'error', message: error.message || 'Error al preparar el pago.' });
      console.error("Mercado Pago preference creation error:", error);
    } finally {
      // El loading se desactiva en el onReady del Brick o en un error del Brick
      // setIsLoadingCheckout(false); // No desactivar aquí, el Brick controlará esto
    }
  };


  return (
    <div className={styles.cartPageContainer}>
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
            <h3 className={styles.modalTitle}>Finalizar Compra</h3>

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
                    <p className={styles.authPrompt}>Inicia sesión para continuar:</p>
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
                    <p className={styles.authPrompt}>Regístrate para continuar:</p>
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
              // Vista de Confirmación de Pago si está logeado
              <div className={styles.paymentConfirmation}>
                <p className={styles.paymentPrompt}>Estás logeado como: <strong>{localStorage.getItem('userEmailForProfessional') || 'Usuario'}</strong></p>
                <p className={styles.totalSummary}>Total a pagar: <strong>${getCartTotal().toFixed(2)}</strong></p>
                
                {/* Contenedor donde Mercado Pago montará el Payment Brick */}
                {preferenceId ? (
                    <div id="paymentBrick_container" ref={paymentBrickContainerRef} className={styles.paymentBrickContainer}>
                        {/* El Payment Brick de MP se renderizará aquí */}
                        {isLoadingCheckout && ( // Mostrar un spinner si está cargando el brick
                            <div className={styles.loadingSpinner}></div>
                        )}
                    </div>
                ) : (
                    <button onClick={createMercadoPagoPreference} className={styles.confirmPaymentButton} disabled={isLoadingCheckout || cartItems.length === 0}>
                        {isLoadingCheckout ? 'Generando Pago...' : 'Generar Pago con Mercado Pago'}
                    </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

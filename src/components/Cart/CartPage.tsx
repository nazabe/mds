// src/components/Cart/CartPage.tsx
import React from 'react';
// Asegúrate de importar useCart y CartItem
import { useCart, CartItem } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaPlus, FaMinus, FaArrowLeft, FaCreditCard, FaCalendarAlt, FaClock, FaDollarSign, FaUserCircle } from 'react-icons/fa'; // Importa iconos necesarios
import styles from './CartPage.module.css'; // Asegúrate de esta línea

const CartPage: React.FC = () => {
  // Obtiene las funciones y el estado del carrito del contexto
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Función para manejar el checkout (simulado)
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío. No puedes finalizar la compra.");
      return;
    }
    // Aquí puedes añadir la lógica para iniciar el proceso de pago
    // Por ahora, solo mostraremos un mensaje y limpiaremos el carrito.
    // En una aplicación real, esto implicaría:
    // 1. Recopilar los datos del cliente (login si no está logeado).
    // 2. Enviar los datos del carrito y del cliente a un backend para procesar el pago y crear las reservas finales.
    alert('¡Procesando tu pedido! (Funcionalidad de pago no implementada)');
    clearCart(); // Limpia el carrito después de un "checkout" simulado
    navigate('/'); // Opcional: Navega a la página de inicio o a una página de confirmación
  };

  return (
    // Reemplaza clases de Tailwind con las de CSS Modules
    <div className={styles.cartPageContainer}>
      <h2 className={styles.pageTitle}>
        <FaShoppingCart className={styles.buttonIcon} />Tu Carrito de Reservas
      </h2>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCartMessage}>
          <p className="text-lg mb-4">Tu carrito está vacío. ¡Añade algunos servicios para reservar!</p>
          <button
            onClick={() => navigate('/reservar')}
            className={styles.continueShoppingButton}
          >
            <FaArrowLeft className={styles.buttonIcon} /> Ir a Reservar
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartItemsContainer}> {/* Reemplaza overflow-x-auto mb-6 */}
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className={styles.cartItem}> {/* Un div por cada item de carrito */}
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.service.name}</h3>
                  <p className={styles.itemDetail}>
                    <FaUserCircle className={styles.infoIcon} />
                    Profesional: <strong>{item.professional.name}</strong>
                  </p>
                  <p className={styles.itemDetail}>
                    <FaCalendarAlt className={styles.infoIcon} />
                    Fecha: <strong>{item.date}</strong>
                  </p>
                  <p className={styles.itemDetail}>
                    <FaClock className={styles.infoIcon} />
                    Hora: <strong>{item.time}</strong>
                  </p>
                  <p className={styles.itemDetail}>
                    <FaDollarSign className={styles.infoIcon} />
                    Precio Unitario: <strong>${item.service.price.toFixed(2)}</strong>
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className={styles.quantityButton}
                      disabled={item.quantity <= 1} // Deshabilita si la cantidad es 1
                    >
                      <FaMinus />
                    </button>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className={styles.quantityButton}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeButton}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <span className={styles.summaryTotal}>Total:</span>
            <span className={styles.totalAmount}>${getCartTotal().toFixed(2)}</span>
          </div>

          <div className={styles.cartActions}>
            <button
              onClick={() => navigate('/reservar')}
              className={styles.continueShoppingButton}
            >
              <FaArrowLeft className={styles.buttonIcon} /> Seguir Reservando
            </button>
            <button
              onClick={clearCart}
              className={styles.clearCartButton}
            >
              <FaTrashAlt className={styles.buttonIcon} /> Vaciar Carrito
            </button>
            <button
              onClick={handleCheckout}
              className={styles.checkoutButton}
            >
              <FaCreditCard className={styles.buttonIcon} /> Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

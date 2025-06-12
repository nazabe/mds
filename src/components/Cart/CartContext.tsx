// src/components/Cart/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Interfaces para los ítems del Carrito ---
export interface CartItem {
  id: string; // ID único para este item del carrito
  service: { // Objeto service para mantener la estructura original
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  };
  professional: { // Objeto professional para mantener la estructura original
    id: string;
    name: string;
    specialty: string;
  };
  date: string; // Formato "YYYY-MM-DD"
  time: string; // Formato "HH:MM"
  quantity: number; // NUEVO: Cantidad del servicio en el carrito
  notes?: string;
}

// --- Interfaz del Contexto del Carrito (Añadidas funciones de cantidad) ---
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void; // Permite añadir con cantidad opcional
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  increaseQuantity: (itemId: string) => void; // NUEVO: Para aumentar cantidad
  decreaseQuantity: (itemId: string) => void; // NUEVO: Para disminuir cantidad
  getCartTotal: () => number;
}

// Crea el contexto del carrito
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Componente Proveedor del Carrito ---
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('spa_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al parsear el carrito de localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('spa_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    // Busca si el item ya existe en el carrito (mismo servicio, profesional, fecha, hora)
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.service.id === item.service.id &&
        cartItem.professional.id === item.professional.id &&
        cartItem.date === item.date &&
        cartItem.time === item.time
    );

    if (existingItemIndex > -1) {
      // Si el item existe, aumenta su cantidad
      setCartItems((prevItems) =>
        prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        )
      );
    } else {
      // Si el item no existe, lo añade como nuevo
      const newItem: CartItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Genera un ID único para cada instancia
        quantity: item.quantity || 1, // Usa la cantidad proporcionada o 1 por defecto
      };
      setCartItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const increaseQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item // Cantidad mínima 1
      ).filter(item => item.quantity > 0) // Si la cantidad llega a 0, elimina el item
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.service.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

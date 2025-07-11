// src/components/LoginPage/LoginPage.tsx
import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Por favor, ingrese usuario y contraseña.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://backend-ecommerce-50vz.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // aunque el campo sea "email", se envía como username
          password: formData.password,
        }),

      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciales incorrectas.");
        } else {
          throw new Error("Error en el servidor. Intenta más tarde.");
        }
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      const { token, roles, email } = data;

      if (!token || roles.length === 0) {
        throw new Error("Credenciales válidas pero sin rol asignado.");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmailForProfessional", email);

      // Asumimos que solo importa el primer rol por ahora
      const mainRole = roles[0]; // podés hacer lógica más compleja si necesitás

      localStorage.setItem("userRole", mainRole.toUpperCase());

      if (mainRole === "admin") {
        navigate("/admin/dashboard");
      } else if (mainRole === "professional") {
        navigate("/professional/dashboard");
      } else if (mainRole === "user") {
        navigate("/");
      } else {
        throw new Error("Rol desconocido.");
      }

    } catch (err: unknown) {
      console.error("Error durante el login:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al intentar iniciar sesión.");
      }
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.pageTitle}>Acceso Administrativo</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {isLoading && (
          <div className={styles.loadingMessage}>Iniciando sesión...</div>
        )}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="email">
              Usuario
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className={styles.formInput}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingresa tu email"
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formInput}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña (ej: password123 o profpass)"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={!formData.email || !formData.password || isLoading}
          >
            {isLoading ? "Iniciando..." : "INICIAR SESIÓN"}
          </button>
        </form>
        <p className={styles.explanatoryText}>
          Este es un acceso exclusivo para administradores y profesionales del
          sistema.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

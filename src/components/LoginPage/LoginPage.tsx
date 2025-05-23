// src/components/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
        setError("Por favor, ingrese usuario y contraseña.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        let success = false;
        let role = '';
        let professionalEmail: string | null = null;

        // Credenciales de administrador simuladas
        if (formData.username === 'admin' && formData.password === 'password123') {
            success = true;
            role = 'admin';
        }
        // Credenciales de profesional simuladas
        else if (formData.username === 'ana.felicidad@spa.com' && formData.password === 'profpass') {
            success = true;
            role = 'professional';
            professionalEmail = formData.username;
        }
        else if (formData.username === 'dra.lopez@spa.com' && formData.password === 'profpass') {
            success = true;
            role = 'professional';
            professionalEmail = formData.username;
        }
        else if (formData.username === 'dr.garcia@spa.com' && formData.password === 'profpass') {
            success = true;
            role = 'professional';
            professionalEmail = formData.username;
        }
        else if (formData.username === 'lic.perez@spa.com' && formData.password === 'profpass') {
            success = true;
            role = 'professional';
            professionalEmail = formData.username;
        }
        // NUEVO: Credenciales de cliente simuladas
        else if (formData.username === 'cliente@ejemplo.com' && formData.password === 'clientpass') {
            success = true;
            role = 'client'; // O 'user' si prefieres esa nomenclatura
        }
        else {
            setError("Usuario o contraseña incorrectos.");
        }

        if (success) {
            localStorage.setItem('authToken', `fake-${role}-token-${Date.now()}`);
            localStorage.setItem('userRole', role);
            if (professionalEmail) {
                localStorage.setItem('userEmailForProfessional', professionalEmail);
            } else {
                localStorage.removeItem('userEmailForProfessional');
            }
            console.log(`Inicio de sesión exitoso como ${role}. Redirigiendo...`);

            // Redirecciona al dashboard correspondiente según el rol
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'professional') {
                navigate('/professional/dashboard');
            } else if (role === 'client') { // NUEVO: Redirección para el rol 'client'
                navigate('/'); // Redirige a la página de inicio (index)
            } else {
                // Esto no debería ocurrir si todos los roles están cubiertos
                console.error("Rol desconocido después del login:", role);
                navigate('/'); // Redirige a la página de inicio por defecto
            }

        }

    } catch (err: any) {
        console.error("Error durante el login:", err);
        setError(err.message || "Ocurrió un error al intentar iniciar sesión.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.pageTitle}>Acceso Administrativo</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {isLoading && <div className={styles.loadingMessage}>Iniciando sesión...</div>}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.formInput}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ej: admin, ana.felicidad@spa.com o cliente@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formInput}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ej: password123, profpass o clientpass"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={!formData.username || !formData.password || isLoading}
          >
            {isLoading ? 'Iniciando...' : 'INICIAR SESIÓN'}
          </button>
        </form>
        <p className={styles.explanatoryText}>
          Este es un acceso exclusivo para administradores y profesionales del sistema.
          <br/>
          (Prueba cliente: cliente@ejemplo.com / clientpass)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

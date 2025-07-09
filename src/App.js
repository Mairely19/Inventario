import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AuthForm from './components/AuthForm';
import InventoryApp from './InventoryApp';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si ya existe un usuario registrado
    const user = localStorage.getItem('inventory_user');
    setIsRegister(!user);
  }, []);

  const handleWelcomeContinue = () => {
    setShowWelcome(false);
    setShowAuth(true);
  };

  const handleAuth = (username, password) => {
    if (isRegister) {
      // Registrar nuevo usuario
      localStorage.setItem('inventory_user', JSON.stringify({
        username,
        password // En producción, usaría bcrypt para hashear
      }));
      setIsRegister(false);
    } else {
      // Verificar credenciales
      const user = JSON.parse(localStorage.getItem('inventory_user'));
      if (!user || username !== user.username || password !== user.password) {
        alert('Credenciales incorrectas');
        return;
      }
    }

    setIsAuthenticated(true);
    setShowAuth(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  if (showAuth) {
    return <AuthForm onAuth={handleAuth} isRegister={isRegister} />;
  }

  return isAuthenticated ? <InventoryApp /> : null;
};

export default App;
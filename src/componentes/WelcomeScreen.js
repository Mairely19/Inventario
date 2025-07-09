import React from 'react';

const WelcomeScreen = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">Bienvenido a InventoryPro</h1>
          <p className="text-xl opacity-90">
            La solución completa para la gestión de inventarios de tu negocio
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
          <p className="text-lg mb-6">
            Registra productos, controla stock, gestiona ventas y obtén reportes en tiempo real
          </p>
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
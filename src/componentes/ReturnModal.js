import React, { useState } from 'react';

const ReturnModal = ({ product, quantity, onConfirm, onCancel }) => {
  const [returnType, setReturnType] = useState('customer');
  const [isExchange, setIsExchange] = useState(false);
  const [exchangeQuantity, setExchangeQuantity] = useState(0);
  const [details, setDetails] = useState({
    name: '',
    reason: '',
    contact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleExchangeChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setExchangeQuantity(Math.min(value, quantity));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...details,
      type: returnType,
      quantity,
      isExchange,
      exchangeQuantity: isExchange ? exchangeQuantity : 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Registrar Devolución</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Devolución
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="returnType"
                  value="customer"
                  checked={returnType === 'customer'}
                  onChange={() => {
                    setReturnType('customer');
                    setIsExchange(false);
                  }}
                />
                <span className="ml-2">De Cliente</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="returnType"
                  value="supplier"
                  checked={returnType === 'supplier'}
                  onChange={() => setReturnType('supplier')}
                />
                <span className="ml-2">A Proveedor</span>
              </label>
            </div>
          </div>

          {returnType === 'supplier' && (
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isExchange}
                  onChange={() => setIsExchange(!isExchange)}
                  className="form-checkbox"
                />
                <span>¿Es un cambio por productos buenos?</span>
              </label>

              {isExchange && (
                <div className="mt-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Cantidad a cambiar (máx: {quantity})
                  </label>
                  <input
                    type="number"
                    value={exchangeQuantity}
                    onChange={handleExchangeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                    max={quantity}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo esta cantidad se sumará al stock como productos buenos
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {returnType === 'customer' ? 'Nombre del Cliente' : 'Nombre del Proveedor'}
            </label>
            <input
              type="text"
              name="name"
              value={details.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo
            </label>
            <input
              type="text"
              name="reason"
              value={details.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {returnType === 'customer' ? 'Contacto del Cliente' : 'Contacto del Proveedor'}
            </label>
            <input
              type="text"
              name="contact"
              value={details.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <p className="text-sm">
              Producto: <span className="font-semibold">{product.name}</span>
            </p>
            <p className="text-sm">
              Cantidad: <span className="font-semibold">{quantity}</span>
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;

// DONE
import React, { useState } from 'react';

const ProductList = ({ products, onEdit, onDelete, onSell, onReturn, onInternalUse }) => {
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value === '' ? '' : Math.max(0, Number(value))
    }));
    setError('');
  };

  const handleAction = (action, productId) => {
    const quantity = quantities[productId];
    const product = products.find(p => p.id === productId);

    if (!quantity || quantity <= 0) {
      setError('Ingrese una cantidad válida');
      return;
    }

    if (action === 'sell' || action === 'internalUse') {
      if (quantity > product.stock) {
        setError(`No hay suficiente stock. Disponible: ${product.stock}`);
        return;
      }
    }

    switch (action) {
      case 'sell':
        onSell(productId, quantity);
        break;
      case 'return':
        onReturn(productId, quantity);
        break;
      case 'internalUse':
        onInternalUse(productId, quantity);
        break;
      default:
        return;
    }

    setQuantities(prev => ({ ...prev, [productId]: '' }));
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className={product.stock < 10 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        min="1"
                        max={product.stock}
                        placeholder="Cantidad"
                      />
                      <button
                        onClick={() => handleAction('sell', product.id)}
                        disabled={product.stock === 0}
                        className={`px-2 py-1 rounded-md text-xs ${
                          product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        Vender
                      </button>
                      <button
                        onClick={() => handleAction('return', product.id)}
                        className="px-2 py-1 rounded-md text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Devolución
                      </button>
                      <button
                        onClick={() => handleAction('internalUse', product.id)}
                        disabled={product.stock === 0}
                        className={`px-2 py-1 rounded-md text-xs ${
                          product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        Uso Interno
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
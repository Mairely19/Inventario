import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Reports from './components/Reports';
import ReturnModal from './components/ReturnModal';
import { initialProducts } from './mock/products';
import { initialSales } from './mock/sales';

const InventoryApp = () => {
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [returns, setReturns] = useState([]);
  const [internalUses, setInternalUses] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  // Cargar datos del localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('inventory-products')) || initialProducts;
    const savedSales = JSON.parse(localStorage.getItem('inventory-sales')) || initialSales;
    const savedReturns = JSON.parse(localStorage.getItem('inventory-returns')) || [];
    const savedInternalUses = JSON.parse(localStorage.getItem('inventory-internal-uses')) || [];
    
    setProducts(savedProducts);
    setSales(savedSales);
    setReturns(savedReturns);
    setInternalUses(savedInternalUses);
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
    localStorage.setItem('inventory-sales', JSON.stringify(sales));
    localStorage.setItem('inventory-returns', JSON.stringify(returns));
    localStorage.setItem('inventory-internal-uses', JSON.stringify(internalUses));
  }, [products, sales, returns, internalUses]);

  const addProduct = (product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setEditingProduct(null);
    setShowForm(false);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const sellProduct = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product || !quantity || quantity <= 0) return;

    const sale = {
      productId,
      productName: product.name,
      price: product.price,
      quantity,
      date: new Date().toISOString().split('T')[0]
    };

    setSales(prev => [...prev, sale]);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  const handleReturnClick = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product || !quantity || quantity <= 0) return;

    setCurrentProduct(product);
    setCurrentQuantity(quantity);
    setShowReturnModal(true);
  };

  const confirmReturn = (returnData) => {
    const product = currentProduct;
    const returnItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: returnData.quantity,
      date: new Date().toISOString().split('T')[0],
      type: returnData.type,
      name: returnData.name,
      reason: returnData.reason,
      contact: returnData.contact,
      isExchange: returnData.isExchange,
      exchangeQuantity: returnData.exchangeQuantity || 0
    };

    setReturns(prev => [...prev, returnItem]);
    
    // Lógica de actualización de stock
    let stockChange = returnData.quantity;
    if (returnData.type === 'customer') {
      // Devolución de cliente: suma al stock
      stockChange = returnData.quantity;
    } else {
      // Devolución a proveedor
      if (returnData.isExchange) {
        // Cambio con proveedor: resta total pero suma los buenos
        stockChange = -returnData.quantity + returnData.exchangeQuantity;
      } else {
        // Devolución pura: resta del stock
        stockChange = -returnData.quantity;
      }
    }
    
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, stock: p.stock + stockChange } : p
    ));

    setShowReturnModal(false);
  };

  const internalUseProduct = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product || !quantity || quantity <= 0) return;

    const internalUse = {
      productId,
      productName: product.name,
      quantity,
      date: new Date().toISOString().split('T')[0],
      reason: 'Uso interno'
    };

    setInternalUses(prev => [...prev, internalUse]);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  const filteredProducts = lowStockFilter 
    ? products.filter(p => p.stock < 10) 
    : products;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">InventoryPro</h1>
        
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventario
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reportes
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={lowStockFilter}
                    onChange={() => setLowStockFilter(!lowStockFilter)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Mostrar solo bajo stock (menos de 10)</span>
                </label>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Agregar Producto
              </button>
            </div>

            {showForm && (
              <ProductForm
                onSubmit={addProduct}
                initialData={editingProduct}
                onCancel={() => {
                  setEditingProduct(null);
                  setShowForm(false);
                }}
              />
            )}

            <ProductList
              products={filteredProducts}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={deleteProduct}
              onSell={sellProduct}
              onReturn={handleReturnClick}
              onInternalUse={internalUseProduct}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <Reports sales={sales} returns={returns} internalUses={internalUses} />
        )}

        {showReturnModal && currentProduct && (
          <ReturnModal
            product={currentProduct}
            quantity={currentQuantity}
            onConfirm={confirmReturn}
            onCancel={() => setShowReturnModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryApp;
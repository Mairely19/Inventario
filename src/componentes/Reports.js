import React from 'react';

const Reports = ({ sales = [], returns = [], internalUses = [] }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Filtros seguros con valores por defecto
  const todaySales = Array.isArray(sales) ? sales.filter(sale => sale?.date === today) : [];
  const todayReturns = Array.isArray(returns) ? returns.filter(ret => ret?.date === today) : [];
  const todayInternalUses = Array.isArray(internalUses) ? internalUses.filter(use => use?.date === today) : [];

  // Cálculos con manejo seguro
  const totalSales = todaySales.reduce((sum, sale) => sum + (sale?.price || 0) * (sale?.quantity || 0), 0);
  const totalItemsSold = todaySales.reduce((sum, sale) => sum + (sale?.quantity || 0), 0);
  const totalReturns = todayReturns.reduce((sum, ret) => sum + (ret?.quantity || 0), 0);
  const totalInternalUses = todayInternalUses.reduce((sum, use) => sum + (use?.quantity || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Reporte Diario - {today}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Ventas Totales</h3>
          <p className="text-2xl font-bold text-blue-600">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Artículos Vendidos</h3>
          <p className="text-2xl font-bold text-green-600">{totalItemsSold}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Devoluciones</h3>
          <p className="text-2xl font-bold text-purple-600">{totalReturns}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-800">Uso Interno</h3>
          <p className="text-2xl font-bold text-orange-600">{totalInternalUses}</p>
        </div>
      </div>

      {/* Secciones de detalle */}
      <ReportSection 
        title="Ventas del Día" 
        data={todaySales} 
        columns={[
          { header: 'Producto', accessor: 'productName' },
          { header: 'Cantidad', accessor: 'quantity' },
          { header: 'Precio Unitario', accessor: 'price', format: value => `$${value?.toFixed(2)}` },
          { header: 'Total', accessor: item => (item.price * item.quantity).toFixed(2), format: value => `$${value}` }
        ]}
      />

      <ReportSection 
        title="Devoluciones del Día" 
        data={todayReturns} 
        columns={[
          { header: 'Producto', accessor: 'productName' },
          { header: 'Cantidad', accessor: 'quantity' },
          { header: 'Tipo', accessor: 'type', format: value => value === 'customer' ? 'Cliente' : 'Proveedor' },
          { header: 'Nombre', accessor: 'name' },
          { header: 'Motivo', accessor: 'reason' }
        ]}
      />

      <ReportSection 
        title="Uso Interno del Día" 
        data={todayInternalUses} 
        columns={[
          { header: 'Producto', accessor: 'productName' },
          { header: 'Cantidad', accessor: 'quantity' },
          { header: 'Motivo', accessor: 'reason' }
        ]}
      />
    </div>
  );
};

const ReportSection = ({ title, data = [], columns = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500">No hay registros</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => {
                  const value = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
                  const formattedValue = col.format ? col.format(value) : value;
                  return (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
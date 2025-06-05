import React, { useState }  from 'react';

interface ProductionData {
  produccion: string;
  cantidad: number;
  descripcion: string;
  planta: string;
  fecha: string;
}

interface ProductionTableViewProps {
    data: {
      id: string;
      produccion: string;
      cantidad: number;
      descripcion: string;
      planta: string;
      fecha: string;
      perdidas?: number;
    }[];
  }
  const ProductionView: React.FC<ProductionTableViewProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      produccion: '',
      cantidad: '',
      descripcion: '',
      planta: 'Santa Catalina',
      fecha: ''
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Lógica para guardar la producción
      console.log('Datos a guardar:', formData);
      setIsModalOpen(false);
    };
  
    const handleEdit = (id: string) => {
      // Lógica para editar
      console.log('Editar item:', id);
    };
  
    const handleDelete = (id: string) => {
      // Lógica para eliminar
      console.log('Eliminar item:', id);
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Botón para abrir el modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Registro de Producción</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Producción
          </button>
        </div>
  
        {/* Tabla de producción */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-3 text-left">Producción</th>
                <th className="px-6 py-3 text-left">Cantidad</th>
                <th className="px-6 py-3 text-left">Planta</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">{item.produccion}</td>
                  <td className="px-6 py-4">{item.cantidad}</td>
                  <td className="px-6 py-4">{item.planta}</td>
                  <td className="px-6 py-4">{item.fecha}</td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-blue-50"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Modal para registrar producción */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-bold text-gray-800">Registrar Nueva Producción</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Producto</label>
                  <input
                    type="text"
                    name="produccion"
                    value={formData.produccion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Planta</label>
                  <select
                    name="planta"
                    value={formData.planta}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option>Santa Catalina</option>
                    <option>Otra Planta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Guardar Producción
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ProductionView;
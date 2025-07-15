import React, { useState } from 'react';
import { useCreateProduct } from '@/modules/production/hook/useProducts';
import { useFetchCategories } from '@/modules/production/hook/useCategories';
import { X, UploadCloud, Link } from 'lucide-react';

interface ModalCreateProductoProps {
  isOpen: boolean;
  onClose: () => void;
  // La prop categories no se usa, ya que se obtienen con el hook. Se puede eliminar.
  // categories: { id: string; name: string; description: string; createdAt?: Date; updatedAt?: Date }[];
}

const ModalCreateProducto: React.FC<ModalCreateProductoProps> = ({ isOpen, onClose }) => {
  // Estado para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // --- CAMBIOS CLAVE PARA LA SUBIDA DE IMÁGENES ---
  // 1. Estado para el modo de subida ('url' o 'file')
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  
  // 2. Estados separados para la URL y el archivo
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 3. Estado para la vista previa de la imagen local
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // --- FIN DE CAMBIOS CLAVE ---

  const [errors, setErrors] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
  });

  const createProductMutation = useCreateProduct();
  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();

  // Función para manejar el cambio en el input de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Crear una URL temporal para la vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    // La validación de campos de texto sigue siendo la misma
    const newErrors = {
      nombre: !nombre ? 'El nombre es obligatorio.' : '',
      categoria: !categoria ? 'La categoría es obligatoria.' : '',
      precio: !precio ? 'El precio es obligatorio.' : '',
      descripcion: !descripcion ? 'La descripción es obligatoria.' : '',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    
    // --- LÓGICA DE ENVÍO MODIFICADA ---
    // Ahora, en lugar de un objeto JSON, usamos FormData, 
    // que puede manejar tanto texto como archivos.
    const formData = new FormData();
    formData.append('name', nombre);
    formData.append('category_id', categoria);
    formData.append('price', precio);
    formData.append('description', descripcion);

    // Adjuntar la información de la imagen según el modo seleccionado
    if (uploadMode === 'file' && imageFile) {
      // El nombre 'image' DEBE coincidir con el del middleware de multer: upload.single('image')
      formData.append('image', imageFile);
    } else if (uploadMode === 'url' && imageUrl) {
      formData.append('imagen_url', imageUrl);
    }

    try {
      // El hook useCreateProduct debe estar preparado para recibir FormData
      await createProductMutation.mutateAsync(formData);
      onClose(); // Cerrar el modal al tener éxito
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Error al crear el producto. Por favor, intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  // Limpiar estados al cambiar de modo para una mejor UX
  const handleModeChange = (mode: 'url' | 'file') => {
    setUploadMode(mode);
    setImageUrl('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] mx-auto max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Registrar Nuevo Producto</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-red-700 transition-colors text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 gap-8">
          <div className="space-y-6">
            {/* Campos de texto (sin cambios) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto*</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ej: Pizza Margarita"/>
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría*</label>
              {isLoadingCategorias ? ( <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div> ) : errorCategorias ? ( <p className="text-red-500 text-sm">Error al cargar categorías</p> ) : (
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Seleccione una categoría</option>
                  {Array.isArray(categorias) && categorias?.map((cat) => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                </select>
              )}
              {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/.)*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/.</span>
                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0.00" step="0.01"/>
              </div>
              {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción*</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Descripción detallada del producto" rows={3}/>
              {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
            </div>

            {/* --- SECCIÓN DE IMAGEN MODIFICADA --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
              
              {/* Switch para elegir el modo */}
              <div className="flex items-center rounded-lg bg-gray-100 p-1 mb-4">
                <button onClick={() => handleModeChange('url')} className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${uploadMode === 'url' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                  <Link size={16} />
                  <span>URL</span>
                </button>
                <button onClick={() => handleModeChange('file')} className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${uploadMode === 'file' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                  <UploadCloud size={16} />
                  <span>Subir Archivo</span>
                </button>
              </div>

              {/* Input condicional basado en el modo */}
              {uploadMode === 'url' ? (
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              ) : (
                <div className="w-full">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                    <div className="flex justify-center items-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{imageFile ? imageFile.name : "Selecciona un archivo"}</span> o arrástralo aquí
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                      </div>
                    </div>
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                </div>
              )}

              {/* Vista previa unificada */}
              {(imagePreview || imageUrl) && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Vista previa"
                    className="h-32 w-32 object-cover rounded-lg border shadow-sm"
                    // Limpiar la URL de objeto para evitar fugas de memoria
                    onLoad={(e) => { if (imagePreview) URL.revokeObjectURL(e.currentTarget.src) }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200">
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateProducto;
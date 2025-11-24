import api from '@/core/config/client';
import type { 
  BuysProductWithRelations, 
  CreateBuysProductPayload, 
  UpdateBuysProductPayload,
  BuysProductResponse 
} from '../types/buysProduct';

export const fetchBuysProducts = async (): Promise<BuysProductWithRelations[]> => {
  const response = await api.get('/buysProduct');
  
  // Manejo flexible de respuesta del backend
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};


export const fetchAllBuysProducts = async (): Promise<BuysProductWithRelations[]> => {
  const response = await api.get('/buysProduct/all');
  
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};


export const getBuysProduct = async (id: string): Promise<BuysProductWithRelations> => {
  const response = await api.get(`/buysProduct/${id}`);
  return response.data;
};


// IMPORTANTE: Si existe mismo warehouse_id + product_id, suma cantidades
export const createBuysProduct = async (payload: CreateBuysProductPayload): Promise<BuysProductResponse> => {
  const response = await api.post<BuysProductResponse>('/buysProduct', payload);

  // Intento adicional: crear un producto "no producible" en el módulo de productos
  // usando los datos esenciales de la compra (name, category, unit_price).
  // Este proceso es _opcional_: si falla no debe impedir que la compra se cree.
  try {
    // Determinar category_id. Si payload.category parece ser un UUID lo usamos,
    // si no, buscamos por nombre en /categories y si no existe lo creamos.
    let categoryId: string | undefined;
    const categoryCandidate = (payload as any).category;
    const isUuid = typeof categoryCandidate === 'string' && /^[0-9a-fA-F-]{36,36}$/.test(categoryCandidate);

    if (isUuid) {
      categoryId = categoryCandidate;
    } else if (typeof categoryCandidate === 'string' && categoryCandidate.trim() !== '') {
      // Buscar categoría por nombre
      const catsResp = await api.get('/categories');
      const categoriesList = Array.isArray(catsResp.data?.data) ? catsResp.data.data : (Array.isArray(catsResp.data) ? catsResp.data : []);
      const found = categoriesList.find((c: any) => String(c.name).toLowerCase() === categoryCandidate.toLowerCase());
      if (found && found.id) {
        categoryId = found.id;
      } else {
        // Crear categoría si no existe
        const newCatResp = await api.post('/categories', { name: categoryCandidate, description: '' });
        categoryId = newCatResp.data?.id || newCatResp.data?.data?.id;
      }
    }

    // Construir payload para crear producto. Si no tenemos categoryId, omitir creación.
    if (categoryId) {
      const productPayload = {
        name: payload.name,
        category_id: categoryId,
        price: payload.unit_price,
        description: `Creado desde compra (supplier: ${payload.supplier_id})`,
      };

      // Llamada a endpoint de productos
      const prodResp = await api.post('/products', productPayload);
      // Adjuntar información del producto creado en la respuesta final si está disponible
      if (prodResp?.data) {
        // Intentamos colocar el objeto creado dentro de response.data.product para consumo en UI
        if (!response.data) response.data = { success: true } as any;
        (response.data as any).product = prodResp.data;
      }
    }
  } catch (err) {
    // No lanzar: la creación del producto no debe romper la creación de la compra.
    // Logueamos para depuración y seguimos.
    // eslint-disable-next-line no-console
    console.warn('No se pudo crear producto no producible automáticamente:', err);
  }

  return response.data;
};


export const updateBuysProduct = async (
  id: string, 
  payload: UpdateBuysProductPayload
): Promise<BuysProductWithRelations> => {
  const response = await api.patch<BuysProductWithRelations>(`/buysProduct/${id}`, payload);
  return response.data;
};

export const deleteBuysProduct = async (id: string): Promise<void> => {
  await api.put(`/buysProduct/${id}`, { status: false });
};

export const reactivateBuysProduct = async (id: string): Promise<void> => {
  await api.put(`/buysProduct/${id}`, { status: true });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  fetchProductPurchased,
  createProductPurchased,
  updateProductPurchased,
  deleteProductPurchased
} from '../action/productPurchased';
import {
  ProductPurchased,
  CreateProductPurchasedPayload,
  UpdateProductPurchasedPayload
} from '../types/productPurchased';

const PRODUCT_PURCHASED_QUERY_KEY = 'productPurchased';

export interface ProductPurchasedSearchResult {
  id: string;
  name: string;
  description: string | null;
  isExisting: boolean;
}

/**
 * Hook para OBTENER la lista de productos comprados.
 */
export const useFetchProductPurchased = () => {
  return useQuery<ProductPurchased[], Error>({
    queryKey: [PRODUCT_PURCHASED_QUERY_KEY],
    queryFn: fetchProductPurchased,
  });
};

/**
 * Hook para CREAR un nuevo producto comprado.
 */
export const useCreateProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductPurchased, Error, CreateProductPurchasedPayload>({
    mutationFn: createProductPurchased,
    onSuccess: () => {
      // Cuando la creación es exitosa, invalidamos la caché para que la lista se actualice.
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};

/**
 * Hook para ACTUALIZAR un producto comprado.
 */
export const useUpdateProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductPurchased, Error, { id: string; payload: UpdateProductPurchasedPayload }>({
    mutationFn: ({ id, payload }) => updateProductPurchased(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};

/**
 * Hook para ELIMINAR (lógicamente) un producto comprado.
 */
export const useDeleteProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProductPurchased,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};

export const useProductPurchasedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ProductPurchasedSearchResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductPurchasedSearchResult | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const { data: products, isLoading } = useFetchProductPurchased();
  const createProductMutation = useCreateProductPurchased();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered =
      products
        ?.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || null,
          isExisting: true,
        })) || [];

    const hasExactMatch = filtered.some(
      (product) => product.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!hasExactMatch && searchTerm.trim().length > 2) {
      filtered.push({
        id: 'new',
        name: searchTerm.trim(),
        description: null,
        isExisting: false,
      });
    }

    setSuggestions(filtered);
  }, [products, searchTerm]);

  const handleCreateNewProduct = async (name: string, description?: string | null) => {
    setIsCreatingNew(true);
    try {
      const payload: CreateProductPurchasedPayload = {
        name: name.trim(),
        description: description?.trim() ? description.trim() : undefined,
      };

      const newProduct = await createProductMutation.mutateAsync(payload);

      const productResult: ProductPurchasedSearchResult = {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description || null,
        isExisting: true,
      };

      setSelectedProduct(productResult);
      setSearchTerm(newProduct.name);
      setSuggestions([]);
      return productResult;
    } finally {
      setIsCreatingNew(false);
    }
  };

  const handleSelectProduct = (product: ProductPurchasedSearchResult) => {
    if (product.isExisting) {
      setSelectedProduct(product);
      setSearchTerm(product.name);
      setSuggestions([]);
      return product;
    }

    return handleCreateNewProduct(product.name);
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setSearchTerm('');
    setSuggestions([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    selectedProduct,
    isLoading,
    isCreatingNew,
    handleSelectProduct,
    handleCreateNewProduct,
    clearSelection,
    createProductMutation,
  };
};
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../types/resource';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchResources, getResource, createResource, updateResource, deleteResource } from '../action/resources';

export interface ResourceSearchResult {
  id: string;
  name: string;
  observation: string | null;
  isExisting: boolean;
}

export const useFetchResources = () => {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });
};

export const useFetchResource = (id: string) => {
  return useQuery<Resource, Error>({
    queryKey: ['resource', id],
    queryFn: () => getResource(id),
    enabled: !!id, // Only fetch if id is provided
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, CreateResourcePayload>({
    mutationFn: createResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation<Resource, Error, { id: string; payload: UpdateResourcePayload }>({
    mutationFn: ({ id, payload }) => updateResource(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

// Hook de búsqueda de recursos con autocompletado
export const useResourceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ResourceSearchResult[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceSearchResult | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const { data: resources, isLoading } = useFetchResources();
  const createResourceMutation = useCreateResource();

  // Filtrar recursos basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm || !searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = resources?.filter((resource: Resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).map((resource: Resource) => ({
      id: resource.id,
      name: resource.name,
      observation: resource.observation || null,
      isExisting: true
    })) || [];

    // Si no hay coincidencias exactas, sugerir crear un nuevo recurso
    const hasExactMatch = filtered.some(resource => 
      resource.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!hasExactMatch && searchTerm.trim().length > 2) {
      filtered.push({
        id: 'new',
        name: searchTerm.trim(),
        observation: null,
        isExisting: false
      });
    }

    setSuggestions(filtered);
  }, [searchTerm, resources]);

  const handleCreateNewResource = async (name: string, observation?: string) => {
    setIsCreatingNew(true);
    try {
      const newResource = await createResourceMutation.mutateAsync({
        name: name.trim(),
        observation: observation || null
      });
      
      const resourceResult: ResourceSearchResult = {
        id: newResource.id,
        name: newResource.name,
        observation: newResource.observation || null,
        isExisting: true
      };
      
      setSelectedResource(resourceResult);
      setSearchTerm(newResource.name);
      setSuggestions([]);
      return resourceResult;
    } catch (error) {
      console.error('Error creating new resource:', error);
      throw error;
    } finally {
      setIsCreatingNew(false);
    }
  };

  const handleSelectResource = (resource: ResourceSearchResult) => {
    if (resource.isExisting) {
      setSelectedResource(resource);
      setSearchTerm(resource.name);
      setSuggestions([]);
    } else {
      // Para recursos nuevos, necesitamos crear el recurso primero
      return handleCreateNewResource(resource.name);
    }
  };

  const clearSelection = () => {
    setSelectedResource(null);
    setSearchTerm('');
    setSuggestions([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    selectedResource,
    isLoading,
    isCreatingNew,
    handleSelectResource,
    handleCreateNewResource,
    clearSelection,
    createResourceMutation
  };
};


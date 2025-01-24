import { Categorie, UpdateCategoriePayload, CreateCategoriePayload } from "../types/categorie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategorie, createCategorie, updateCategorie, fetchCategories } from "../action/categories";

export const useFetchCategories = () => {
    return useQuery<Categorie[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories
    });
    }

export const useCreateCategorie = () => {
    const queryClient = useQueryClient();
    return useMutation<Categorie, Error, CreateCategoriePayload>({
        mutationFn: createCategorie,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
    }

export const useUpdateCategorie = () => {
    const queryClient = useQueryClient();
    return useMutation<Categorie, Error, {
        id: string;
        payload: UpdateCategoriePayload;
    }>({
        mutationFn: ({
            id,
            payload
        }) => updateCategorie(id, payload),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
    }

export const useDeleteCategorie = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: deleteCategorie,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
}

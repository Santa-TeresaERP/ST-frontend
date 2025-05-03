import { Categorie, UpdateCategoriePayload, CreateCategoriePayload } from "../types/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategories, createCategories, updateCategories, fetchCategories } from "../../production/action/categories";

export const useFetchCategories = () => {
    return useQuery<Categorie[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories
    });
    }

export const useCreateCategories = () => {
    const queryClient = useQueryClient();
    return useMutation<Categorie, Error, CreateCategoriePayload>({
        mutationFn: createCategories,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
    }

export const useUpdateCategories = () => {
    const queryClient = useQueryClient();
    return useMutation<Categorie, Error, {
        id: string;
        payload: UpdateCategoriePayload;
    }>({
        mutationFn: ({
            id,
            payload
        }) => updateCategories(id, payload),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
    }

export const useDeleteCategories = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: deleteCategories,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["categories"]
        })
    });
}

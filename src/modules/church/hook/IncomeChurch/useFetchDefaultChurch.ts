import { useState, useEffect } from 'react';
import { fetchChurches } from '../../actions/church';
// 1. Corregimos el typo "hurchAttributes" -> "ChurchAttributes"
// Usamos ChurchAttributes porque tu interfaz define que el 'id' es obligatorio (string), no opcional.
import type { ChurchAttributes } from '../../types/church';

export default function useFetchDefaultChurch() {
  const [churchId, setChurchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDefaultChurch = async () => {
      try {
        setLoading(true);
        // Forzamos el tipo aquí si 'fetchChurches' devuelve un tipo genérico o de Zod con id opcional
        const response = await fetchChurches() as unknown as ChurchAttributes[];
        
        if (response && response.length > 0) {
          // 2. Solución segura: Si por alguna razón el id viene undefined, usamos null
          setChurchId(response[0].id || null);
        } else {
          setError("No se encontraron iglesias registradas.");
        }
      } catch (e: unknown) { // 3. Cambiamos 'any' por 'unknown' para cumplir con el linter
        console.error(e);
        // Hacemos un type narrowing seguro o un fallback genérico
        const errorMessage = e instanceof Error ? e.message : "Error desconocido al obtener la iglesia";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getDefaultChurch();
  }, []);

  return { churchId, loading, error };
}
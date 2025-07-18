import { TypePerson } from '../types/typePerson';

const BASE_URL = '/type_person';

export const getTypePersons = async (): Promise<TypePerson[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener tipos de persona');
  return res.json();
};

export const getTypePerson = async (id: string): Promise<TypePerson> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener tipo de persona');
  return res.json();
};

export const createTypePerson = async (data: Omit<TypePerson, 'id'>): Promise<TypePerson> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tipo de persona');
  return res.json();
};

export const updateTypePerson = async (id: string, data: Partial<TypePerson>): Promise<TypePerson> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tipo de persona');
  return res.json();
};

export const deleteTypePerson = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tipo de persona');
}; 
import * as yup from 'yup';

export const placeSchema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string(),
  // Agrega validaciones según tu modelo backend
});

// Test para diagnosticar por qué las fechas salen N/A

// Simular la función actual
function formatDateLocal(dateInput, locale = 'es-ES') {
  console.log('Input recibido:', dateInput, 'Tipo:', typeof dateInput);
  
  if (!dateInput) {
    console.log('Input es falsy, retornando N/A');
    return 'N/A';
  }

  let date;
  
  if (typeof dateInput === 'string') {
    console.log('Es string, parseando...');
    const parts = dateInput.split('-');
    console.log('Parts:', parts);
    const [year, month, day] = parts.map(Number);
    console.log('Year:', year, 'Month:', month, 'Day:', day);
    date = new Date(year, month - 1, day);
    console.log('Date creado:', date);
  } else {
    console.log('No es string, usando directamente');
    date = dateInput;
  }
  
  if (isNaN(date.getTime())) {
    console.log('Date es inválido, retornando N/A');
    return 'N/A';
  }

  const result = date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  console.log('Resultado final:', result);
  return result;
}

console.log('=== Diagnostico de fechas N/A ===');

// Test con diferentes formatos que podrían venir del backend
const testInputs = [
  '2025-09-11',           // String normal
  '2025-09-11T00:00:00Z', // ISO string
  '2025-09-11T00:00:00.000Z', // ISO con milisegundos
  new Date('2025-09-11'), // Date object
  '2025-9-11',            // Sin ceros padding
  '11/09/2025',           // Formato diferente
  null,                   // Null
  undefined,              // Undefined
  '',                     // String vacío
  '2025-13-40',          // Fecha inválida
];

testInputs.forEach((input, index) => {
  console.log(`\n--- Test ${index + 1} ---`);
  try {
    const result = formatDateLocal(input);
    console.log(`Input: ${JSON.stringify(input)} -> Output: "${result}"`);
  } catch (error) {
    console.log(`Input: ${JSON.stringify(input)} -> ERROR: ${error.message}`);
  }
});

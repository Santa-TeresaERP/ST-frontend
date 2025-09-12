// Test de la función formatDateLocal actualizada que maneja ISO strings

function formatDateLocal(dateInput, locale = 'es-ES') {
  if (!dateInput) return 'N/A';

  let date;
  
  if (typeof dateInput === 'string') {
    // Handle both YYYY-MM-DD and ISO formats
    let dateStr = dateInput;
    
    // If it's an ISO string, extract just the date part
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    // For Date objects, use directly
    date = dateInput;
  }
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

console.log('=== Test de formatDateLocal actualizada ===');

const testInputs = [
  '2025-09-11',                    // Formato simple
  '2025-09-11T00:00:00Z',         // ISO con Z
  '2025-09-11T00:00:00.000Z',     // ISO con milisegundos
  '2025-09-11T05:30:00.000Z',     // ISO con hora diferente
  '2025-01-01T23:59:59.999Z',     // Caso extremo
  null,                            // Null
  undefined,                       // Undefined
  '',                             // String vacío
];

console.log('Todas estas fechas deberían mostrar el día correcto:');

testInputs.forEach((input, index) => {
  const result = formatDateLocal(input);
  console.log(`${index + 1}. Input: ${JSON.stringify(input)}`);
  console.log(`   Output: "${result}"`);
  
  if (input && typeof input === 'string' && input.includes('2025-09-11')) {
    const showsCorrectDay = result.includes('11 sept');
    console.log(`   ¿Muestra día 11? ${showsCorrectDay ? '✅ SÍ' : '❌ NO'}`);
  }
  console.log('');
});

console.log('=== Verificación específica ===');
console.log('Si el backend envía "2025-09-11T00:00:00Z":');
console.log(`Resultado: "${formatDateLocal('2025-09-11T00:00:00Z')}"`);
console.log('¿Es "11 sept 2025"? (debería ser SÍ)');

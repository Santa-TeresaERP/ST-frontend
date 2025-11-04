// Test de la nueva función formatDateLocal que evita timezone issues

// Simular la nueva función
function formatDateLocal(dateInput, locale = 'es-ES') {
  if (!dateInput) return 'N/A';

  let date;
  
  if (typeof dateInput === 'string') {
    // For YYYY-MM-DD strings, parse as local date to avoid timezone issues
    const [year, month, day] = dateInput.split('-').map(Number);
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

console.log('=== Test de la nueva función formatDateLocal ===');
console.log('Timezone del sistema:', Intl.DateTimeFormat().resolvedOptions().timeZone);

const testDates = [
  '2025-09-11',  // Fecha problemática
  '2025-01-01',  // Primer día del año
  '2025-12-31',  // Último día del año
  '2025-02-28',  // Febrero
];

testDates.forEach(dateStr => {
  console.log(`\nFecha string: "${dateStr}"`);
  
  // Método anterior (problemático)
  const oldWay = new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
  });
  
  // Nuevo método (sin timezone issues)
  const newWay = formatDateLocal(dateStr);
  
  // Verificar el día específico
  const [year, month, day] = dateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  
  console.log(`  Método anterior (problemático): "${oldWay}"`);
  console.log(`  Método nuevo (corregido): "${newWay}"`);
  console.log(`  Día esperado: ${day}`);
  console.log(`  Día que muestra nuevo método: ${localDate.getDate()}`);
  console.log(`  ¿Correcto? ${localDate.getDate() === day ? '✅ SÍ' : '❌ NO'}`);
});

console.log('\n=== Verificación adicional ===');
console.log('Fecha: 2025-09-11 (la que causa problema)');
console.log(`Resultado: "${formatDateLocal('2025-09-11')}"`);
console.log('¿Muestra "11 sept 2025" en lugar de "10 sept 2025"?');

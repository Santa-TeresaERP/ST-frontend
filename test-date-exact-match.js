// Test que verifica que nuestro formatDateLocal produce el mismo resultado que el inventario

// Simular la función tal como está en nuestro utils
function formatDateLocal(dateInput, locale = 'es-ES') {
  if (!dateInput) return 'N/A';

  let date;
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
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

// Simular exactamente lo que hace el inventario (patrón que funciona)
function inventoryPattern(dateString) {
  // Esto es lo que hace el inventario cuando funciona correctamente
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

console.log('=== Test de coincidencia exacta con inventario ===');

const testDates = [
  '2025-01-11',  // 11 de enero
  '2025-09-11',  // 11 de septiembre (fecha problemática)
  '2025-12-25',  // 25 de diciembre
  '2024-02-29',  // Año bisiesto
];

testDates.forEach(dateStr => {
  const ourResult = formatDateLocal(dateStr);
  const inventoryResult = inventoryPattern(dateStr);
  const match = ourResult === inventoryResult;
  
  console.log(`\nFecha: ${dateStr}`);
  console.log(`  Nuestro resultado:  "${ourResult}"`);
  console.log(`  Resultado inventario: "${inventoryResult}"`);
  console.log(`  ¿Coinciden? ${match ? '✅ SÍ' : '❌ NO'}`);
  
  if (!match) {
    console.log(`  ⚠️  DIFERENCIA DETECTADA!`);
  }
});

console.log('\n=== Verificación con Date object ===');
const dateObj = new Date('2025-09-11');
console.log(`Date object: ${dateObj}`);
console.log(`Nuestro formato: "${formatDateLocal(dateObj)}"`);
console.log(`Inventario formato: "${inventoryPattern('2025-09-11')}"`);

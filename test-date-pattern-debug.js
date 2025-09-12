// Test para entender la diferencia entre los dos patrones de fecha

console.log('=== Comparación de patrones de fecha ===');
console.log('Fecha actual del sistema:', new Date().toString());
console.log('Timezone del sistema:', Intl.DateTimeFormat().resolvedOptions().timeZone);

const testDate = '2025-09-11'; // Fecha que se guarda correctamente

console.log(`\nFecha de prueba: "${testDate}"`);

// Patrón 1: new Date(dateString).toLocaleDateString() (usado en movements)
const pattern1 = new Date(testDate).toLocaleDateString();
console.log(`Patrón 1 - new Date().toLocaleDateString(): "${pattern1}"`);

// Patrón 2: new Date(dateString).toLocaleDateString('es-ES') 
const pattern2 = new Date(testDate).toLocaleDateString('es-ES');
console.log(`Patrón 2 - con locale 'es-ES': "${pattern2}"`);

// Patrón 3: con opciones específicas (como formatDateLocal)
const pattern3 = new Date(testDate).toLocaleDateString('es-ES', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
console.log(`Patrón 3 - con opciones específicas: "${pattern3}"`);

// Información de debug
const dateObj = new Date(testDate);
console.log(`\nInformación de debug:`);
console.log(`Date object: ${dateObj}`);
console.log(`getDate(): ${dateObj.getDate()}`);
console.log(`getMonth(): ${dateObj.getMonth() + 1}`);
console.log(`getFullYear(): ${dateObj.getFullYear()}`);
console.log(`getTimezoneOffset(): ${dateObj.getTimezoneOffset()} minutos`);

// Test específico: ¿Qué día muestra realmente?
console.log(`\n¿Qué día se muestra realmente?`);
console.log(`- Día esperado: 11`);
console.log(`- Día que muestra pattern1: ${new Date(testDate).getDate()}`);
console.log(`- Día en string pattern1: "${new Date(testDate).toLocaleDateString()}"`);

// Test con otra fecha problemática
console.log(`\n=== Test con otra fecha ===`);
const testDate2 = '2025-01-01';
console.log(`Fecha: ${testDate2}`);
console.log(`Pattern1: "${new Date(testDate2).toLocaleDateString()}"`);
console.log(`Día que muestra: ${new Date(testDate2).getDate()}`);

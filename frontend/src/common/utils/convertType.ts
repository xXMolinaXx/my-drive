export function convertBits(bits: number) {
  const units = ['bits', 'bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;

  // Convertimos a bytes para simplificar los cálculos
  let size = bits / 8;

  // Dividir el tamaño hasta encontrar el mejor formato
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  // Redondeamos a dos decimales y devolvemos el resultado con su tipo y tamaño
  return `${size.toFixed(2)} ${units[index]}`;
}
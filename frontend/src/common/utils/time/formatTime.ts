export function createTime(horas:number, minutos:number) {
  const horaFormateada = horas?.toString()?.padStart(2, '0');
  const minutosFormateados = minutos?.toString()?.padStart(2, '0');
  return `${horaFormateada ? horaFormateada : '00'}:${
    minutosFormateados ? minutosFormateados : '00'
  }`;
}
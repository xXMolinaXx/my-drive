export function createTime(horas:number, minutos:number) {
  const horaFormateada = horas?.toString()?.padStart(2, '0');
  const minutosFormateados = minutos?.toString()?.padStart(2, '0');
  return `${horaFormateada ? horaFormateada : '00'}:${
    minutosFormateados ? minutosFormateados : '00'
  }`;
}
export function createTimeAmPm(hour:number, minutes:number) {
  let hour_ = hour;
  let minute_ = minutes;
  let amPm: 'AM'| 'PM' = 'AM'
  if( hour > 12){
    amPm = 'PM'
    hour_ %= 12;
    hour_ = hour_ || 12;
  }

  const horaFormateada = hour_?.toString()?.padStart(2, '0');
  const minutosFormateados = minute_?.toString()?.padStart(2, '0');
  return `${horaFormateada ? horaFormateada : '00'}:${
    minutosFormateados ? minutosFormateados : '00'
  } ${amPm}`;
}
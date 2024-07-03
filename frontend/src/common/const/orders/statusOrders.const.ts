export const orderStatus = [
  {
    label: 'En espera',
    value: 'en espera',
    disabled: true,
  },
  {
    label: 'Generación pago on click',
    value: 'generacion pago on click',
    disabled: true,
  },
  {
    label: 'Toma de muestra',
    value: 'toma de muestra',
    disabled: false,
  },
  {
    label: 'Realizar pago',
    value: 'realizar pago',
    disabled: false,
  },
  {
    label: 'Agregación del recibo',
    value: 'agregacion del recibo',
    disabled: true,
  },
  {
    label: 'Finalizada',
    value: 'finalizada',
    disabled: false,
  },
  {
    label: 'Cancelada',
    value: 'cancelada',
    disabled: false,
  },

]
export const orderStatusFlebotomista = [
  orderStatus[2],
  orderStatus[5],
  orderStatus[6],
]

export const orderStatusAdmin = [
  orderStatus[0],
  orderStatus[2],
  orderStatus[4],
  orderStatus[1],
  orderStatus[5],
  orderStatus[6]
]
export const orderStatus = [
  {
    label: 'En espera',
    value: 'en espera'
  },

  {
    label: 'Generación pago on click',
    value: 'generacion pago on click'
  },
  {
    label: 'Toma de muestra',
    value: 'toma de muestra'
  },
  {
    label: 'Realizar pago',
    value: 'realizar pago'
  },
  {
    label: 'Agregación del recibo',
    value: 'agregacion del recibo'
  },
  {
    label: 'Finalizada',
    value: 'finalizada'
  },
  {
    label: 'Cancelada',
    value: 'cancelada'
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
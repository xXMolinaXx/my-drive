export interface IOrder {
  _id: string
  cart: Cart[]
  finalPayment: number
  userId: string
  branch: string
  status: string
  reservationDate: ReservationDate
  createdAt: string
  updatedAt: string
  __v: number
  user: user[]
  isPayed: boolean
  urlPayment: string
  imagePaymentName: string
}
interface user {

  _id: string,
  fullName: string,
  identification: string,
  telphone: string,
  DNI: string,
  email: string

}
export interface Cart {
  name: string
  price: number
  amount: number
  _id: string
}

export interface ReservationDate {
  date: number
  hour: number
  minute: number
  month: number
  year: number
}
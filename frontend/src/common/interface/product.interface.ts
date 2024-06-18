export interface IProduct {
  _id?: string
  name: string
  price: number
  category: string
  __v?: number
  amount?:number
}
export interface IProductState {
  products: IProduct[],
  amountProducts: number,
}
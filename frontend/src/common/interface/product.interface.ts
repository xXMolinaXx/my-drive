export interface IProduct {
  _id?: string
  name: string
  price: number
  category: string
  __v?: number
  amount?:number
  categories?: ICategories[]
}
export interface ICategories {
  _id: string
  name: string
}
export interface IProductState {
  products: IProduct[],
  amountProducts: number,
}
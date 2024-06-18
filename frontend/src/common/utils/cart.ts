import { IProduct } from "../interface/product.interface"

const keyCart = 'cart'
export function addToCart(product:IProduct,amount = 1) {
  if(localStorage.getItem(keyCart) ){
    const cart = JSON.parse(localStorage.getItem(keyCart) || '2' )
    cart.push({
      name: product.name,
      price: product.price,
      amount:amount,
      _id:product._id
    })
    localStorage.setItem(keyCart, JSON.stringify(cart))
  } else {
    localStorage.setItem(keyCart, JSON.stringify([{
      name: product.name,
      price: product.price,
      amount: amount,
      _id:product._id
    }]))
  }
  
}
export function getCart():IProduct[]{
  const cart = localStorage.getItem(keyCart)
  if(cart) return JSON.parse(cart);
  else return []
}
export function setLocalStorageProduct(cart:IProduct[]){
  localStorage.setItem(keyCart, JSON.stringify(cart))
}
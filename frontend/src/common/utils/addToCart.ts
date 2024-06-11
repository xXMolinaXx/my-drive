import { IProduct } from "../interface/product.interface"

const keyCart = 'cart'
export function addToCart(product:IProduct) {
  if(localStorage.getItem('cart') ){
    const cart = JSON.parse(localStorage.getItem(keyCart) || '2' )
    cart.push({
      name: product.name,
      price: product.price
    })
    localStorage.setItem(keyCart, JSON.stringify(cart))
  } else {
    localStorage.setItem(keyCart, JSON.stringify([{
      name: product.name,
      price: product.price
    }]))
  }
  
}
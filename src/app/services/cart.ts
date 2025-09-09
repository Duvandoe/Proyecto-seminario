import { Injectable } from '@angular/core';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];

  getCart() {
    return this.cart;
  }

  addToCart(product: Product) {
    this.cart.push(product);
  }

  removeFromCart(product: Product) {
    this.cart = this.cart.filter(item => item.id !== product.id);
  }

  clearCart() {
    this.cart = [];
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }
}



